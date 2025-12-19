"""
Authentication helper functions for managing users.

This module provides utilities for user management, including
auto-verification of email addresses to bypass Supabase's
email confirmation requirement.
"""

import os
import logging
from datetime import datetime
from supabase import create_client, Client

logger = logging.getLogger(__name__)


def get_admin_client() -> Client:
    """
    Get Supabase client with admin privileges (service role).

    IMPORTANT: Only use this server-side. Never expose the service role key to the client.

    Returns:
        Supabase client with admin permissions

    Raises:
        ValueError: If service role key is not set
    """
    url = os.getenv("SUPABASE_URL")
    # Try SUPABASE_SERVICE_ROLE_KEY first, fallback to SUPABASE_KEY
    service_role_key = os.getenv("SUPABASE_SERVICE_ROLE_KEY") or os.getenv("SUPABASE_KEY")

    if not service_role_key:
        raise ValueError(
            "SUPABASE_SERVICE_ROLE_KEY or SUPABASE_KEY is required for admin operations. "
            "Get it from: Supabase Dashboard > Settings > API > service_role key"
        )

    return create_client(url, service_role_key)


async def auto_verify_user_email(user_id: str) -> bool:
    """
    Automatically verify a user's email address.

    This is a workaround for when Supabase Cloud doesn't allow disabling
    email confirmations via the dashboard. It marks the user's email as
    confirmed immediately after signup.

    Args:
        user_id: The Supabase user ID (UUID)

    Returns:
        True if verification succeeded, False otherwise

    Example:
        >>> await auto_verify_user_email("550e8400-e29b-41d4-a716-446655440000")
        True
    """
    try:
        admin_client = get_admin_client()

        # Update the user to mark their email as confirmed
        response = admin_client.auth.admin.update_user_by_id(
            user_id,
            {
                "email_confirmed_at": datetime.utcnow().isoformat()
            }
        )

        logger.info(f"Successfully auto-verified email for user {user_id}")
        return True

    except ValueError as e:
        logger.error(f"Configuration error: {e}")
        return False
    except Exception as e:
        logger.exception(f"Failed to auto-verify user {user_id}: {e}")
        return False


async def create_user_without_confirmation(email: str, password: str, metadata: dict = None) -> dict:
    """
    Create a user and immediately verify their email, bypassing confirmation.

    This combines user creation with auto-verification in a single operation.
    Use this instead of the regular signUp if you want to skip email confirmation.

    Args:
        email: User's email address
        password: User's password
        metadata: Optional user metadata (e.g., {"full_name": "John Doe"})

    Returns:
        dict with keys:
            - success (bool): Whether the operation succeeded
            - user (dict): User data if successful
            - error (str): Error message if failed

    Example:
        >>> result = await create_user_without_confirmation(
        ...     "user@example.com",
        ...     "securepass123",
        ...     {"full_name": "John Doe"}
        ... )
        >>> if result["success"]:
        ...     print(f"User created: {result['user']['email']}")
    """
    try:
        admin_client = get_admin_client()
        logger.info(f"Creating user with email: {email}")

        # Create user with admin privileges
        # email_confirm=True marks the email as verified immediately
        response = admin_client.auth.admin.create_user({
            "email": email,
            "password": password,
            "email_confirm": True,
            "user_metadata": metadata or {}
        })

        logger.info(f"Create user response: {response}")

        if response.user:
            logger.info(f"Created and verified user: {email}, id: {response.user.id}")
            return {
                "success": True,
                "user": response.user,
                "error": None
            }
        else:
            logger.error(f"User creation returned no user object")
            return {
                "success": False,
                "user": None,
                "error": "User creation failed - no user returned"
            }

    except ValueError as e:
        logger.error(f"Configuration error: {e}")
        return {
            "success": False,
            "user": None,
            "error": str(e)
        }
    except Exception as e:
        error_msg = str(e)
        # Check for common errors
        if "already registered" in error_msg.lower() or "already been registered" in error_msg.lower():
            error_msg = "An account with this email already exists. Please sign in instead."
        elif "invalid" in error_msg.lower() and "password" in error_msg.lower():
            error_msg = "Password must be at least 6 characters long."

        logger.exception(f"Failed to create user without confirmation: {e}")
        return {
            "success": False,
            "user": None,
            "error": error_msg
        }


async def bulk_verify_unconfirmed_users(limit: int = 100) -> dict:
    """
    Bulk verify all unconfirmed users (useful for migration or cleanup).

    WARNING: Use with caution. This will verify ALL unconfirmed users.

    Args:
        limit: Maximum number of users to verify in one batch

    Returns:
        dict with keys:
            - verified (int): Number of users verified
            - failed (int): Number of failures
            - errors (list): List of error messages
    """
    try:
        admin_client = get_admin_client()

        # List all unconfirmed users
        response = admin_client.auth.admin.list_users()
        users = response if isinstance(response, list) else []

        verified = 0
        failed = 0
        errors = []

        for user in users[:limit]:
            # Check if email is not confirmed
            if not user.email_confirmed_at:
                success = await auto_verify_user_email(user.id)
                if success:
                    verified += 1
                else:
                    failed += 1
                    errors.append(f"Failed to verify user {user.email}")

        logger.info(f"Bulk verification complete. Verified: {verified}, Failed: {failed}")
        return {
            "verified": verified,
            "failed": failed,
            "errors": errors
        }

    except Exception as e:
        logger.exception(f"Bulk verification failed: {e}")
        return {
            "verified": 0,
            "failed": 0,
            "errors": [str(e)]
        }
