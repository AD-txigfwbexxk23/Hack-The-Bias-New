import os
from supabase import create_client
from dotenv import load_dotenv
import logging

# Load environment variables
load_dotenv()

logger = logging.getLogger(__name__)

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

if not SUPABASE_URL:
    error_msg = "SUPABASE_URL environment variable is required"
    logger.error(error_msg)
    raise ValueError(error_msg)
if not SUPABASE_KEY:
    error_msg = "SUPABASE_KEY environment variable is required"
    logger.error(error_msg)
    raise ValueError(error_msg)

# Validate URL format
if not SUPABASE_URL.startswith(("http://", "https://")):
    error_msg = f"SUPABASE_URL must start with http:// or https://. Got: {SUPABASE_URL[:20]}..."
    logger.error(error_msg)
    raise ValueError(error_msg)

# Log URL (masked for security)
masked_url = SUPABASE_URL[:20] + "..." if len(SUPABASE_URL) > 20 else SUPABASE_URL
logger.info(f"Initializing Supabase client with URL: {masked_url}")

try:
    supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
    logger.info("Supabase client initialized successfully")
except Exception as e:
    error_msg = f"Failed to create Supabase client: {str(e)}. Check SUPABASE_URL format and network connectivity."
    logger.error(error_msg)
    raise ValueError(error_msg) from e
