"""
Outlook API endpoints
"""
from typing import List
from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter()


class OutlookFolder(BaseModel):
    """Outlook folder model"""
    id: str
    name: str
    parent_folder_name: str = None


@router.get("/folders", response_model=List[OutlookFolder])
async def get_outlook_folders():
    """
    Get user's Outlook folders
    TODO: Implement Microsoft Graph API integration
    """
    # Mock data for now - replace with Graph API call
    mock_folders = [
        OutlookFolder(id="inbox", name="Inbox"),
        OutlookFolder(id="sent", name="Sent Items"),
        OutlookFolder(id="important", name="Important"),
        OutlookFolder(id="flagged", name="Flagged"),
        OutlookFolder(
            id="project-alpha",
            name="Project Alpha", 
            parent_folder_name="Projects"
        ),
        OutlookFolder(
            id="project-beta",
            name="Project Beta",
            parent_folder_name="Projects"
        ),
    ]
    
    return mock_folders


@router.get("/messages/{folder_id}")
async def get_folder_messages(folder_id: str):
    """
    Get recent messages from an Outlook folder
    TODO: Implement Microsoft Graph API integration
    """
    # This will fetch recent emails from the specified folder
    # For now, return mock data
    return {
        "folder_id": folder_id,
        "messages": [
            {
                "id": "email1",
                "subject": "Budget approval needed",
                "sender": "finance@company.com",
                "timestamp": "2025-09-16T09:15:00Z",
                "importance": "high",
                "body_preview": "Please review and approve the Q4 marketing budget..."
            }
        ]
    }