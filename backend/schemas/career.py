from pydantic import BaseModel
from typing import List, Optional, Any, Dict
from uuid import UUID
from datetime import datetime


class CareerRecommendationResponse(BaseModel):
    id: UUID
    user_id: UUID
    careers: List[Dict[str, Any]]
    created_at: datetime

    class Config:
        from_attributes = True


class ProgressCreate(BaseModel):
    goal: str
    status: Optional[str] = "pending"
    deadline: Optional[str] = None   # ISO date string YYYY-MM-DD


class ProgressUpdate(BaseModel):
    status: str  # 'pending' | 'in_progress' | 'completed'


class ProgressResponse(BaseModel):
    id: UUID
    user_id: UUID
    goal: str
    status: str
    deadline: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True
