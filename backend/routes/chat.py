import math
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from database import get_db
from models.user import User, StudentProfile
from models.chat import Conversation, Message
from models.career import CareerRecommendation
from schemas.chat import SendMessage, ChatResponse, MessageResponse, ConversationHistory, ConversationItem
from services.auth_service import get_current_user
from services.ai_service import get_ai_response, get_greeting, extract_careers_from_response

router = APIRouter(prefix="/chat", tags=["Chat"])


async def _get_student_profile_dict(db: AsyncSession, user_id: UUID):
    result = await db.execute(
        select(StudentProfile).where(StudentProfile.user_id == user_id)
    )
    profile = result.scalar_one_or_none()
    if not profile:
        return None
    return {
        "age": profile.age,
        "class_level": profile.class_level,
        "city": profile.city,
        "interests": ", ".join(profile.interests or []),
        "skills": ", ".join(profile.skills or []),
        "personality": profile.personality,
        "risk_level": profile.risk_level,
        "parent_pressure": profile.parent_pressure,
        "budget_level": profile.budget_level,
        "confusion": profile.confusion,
    }


@router.post("/send", response_model=ChatResponse)
async def send_message(
    payload: SendMessage,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    language = payload.language or "en"

    # Get or create conversation
    if payload.conversation_id:
        conv_result = await db.execute(
            select(Conversation).where(
                Conversation.id == UUID(payload.conversation_id),
                Conversation.user_id == current_user.id,
            )
        )
        conversation = conv_result.scalar_one_or_none()
        if not conversation:
            raise HTTPException(status_code=404, detail="Conversation not found")
    else:
        conversation = Conversation(user_id=current_user.id, title=payload.message[:50])
        db.add(conversation)
        await db.flush()
        await db.refresh(conversation)

    # Fetch conversation history (last 30 messages)
    history_result = await db.execute(
        select(Message)
        .where(Message.conversation_id == conversation.id)
        .order_by(Message.created_at.asc())
        .limit(30)
    )
    history = [
        {"sender": m.sender, "message": m.message}
        for m in history_result.scalars().all()
    ]

    # Get student profile for context
    student_profile = None
    if current_user.role == "student":
        student_profile = await _get_student_profile_dict(db, current_user.id)

    # Get AI response
    ai_text = await get_ai_response(
        conversation_history=history,
        new_user_message=payload.message,
        language=language,
        student_profile=student_profile,
    )

    # Save user message
    user_msg = Message(
        conversation_id=conversation.id,
        sender="user",
        message=payload.message,
        message_metadata={"language": language},
    )
    db.add(user_msg)

    # Save AI message
    ai_msg = Message(
        conversation_id=conversation.id,
        sender="ai",
        message=ai_text,
        message_metadata={"language": language},
    )
    db.add(ai_msg)
    await db.flush()
    await db.refresh(user_msg)
    await db.refresh(ai_msg)

    # Try to extract and save career recommendations
    if current_user.role == "student":
        careers = await extract_careers_from_response(ai_text)
        if careers:
            rec = CareerRecommendation(user_id=current_user.id, careers=careers)
            db.add(rec)

    return ChatResponse(
        conversation_id=str(conversation.id),
        user_message=MessageResponse.model_validate(user_msg),
        ai_message=MessageResponse.model_validate(ai_msg),
    )


@router.get("/start")
async def start_conversation(
    language: str = Query("en", enum=["en", "hi"]),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Returns a greeting message to start a new conversation."""
    greeting = get_greeting(language, name=current_user.name)
    return {"greeting": greeting, "language": language}


@router.get("/history/{conversation_id}", response_model=ConversationHistory)
async def get_history(
    conversation_id: str,
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=5, le=100),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    conv_result = await db.execute(
        select(Conversation).where(
            Conversation.id == UUID(conversation_id),
            Conversation.user_id == current_user.id,
        )
    )
    conversation = conv_result.scalar_one_or_none()
    if not conversation:
        raise HTTPException(status_code=404, detail="Conversation not found")

    # Count total messages
    count_result = await db.execute(
        select(func.count()).where(Message.conversation_id == conversation.id)
    )
    total = count_result.scalar()
    total_pages = math.ceil(total / page_size) if total > 0 else 1

    offset = (page - 1) * page_size
    msgs_result = await db.execute(
        select(Message)
        .where(Message.conversation_id == conversation.id)
        .order_by(Message.created_at.asc())
        .offset(offset)
        .limit(page_size)
    )
    messages = [MessageResponse.model_validate(m) for m in msgs_result.scalars().all()]

    return ConversationHistory(
        conversation=ConversationItem.model_validate(conversation),
        messages=messages,
        page=page,
        total_pages=total_pages,
        total_messages=total,
    )


@router.get("/conversations")
async def list_conversations(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    result = await db.execute(
        select(Conversation)
        .where(Conversation.user_id == current_user.id)
        .order_by(Conversation.created_at.desc())
        .limit(20)
    )
    convs = result.scalars().all()
    return [ConversationItem.model_validate(c) for c in convs]
