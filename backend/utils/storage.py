from fastapi import UploadFile, HTTPException
from utils.supabase_client import supabase
import uuid

ALLOWED_MIME_TYPES = ['application/pdf', 'image/jpeg', 'image/png']
MAX_FILE_SIZE = 5 * 1024 * 1024  # 5MB


async def upload_guardian_form(file: UploadFile, user_id: str) -> str:
    """Upload guardian consent form to Supabase Storage"""

    # Validate file type
    if file.content_type not in ALLOWED_MIME_TYPES:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid file type. Allowed: PDF, JPEG, PNG"
        )

    # Read file content
    content = await file.read()

    # Validate file size
    if len(content) > MAX_FILE_SIZE:
        raise HTTPException(status_code=400, detail="File size must be under 5MB")

    # Generate unique filename
    ext = file.filename.split('.')[-1] if '.' in file.filename else 'pdf'
    filename = f"{user_id}/{uuid.uuid4()}.{ext}"

    try:
        # Upload to Supabase Storage
        result = supabase.storage.from_('guardian-forms').upload(
            filename,
            content,
            {"content-type": file.content_type}
        )

        # Return the storage path (can be used to generate signed URLs later)
        return filename

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"File upload failed: {str(e)}")


def get_guardian_form_url(filename: str) -> str:
    """Generate a signed URL for accessing a guardian form"""
    try:
        # Create signed URL valid for 1 hour
        result = supabase.storage.from_('guardian-forms').create_signed_url(
            filename,
            3600  # 1 hour expiry
        )
        return result.get('signedURL', '')
    except Exception as e:
        return ''
