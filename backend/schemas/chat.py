from pydantic import BaseModel
from typing import Optional, List, Any, Dict
from uuid import UUID
from datetime import datetime


class SendMessage(BaseModel):
    conversation_id: Optional[str] = None   # None = start new conversation
    message: str
    language: Optional[str] = "en"         # 'en' | 'hi'


class MessageResponse(BaseModel):
    id: UUID
    conversation_id: UUID
    sender: str
    message: str
    metadata: Optional[Dict[str, Any]] = {}

    # Pydantic V2 alias generator to fetch from the renamed ORM attribute
    @classmethod
    def model_validate(cls, obj: Any, *, strict: Optional[bool] = None, from_attributes: Optional[bool] = None, context: Optional[Dict[str, Any]] = None) -> "MessageResponse":
        if hasattr(obj, "message_metadata"):
            obj.metadata = obj.message_metadata
        return super().model_validate(obj, strict=strict, from_attributes=from_attributes, context=context)
    created_at: datetime

    class Config:
        from_attributes = True


class ChatResponse(BaseModel):
    conversation_id: str
    user_message: MessageResponse
    ai_message: MessageResponse


class ConversationItem(BaseModel):
    id: UUID
    title: str
    created_at: datetime

    class Config:
        from_attributes = True


class ConversationHistory(BaseModel):
    conversation: ConversationItem
    messages: List[MessageResponse]
    page: int
    total_pages: int
    total_messages: int
