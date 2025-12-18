from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from routers import root, register
import os
from utils.supabase_client import supabase


app = FastAPI()

@app.get("/")
async def health_check():
    return {"status": "healthy", "message": "Hack the Bias API is running"}

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    """Handle validation errors and return user-friendly messages"""
    errors = exc.errors()
    error_messages = []
    
    for error in errors:
        field = ".".join(str(loc) for loc in error.get("loc", []))
        msg = error.get("msg", "Validation error")
        error_type = error.get("type", "")
        
        # Provide user-friendly error messages
        if error_type == "string_type":
            error_messages.append(f"{field}: Expected a string value")
        elif error_type == "value_error.email":
            error_messages.append(f"Invalid email format. Please check your email address.")
        elif "pattern" in msg.lower() or "expected pattern" in msg.lower():
            if "email" in field.lower():
                error_messages.append(f"Invalid email format. Please enter a valid email address.")
            else:
                error_messages.append(f"{field}: {msg}")
        else:
            error_messages.append(f"{field}: {msg}")
    
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={
            "detail": "; ".join(error_messages) if error_messages else "Validation error",
            "errors": errors
        }
    )

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000",
                   "http://localhost:5173",  # Vite dev server default port
                   "https://hack-the-bias.vercel.app",
                   "https://hack-the-bias-git-development-hack-the-bias-projects.vercel.app",
                   "https://www.hackthebias.dev"],  # update as needed
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(root.router, prefix="/api")
app.include_router(register.router, prefix="/api")

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
