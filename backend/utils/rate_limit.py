"""
Rate limiting utility for API endpoints.

Provides configurable rate limiting with different tiers for different endpoint types.
In production, consider replacing in-memory store with Redis for distributed rate limiting.
"""

import time
import logging
from collections import defaultdict
from functools import wraps
from fastapi import HTTPException, Request

logger = logging.getLogger(__name__)

# In-memory rate limit stores (keyed by limiter name)
_rate_limit_stores: dict[str, dict[str, list[float]]] = defaultdict(lambda: defaultdict(list))


class RateLimitConfig:
    """Rate limit configurations for different endpoint types"""

    # Strict: For sensitive operations (signup, email verification)
    STRICT_WINDOW = 60  # 1 minute
    STRICT_MAX = 5  # 5 requests per minute

    # Standard: For authenticated operations (registration, file uploads)
    STANDARD_WINDOW = 60  # 1 minute
    STANDARD_MAX = 10  # 10 requests per minute

    # Admin: For admin endpoints (more lenient since already authenticated)
    ADMIN_WINDOW = 60  # 1 minute
    ADMIN_MAX = 30  # 30 requests per minute

    # Email: For email sending endpoints (prevent spam)
    EMAIL_WINDOW = 300  # 5 minutes
    EMAIL_MAX = 5  # 5 emails per 5 minutes per user


def get_client_ip(request: Request) -> str:
    """Extract client IP, handling proxies"""
    forwarded = request.headers.get("x-forwarded-for")
    if forwarded:
        return forwarded.split(",")[0].strip()
    return request.client.host if request.client else "unknown"


def check_rate_limit(
    key: str,
    store_name: str,
    window_seconds: int,
    max_requests: int
) -> bool:
    """
    Check if key has exceeded rate limit.

    Args:
        key: Identifier (IP address, user ID, etc.)
        store_name: Name of the rate limit store
        window_seconds: Time window in seconds
        max_requests: Maximum requests allowed in window

    Returns:
        True if request is allowed, False if rate limited
    """
    now = time.time()
    store = _rate_limit_stores[store_name]

    # Clean old entries
    store[key] = [t for t in store[key] if now - t < window_seconds]

    # Check limit
    if len(store[key]) >= max_requests:
        return False

    # Record this request
    store[key].append(now)
    return True


def rate_limit_by_ip(
    store_name: str,
    window_seconds: int = RateLimitConfig.STANDARD_WINDOW,
    max_requests: int = RateLimitConfig.STANDARD_MAX,
    error_message: str = "Too many requests. Please try again later."
):
    """
    Decorator/dependency for rate limiting by IP address.

    Usage as a function call in endpoint:
        rate_limit_by_ip("admin", 60, 30)(request)
    """
    def check(request: Request):
        client_ip = get_client_ip(request)
        if not check_rate_limit(client_ip, store_name, window_seconds, max_requests):
            logger.warning(f"Rate limit exceeded for IP {client_ip} on {store_name}")
            raise HTTPException(status_code=429, detail=error_message)
        return client_ip
    return check


def rate_limit_by_user(
    user_id: str,
    store_name: str,
    window_seconds: int = RateLimitConfig.EMAIL_WINDOW,
    max_requests: int = RateLimitConfig.EMAIL_MAX,
    error_message: str = "Too many requests. Please try again later."
):
    """
    Check rate limit by user ID (for authenticated endpoints).

    Args:
        user_id: The authenticated user's ID
        store_name: Name of the rate limit store
        window_seconds: Time window in seconds
        max_requests: Maximum requests allowed in window
        error_message: Custom error message

    Raises:
        HTTPException with 429 status if rate limited
    """
    if not check_rate_limit(user_id, store_name, window_seconds, max_requests):
        logger.warning(f"Rate limit exceeded for user {user_id} on {store_name}")
        raise HTTPException(status_code=429, detail=error_message)


# Pre-configured rate limiters for common use cases
def strict_rate_limit(request: Request) -> str:
    """Strict rate limiting for sensitive operations (5/min by IP)"""
    return rate_limit_by_ip(
        "strict",
        RateLimitConfig.STRICT_WINDOW,
        RateLimitConfig.STRICT_MAX,
        "Too many attempts. Please wait a minute before trying again."
    )(request)


def admin_rate_limit(request: Request) -> str:
    """Rate limiting for admin endpoints (30/min by IP)"""
    return rate_limit_by_ip(
        "admin",
        RateLimitConfig.ADMIN_WINDOW,
        RateLimitConfig.ADMIN_MAX,
        "Too many admin requests. Please slow down."
    )(request)


def standard_rate_limit(request: Request) -> str:
    """Standard rate limiting for authenticated operations (10/min by IP)"""
    return rate_limit_by_ip(
        "standard",
        RateLimitConfig.STANDARD_WINDOW,
        RateLimitConfig.STANDARD_MAX,
        "Too many requests. Please try again later."
    )(request)
