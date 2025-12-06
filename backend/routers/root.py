from fastapi import APIRouter, HTTPException
from utils.supabase_client import supabase
import os

router = APIRouter()

@router.get("/")
def root():
    return {"status": "API is running"}

@router.get("/health")
async def health_check():
    return {"status": "ok"}

@router.get("/health/db")
async def database_health_check():
    """Check database connection health"""
    try:
        # Try a simple query to test the connection
        result = supabase.table("preregistrations").select("email").limit(1).execute()
        return {
            "status": "ok",
            "database": "connected",
            "supabase_url_configured": bool(os.getenv("SUPABASE_URL")),
            "supabase_key_configured": bool(os.getenv("SUPABASE_KEY"))
        }
    except Exception as e:
        error_msg = str(e)
        return {
            "status": "error",
            "database": "disconnected",
            "error": error_msg,
            "supabase_url_configured": bool(os.getenv("SUPABASE_URL")),
            "supabase_key_configured": bool(os.getenv("SUPABASE_KEY")),
            "supabase_url_preview": os.getenv("SUPABASE_URL", "")[:30] + "..." if os.getenv("SUPABASE_URL") else "not set"
        }