"""
Configuration settings for Rewind365 backend
"""
import os
from functools import lru_cache
from typing import List
from dotenv import load_dotenv

# Load environment variables
load_dotenv()


class Settings:
    """Application settings"""
    
    # App Configuration
    environment: str = os.getenv("ENVIRONMENT", "development")
    debug: bool = os.getenv("DEBUG", "true").lower() == "true"
    secret_key: str = os.getenv("SECRET_KEY", "dev-secret-key-change-in-production")
    
    # Microsoft Graph
    microsoft_client_id: str = os.getenv("MICROSOFT_CLIENT_ID", "")
    microsoft_client_secret: str = os.getenv("MICROSOFT_CLIENT_SECRET", "")
    microsoft_tenant_id: str = os.getenv("MICROSOFT_TENANT_ID", "")
    
    # OpenAI
    openai_api_key: str = os.getenv("OPENAI_API_KEY", "")
    openai_model: str = os.getenv("OPENAI_MODEL", "gpt-4")
    
    # Azure Storage
    azure_storage_connection_string: str = os.getenv("AZURE_STORAGE_CONNECTION_STRING", "")
    azure_storage_container: str = os.getenv("AZURE_STORAGE_CONTAINER", "rewind365-data")
    
    # CORS
    allowed_origins: List[str] = [
        "http://localhost:3000",
        "http://localhost:8000", 
        "http://localhost:8001",
        "https://*.azurewebsites.net",
        "https://*.azurestaticapps.net"
    ]


@lru_cache()
def get_settings() -> Settings:
    """Get cached settings instance"""
    return Settings()