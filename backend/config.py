import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    SECRET_KEY = os.getenv("SECRET_KEY")
    GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

    if os.getenv("USE_SQLITE", "false").lower() == "true":
        SQLALCHEMY_DATABASE_URI = "sqlite:///agrivision.db"
    else:
        SQLALCHEMY_DATABASE_URI = os.getenv("DATABASE_URL")

    SQLALCHEMY_TRACK_MODIFICATIONS = False