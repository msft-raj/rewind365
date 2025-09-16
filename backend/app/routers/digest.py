"""
Daily digest API endpoints
"""
from typing import List
from datetime import datetime
from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter()


class DigestItem(BaseModel):
    """Digest item model"""
    id: str
    title: str
    summary: str
    source: str  # 'teams' or 'outlook'
    source_details: str
    priority: str  # 'urgent', 'action', 'info'
    timestamp: str
    url: str = None


class DigestSummary(BaseModel):
    """Digest summary stats"""
    total_items: int
    urgent_count: int
    action_count: int
    info_count: int


class DailyDigest(BaseModel):
    """Daily digest model"""
    date: str
    items: List[DigestItem]
    summary: DigestSummary


@router.get("", response_model=DailyDigest)
async def get_daily_digest(user_id: str = "default"):
    """
    Get daily digest for user
    TODO: Implement AI summarization and real data fetching
    """
    # Mock data for now - replace with real implementation
    today = datetime.now().strftime("%Y-%m-%d")
    
    mock_items = [
        DigestItem(
            id="1",
            title="Quarterly Review Meeting Scheduled",
            summary="Sarah scheduled the Q4 review for next Friday at 2 PM. Please prepare your department reports.",
            source="teams",
            source_details="Marketing Team > General",
            priority="urgent",
            timestamp=datetime.now().isoformat(),
            url="https://teams.microsoft.com/..."
        ),
        DigestItem(
            id="2", 
            title="Action Required: Budget Approval",
            summary="Finance needs approval for the marketing budget increase. Deadline is end of week.",
            source="outlook",
            source_details="Important",
            priority="action",
            timestamp=datetime.now().isoformat()
        ),
        DigestItem(
            id="3",
            title="New Feature Deployed",
            summary="The user authentication update went live. All testing passed successfully.",
            source="teams", 
            source_details="Engineering Team > Development",
            priority="info",
            timestamp=datetime.now().isoformat()
        )
    ]
    
    # Calculate summary stats
    urgent_count = len([i for i in mock_items if i.priority == "urgent"])
    action_count = len([i for i in mock_items if i.priority == "action"]) 
    info_count = len([i for i in mock_items if i.priority == "info"])
    
    return DailyDigest(
        date=today,
        items=mock_items,
        summary=DigestSummary(
            total_items=len(mock_items),
            urgent_count=urgent_count,
            action_count=action_count,
            info_count=info_count
        )
    )


@router.post("/generate")
async def generate_digest(user_id: str = "default"):
    """
    Generate a new digest for the user
    TODO: Implement AI-powered digest generation
    """
    # This will:
    # 1. Get user preferences
    # 2. Fetch data from selected Teams channels and Outlook folders
    # 3. Use AI to summarize and prioritize
    # 4. Return the generated digest
    
    return {"message": "Digest generation started", "user_id": user_id}