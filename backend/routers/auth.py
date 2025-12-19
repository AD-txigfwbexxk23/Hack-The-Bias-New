"""
Authentication routes for user management.

These routes handle authentication-related operations that require
server-side privileges, such as auto-verifying user emails.
"""

from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel, EmailStr
from utils.auth import get_current_user
from utils.auth_helpers import auto_verify_user_email, create_user_without_confirmation
import logging

logger = logging.getLogger(__name__)

router = APIRouter()


class AutoVerifyRequest(BaseModel):
    """Request to auto-verify a user's email"""
    user_id: str


class CreateUserRequest(BaseModel):
    """Request to create a user without email confirmation"""
    email: EmailStr
    password: str
    full_name: str


@router.post("/auto-verify-email")
async def auto_verify_email(
    request: AutoVerifyRequest,
    current_user=Depends(get_current_user)
):
    """
    Auto-verify the current user's email address.

    This endpoint allows a user to verify their own email immediately after signup,
    bypassing the confirmation email requirement.

    Only the user themselves can verify their own email (verified via JWT).
    """
    # Ensure user can only verify their own email
    if current_user.id != request.user_id:
        raise HTTPException(
            status_code=403,
            detail="You can only verify your own email address"
        )

    success = await auto_verify_user_email(request.user_id)

    if success:
        return {
            "success": True,
            "message": "Email verified successfully"
        }
    else:
        raise HTTPException(
            status_code=500,
            detail="Failed to verify email. Please try again or contact support."
        )


@router.post("/create-user-verified")
async def create_user_verified(request: CreateUserRequest):
    """
    Create a new user with email already verified (no confirmation required).

    This is an alternative to the standard Supabase signUp that bypasses
    the email confirmation step entirely.

    WARNING: This endpoint should be rate-limited and protected against abuse.
    """
    result = await create_user_without_confirmation(
        email=request.email,
        password=request.password,
        metadata={"full_name": request.full_name}
    )

    if result["success"]:
        return {
            "success": True,
            "message": "User created successfully",
            "user": {
                "id": result["user"].id,
                "email": result["user"].email
            }
        }
    else:
        raise HTTPException(
            status_code=400,
            detail=result["error"] or "Failed to create user"
        )
