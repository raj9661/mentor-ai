import secrets
from datetime import datetime, timedelta
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from database import get_db
from models.user import User
from models.relation import InviteCode, ParentChildRelation
from schemas.invite import InviteResponse, InviteJoin, InviteJoinResponse
from services.auth_service import get_current_user

router = APIRouter(prefix="/invite", tags=["Invite"])


@router.post("/create", response_model=InviteResponse)
async def create_invite(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    code = secrets.token_urlsafe(8).upper()
    expires_at = datetime.utcnow() + timedelta(hours=48)

    invite = InviteCode(
        code=code,
        created_by=current_user.id,
        role=current_user.role,
        expires_at=expires_at,
    )
    db.add(invite)
    await db.flush()

    return InviteResponse(code=code, expires_at=expires_at, role=current_user.role)


@router.post("/join", response_model=InviteJoinResponse)
async def join_invite(
    payload: InviteJoin,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    result = await db.execute(
        select(InviteCode).where(InviteCode.code == payload.code.upper())
    )
    invite = result.scalar_one_or_none()

    if not invite:
        raise HTTPException(status_code=404, detail="Invite code not found")
    if invite.is_used:
        raise HTTPException(status_code=400, detail="Invite code already used")
    if invite.expires_at < datetime.utcnow():
        raise HTTPException(status_code=400, detail="Invite code has expired")
    if invite.created_by == current_user.id:
        raise HTTPException(status_code=400, detail="Cannot use your own invite code")

    creator_id = invite.created_by

    # Determine parent/student roles
    if current_user.role == "student" and invite.role == "parent":
        parent_id = creator_id
        student_id = current_user.id
    elif current_user.role == "parent" and invite.role == "student":
        parent_id = current_user.id
        student_id = creator_id
    else:
        raise HTTPException(status_code=400, detail="Role mismatch — invite not compatible")

    # Check if already linked
    existing = await db.execute(
        select(ParentChildRelation).where(
            ParentChildRelation.parent_id == parent_id,
            ParentChildRelation.student_id == student_id,
        )
    )
    if existing.scalar_one_or_none():
        raise HTTPException(status_code=400, detail="Already linked")

    relation = ParentChildRelation(parent_id=parent_id, student_id=student_id)
    db.add(relation)

    invite.is_used = True
    await db.flush()

    return InviteJoinResponse(
        message="Successfully linked!",
        linked_user_id=str(creator_id),
    )
