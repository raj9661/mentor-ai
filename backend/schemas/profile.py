from pydantic import BaseModel
from typing import Optional, List
from uuid import UUID
from datetime import datetime


class StudentProfileCreate(BaseModel):
    age: Optional[int] = None
    class_level: Optional[str] = None
    city: Optional[str] = None
    interests: Optional[List[str]] = None
    skills: Optional[List[str]] = None
    personality: Optional[str] = None
    risk_level: Optional[str] = None
    parent_pressure: Optional[str] = None
    budget_level: Optional[str] = None
    confusion: Optional[str] = None


class StudentProfileResponse(StudentProfileCreate):
    id: UUID
    user_id: UUID
    created_at: datetime

    class Config:
        from_attributes = True


class ParentProfileCreate(BaseModel):
    expectations: Optional[str] = None
    concerns: Optional[str] = None
    budget: Optional[str] = None


class ParentProfileResponse(ParentProfileCreate):
    id: UUID
    user_id: UUID
    created_at: datetime

    class Config:
        from_attributes = True
