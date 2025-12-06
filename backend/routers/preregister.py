from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, EmailStr
import os
import httpx
from utils.email import send_prereg_email
from utils.supabase_client import supabase

router = APIRouter()

class PreregisterRequest(BaseModel):
    name: str
    email: EmailStr
    captchaToken: str

@router.post("/preregister")
async def preregister(data: PreregisterRequest):
    # 1. Verify reCAPTCHA (skip if secret not configured for development)
    secret = os.getenv("RECAPTCHA_SECRET")
    if secret:
        async with httpx.AsyncClient() as client:
            resp = await client.post(
                "https://www.google.com/recaptcha/api/siteverify",
                data={"secret": secret, "response": data.captchaToken},
            )
            if not resp.json().get("success"):
                raise HTTPException(status_code=400, detail="CAPTCHA failed")
    else:
        print("⚠️  WARNING: RECAPTCHA_SECRET not set - skipping reCAPTCHA verification (development mode)")

    # 2. Check if email already exists
    try:
        existing_response = supabase.table("preregistrations").select("email").eq("email", data.email).execute()
        
        if existing_response.data:
            # Email already exists - return special status
            return {
                "message": "This Email is Already Pre-Registered! Stay Tuned for more information",
                "status": "already_registered"
            }
    except Exception as e:
        error_msg = str(e)
        print(f"Database check error: {error_msg}")
        
        # Provide more specific error messages
        if "Name or service not known" in error_msg or "Errno -2" in error_msg:
            raise HTTPException(
                status_code=500, 
                detail="Database connection failed. Please check SUPABASE_URL configuration."
            )
        elif "connection" in error_msg.lower() or "network" in error_msg.lower():
            raise HTTPException(
                status_code=500,
                detail="Unable to connect to database. Please try again later."
            )
        else:
            raise HTTPException(status_code=500, detail=f"Error checking database: {error_msg}")

    # 3. Insert new email into Supabase
    try:
        response = supabase.table("preregistrations").insert({
            "name": data.name,
            "email": data.email
        }).execute()
    except Exception as e:
        error_msg = str(e)
        print(f"Supabase insert error: {error_msg}")
        
        # Provide more specific error messages
        if "Name or service not known" in error_msg or "Errno -2" in error_msg:
            raise HTTPException(
                status_code=500,
                detail="Database connection failed. Please check SUPABASE_URL configuration."
            )
        elif "connection" in error_msg.lower() or "network" in error_msg.lower():
            raise HTTPException(
                status_code=500,
                detail="Unable to connect to database. Please try again later."
            )
        else:
            raise HTTPException(status_code=500, detail=f"Error saving data: {error_msg}")

    # 4. Send confirmation email for new registrations
    try:
        await send_prereg_email(data.email, data.name)
    except Exception as e:
        print("Email sending failed:", e)
        raise HTTPException(status_code=500, detail="Failed to send confirmation email")

    return {
        "message": "Successfully Pre-Registered",
        "status": "success"
    }
