from fastapi import APIRouter, HTTPException, Depends, UploadFile, File, Form
from typing import Optional
from pydantic import BaseModel
import random
import string
from utils.supabase_client import supabase
from utils.auth import get_current_user
from utils.storage import upload_guardian_form
from utils.email import send_google_signup_email
from models.registration import RegistrationRequest, RegistrationResponse, EducationLevel


class GoogleSignupEmailRequest(BaseModel):
    email: str
    name: str


def generate_hacker_code(length=5):
    """Generate a unique 5-character alphanumeric code"""
    chars = string.ascii_uppercase + string.digits
    while True:
        code = ''.join(random.choices(chars, k=length))
        # Check if code already exists
        existing = supabase.table("registrations").select("id").eq("hacker_code", code).execute()
        if not existing.data:
            return code

router = APIRouter()


@router.post("/register", response_model=RegistrationResponse)
async def register(
    # Form fields - Demographics
    education_level: str = Form(...),
    education_level_other: Optional[str] = Form(None),
    gender_identity: str = Form(...),
    grade: Optional[str] = Form(None),
    year: Optional[str] = Form(None),
    dietary_restrictions: Optional[str] = Form(None),
    # Experience
    hackathon_experience: bool = Form(False),
    hackathon_count: Optional[int] = Form(None),
    relevant_skills: Optional[str] = Form(None),
    interested_in_beginner: bool = Form(False),
    # Interest
    why_interested: str = Form(...),
    creative_project: str = Form(...),
    # Logistics
    staying_overnight: bool = Form(False),
    general_comments: Optional[str] = Form(None),
    # Consent
    rules_consent: bool = Form(False),
    photo_release_signature: str = Form(...),
    is_minor: bool = Form(False),
    # File upload
    guardian_form: Optional[UploadFile] = File(None),
    # Auth
    current_user=Depends(get_current_user)
):
    """Register a new hacker for the hackathon"""

    # Validate with Pydantic model
    try:
        registration_data = RegistrationRequest(
            education_level=EducationLevel(education_level),
            education_level_other=education_level_other,
            grade=grade,
            year=year,
            gender_identity=gender_identity,
            dietary_restrictions=dietary_restrictions,
            hackathon_experience=hackathon_experience,
            hackathon_count=hackathon_count,
            relevant_skills=relevant_skills,
            interested_in_beginner=interested_in_beginner,
            why_interested=why_interested,
            creative_project=creative_project,
            staying_overnight=staying_overnight,
            general_comments=general_comments,
            rules_consent=rules_consent,
            photo_release_signature=photo_release_signature,
            is_minor=is_minor,
        )
    except ValueError as e:
        raise HTTPException(status_code=422, detail=str(e))

    user_id = current_user.id
    email = current_user.email
    # Get full name from user metadata or fallback to email prefix
    full_name = current_user.user_metadata.get('full_name') or current_user.user_metadata.get('name') or email.split('@')[0]

    # Check if already registered
    try:
        existing = supabase.table("registrations").select("id").eq("user_id", user_id).execute()
        if existing.data:
            raise HTTPException(status_code=400, detail="You have already registered")
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

    # Handle guardian form upload if minor
    guardian_form_url = None
    if is_minor:
        if not guardian_form:
            raise HTTPException(
                status_code=400,
                detail="Guardian consent form is required for participants under 18"
            )
        guardian_form_url = await upload_guardian_form(guardian_form, user_id)

    # Generate unique hacker code
    hacker_code = generate_hacker_code()

    # Prepare data for insertion
    db_data = {
        "user_id": user_id,
        "email": email,
        "full_name": full_name,
        "hacker_code": hacker_code,
        "education_level": registration_data.education_level.value,
        "education_level_other": registration_data.education_level_other,
        "grade": registration_data.grade,
        "year": registration_data.year,
        "gender_identity": registration_data.gender_identity,
        "dietary_restrictions": registration_data.dietary_restrictions,
        "hackathon_experience": registration_data.hackathon_experience,
        "hackathon_count": registration_data.hackathon_count,
        "relevant_skills": registration_data.relevant_skills,
        "interested_in_beginner": registration_data.interested_in_beginner,
        "why_interested": registration_data.why_interested,
        "creative_project": registration_data.creative_project,
        "staying_overnight": registration_data.staying_overnight,
        "general_comments": registration_data.general_comments,
        "rules_consent": registration_data.rules_consent,
        "photo_release_signature": registration_data.photo_release_signature,
        "is_minor": registration_data.is_minor,
        "guardian_form_url": guardian_form_url,
    }

    try:
        result = supabase.table("registrations").insert(db_data).execute()

        if not result.data:
            raise HTTPException(status_code=500, detail="Failed to save registration")

        registration = result.data[0]

        return RegistrationResponse(
            id=registration['id'],
            user_id=registration['user_id'],
            email=registration['email'],
            full_name=registration['full_name'],
            education_level=registration['education_level'],
            created_at=registration['created_at'],
        )

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Registration failed: {str(e)}")


@router.get("/registration")
async def get_registration(current_user=Depends(get_current_user)):
    """Get current user's registration data"""

    try:
        result = supabase.table("registrations").select("*").eq("user_id", current_user.id).execute()

        if not result.data:
            raise HTTPException(status_code=404, detail="Registration not found")

        return result.data[0]
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch registration: {str(e)}")


@router.patch("/registration")
async def update_registration(
    updates: dict,
    current_user=Depends(get_current_user)
):
    """Update editable registration fields"""

    # Only allow certain fields to be updated
    allowed_fields = {
        'dietary_restrictions',
        'staying_overnight',
        'interested_in_beginner',
        'general_comments'
    }

    # Filter to only allowed fields
    filtered_updates = {k: v for k, v in updates.items() if k in allowed_fields}

    if not filtered_updates:
        raise HTTPException(status_code=400, detail="No valid fields to update")

    try:
        result = supabase.table("registrations").update(filtered_updates).eq("user_id", current_user.id).execute()

        if not result.data:
            raise HTTPException(status_code=404, detail="Registration not found")

        return {"message": "Registration updated successfully", "data": result.data[0]}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to update registration: {str(e)}")


@router.get("/registration/status")
async def get_registration_status(current_user=Depends(get_current_user)):
    """Check if user is registered"""

    try:
        result = supabase.table("registrations").select("id, created_at").eq("user_id", current_user.id).execute()

        return {
            "is_registered": len(result.data) > 0,
            "registration_date": result.data[0]['created_at'] if result.data else None
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to check registration status: {str(e)}")


@router.post("/send-google-signup-email")
async def send_google_signup_welcome_email(
    request: GoogleSignupEmailRequest,
    current_user=Depends(get_current_user)
):
    """Send welcome email to users who signed up via Google OAuth"""

    # Verify that the email matches the authenticated user
    if request.email != current_user.email:
        raise HTTPException(status_code=403, detail="Email mismatch")

    try:
        await send_google_signup_email(request.email, request.name)
        return {"success": True, "message": "Welcome email sent"}
    except Exception as e:
        # Log the error but don't fail the signup process
        import logging
        logging.error(f"Failed to send Google signup email: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to send email: {str(e)}")
