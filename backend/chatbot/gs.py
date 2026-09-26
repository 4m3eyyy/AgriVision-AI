import os
from pathlib import Path
from dotenv import load_dotenv
from google import genai

# Locate the backend folder
BASE_DIR = Path(__file__).resolve().parent.parent

# Load .env
ENV_FILE = BASE_DIR / ".env"
load_dotenv(ENV_FILE, override=True)

# Read API key
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

if not GEMINI_API_KEY:
    raise ValueError("Gemini API key was not loaded from .env")

# Create Gemini client
client = genai.Client(api_key=GEMINI_API_KEY)

# Load agriculture prompt
PROMPT_FILE = BASE_DIR / "prompts" / "agriculture_prompt.txt"

with open(PROMPT_FILE, "r", encoding="utf-8") as file:
    AGRICULTURE_PROMPT = file.read()


def ask_gemini(message):

    full_prompt = f"""
{AGRICULTURE_PROMPT}

User's question:
{message}
"""

    response = client.models.generate_content(
        model="gemini-3.6-flash",
        contents=full_prompt
    )

    return response.text