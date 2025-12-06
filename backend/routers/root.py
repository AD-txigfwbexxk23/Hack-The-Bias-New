from fastapi import APIRouter

router = APIRouter()

@router.get("/")
def root():
    return {"status": "API is running"}

@router.get("/health")
async def health_check():
    return {"status": "ok"}