from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import root, preregister
import os
from utils.supabase_client import supabase


app = FastAPI()

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
app.include_router(preregister.router, prefix="/api")

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
