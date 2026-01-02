import logging
from fastapi import APIRouter, Depends, HTTPException, Query, Request
from utils.auth import get_current_user
from utils.auth_helpers import get_admin_client
from utils.storage import get_guardian_form_url
from utils.rate_limit import admin_rate_limit


router = APIRouter()
logger = logging.getLogger(__name__)


def check_is_admin(current_user) -> bool:
    """Check if user has is_admin=true in the users table."""
    user_id = getattr(current_user, "id", None)
    if not user_id:
        return False

    try:
        admin_client = get_admin_client()
        result = (
            admin_client
            .table("users")
            .select("is_admin")
            .eq("id", str(user_id))
            .single()
            .execute()
        )

        if result.data and result.data.get("is_admin") is True:
            return True
        return False
    except Exception as exc:
        logger.warning("Failed to check admin status for user %s: %s", user_id, exc)
        return False


def ensure_admin_access(current_user):
    if not check_is_admin(current_user):
        raise HTTPException(status_code=403, detail="Admin access required")


@router.get("/admin/me")
async def admin_me(
    request: Request,
    current_user=Depends(get_current_user),
    _rate_limit: str = Depends(admin_rate_limit)
):
    return {"is_admin": check_is_admin(current_user)}


@router.get("/admin/registrations")
async def list_registrations(
    request: Request,
    current_user=Depends(get_current_user),
    _rate_limit: str = Depends(admin_rate_limit)
):
    ensure_admin_access(current_user)

    try:
        admin_client = get_admin_client()
        result = (
            admin_client
            .table("registrations")
            .select("*")
            .order("created_at", desc=True)
            .execute()
        )

        if getattr(result, "error", None):
            error_message = getattr(result.error, "message", None) or "Failed to load registrations"
            raise HTTPException(status_code=500, detail=error_message)

        if result.data is None:
            return {"registrations": []}

        return {"registrations": result.data}
    except Exception as exc:
        logger.exception("Failed to load registrations: %s", exc)
        raise HTTPException(status_code=500, detail="Failed to load registrations") from exc


@router.get("/admin/preregistrations")
async def list_preregistrations(
    request: Request,
    current_user=Depends(get_current_user),
    _rate_limit: str = Depends(admin_rate_limit)
):
    ensure_admin_access(current_user)

    try:
        admin_client = get_admin_client()
        result = (
            admin_client
            .table("preregistrations")
            .select("*")
            .order("created_at", desc=True)
            .execute()
        )

        if getattr(result, "error", None):
            error_message = getattr(result.error, "message", None) or "Failed to load preregistrations"
            raise HTTPException(status_code=500, detail=error_message)

        if result.data is None:
            return {"preregistrations": []}

        return {"preregistrations": result.data}
    except Exception as exc:
        logger.exception("Failed to load preregistrations: %s", exc)
        raise HTTPException(status_code=500, detail="Failed to load preregistrations") from exc


@router.get("/admin/consent-form-url")
async def get_consent_form_signed_url(
    request: Request,
    path: str = Query(..., description="The consent_form_url path from the registration"),
    current_user=Depends(get_current_user),
    _rate_limit: str = Depends(admin_rate_limit)
):
    """Generate a signed URL for viewing a consent form"""
    ensure_admin_access(current_user)

    if not path:
        raise HTTPException(status_code=400, detail="Path is required")

    # Validate path format to prevent path traversal attacks
    # Expected format: {user_id}/{uuid}.{ext}
    if ".." in path or path.startswith("/") or "\\" in path:
        raise HTTPException(status_code=400, detail="Invalid path format")

    signed_url = get_guardian_form_url(path)
    if not signed_url:
        raise HTTPException(status_code=404, detail="Could not generate signed URL for consent form")

    return {"signed_url": signed_url}
