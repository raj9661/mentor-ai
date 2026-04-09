from pydantic import BaseModel
from uuid import UUID
from datetime import datetime
from typing import Optional


class InviteCreate(BaseModel):
    pass  # role is derived from the current user's role


class InviteResponse(BaseModel):
    code: str
    expires_at: datetime
    role: str


class InviteJoin(BaseModel):
    code: str


class InviteJoinResponse(BaseModel):
    message: str
    linked_user_id: Optional[str] = None
