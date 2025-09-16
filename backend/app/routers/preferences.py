"""
User preferences API endpoints
"""
from typing import List
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

router = APIRouter()


class UserPreferences(BaseModel):
    """User preferences model"""
    selected_channels: List[str] = []
    selected_folders: List[str] = []
    user_id: str = None


# In-memory storage for demo (replace with proper database/storage)
user_preferences_store = {}


@router.get("", response_model=UserPreferences)
async def get_user_preferences(user_id: str = "default"):
    """
    Get user preferences
    TODO: Implement proper user identification and storage
    """
    if user_id in user_preferences_store:
        return user_preferences_store[user_id]
    
    # Return empty preferences for new users
    return UserPreferences(user_id=user_id)


@router.post("", response_model=UserPreferences)
async def save_user_preferences(preferences: UserPreferences, user_id: str = "default"):
    """
    Save user preferences
    TODO: Implement proper user identification and storage
    """
    preferences.user_id = user_id
    user_preferences_store[user_id] = preferences
    
    return preferences


@router.delete("")
async def delete_user_preferences(user_id: str = "default"):
    """
    Delete user preferences
    """
    if user_id in user_preferences_store:
        del user_preferences_store[user_id]
        return {"message": "Preferences deleted"}
    
    raise HTTPException(status_code=404, detail="Preferences not found")