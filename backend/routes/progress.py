from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from uuid import UUID
from typing import List
from database import get_db
from models.user import User
from models.progress import Progress
from models.relation import ParentChildRelation
from schemas.career import ProgressCreate, ProgressUpdate, ProgressResponse
from services.auth_service import get_current_user
import datetime

router = APIRouter(prefix="/progress", tags=["Progress"])


@router.get("/", response_model=List[ProgressResponse])
async def get_my_progress(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    result = await db.execute(
        select(Progress)
        .where(Progress.user_id == current_user.id)
        .order_by(Progress.created_at.desc())
    )
    return [ProgressResponse.model_validate(p) for p in result.scalars().all()]


@router.post("/", response_model=ProgressResponse, status_code=201)
async def create_progress(
    payload: ProgressCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    deadline = None
    if payload.deadline:
        deadline = datetime.date.fromisoformat(payload.deadline)

    item = Progress(
        user_id=current_user.id,
        goal=payload.goal,
        status=payload.status or "pending",
        deadline=deadline,
    )
    db.add(item)
    await db.flush()
    await db.refresh(item)
    return ProgressResponse.model_validate(item)


@router.patch("/{progress_id}", response_model=ProgressResponse)
async def update_progress(
    progress_id: str,
    payload: ProgressUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    result = await db.execute(
        select(Progress).where(
            Progress.id == UUID(progress_id),
            Progress.user_id == current_user.id,
        )
    )
    item = result.scalar_one_or_none()
    if not item:
        raise HTTPException(status_code=404, detail="Progress item not found")

    if payload.status not in ("pending", "in_progress", "completed"):
        raise HTTPException(status_code=400, detail="Invalid status value")

    item.status = payload.status
    await db.flush()
    await db.refresh(item)
    return ProgressResponse.model_validate(item)


@router.get("/child/{student_id}", response_model=List[ProgressResponse])
async def get_child_progress(
    student_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if current_user.role != "parent":
        raise HTTPException(status_code=403, detail="Parents only")

    rel = await db.execute(
        select(ParentChildRelation).where(
            ParentChildRelation.parent_id == current_user.id,
            ParentChildRelation.student_id == UUID(student_id),
        )
    )
    if not rel.scalar_one_or_none():
        raise HTTPException(status_code=403, detail="Child not linked to your account")

    result = await db.execute(
        select(Progress)
        .where(Progress.user_id == UUID(student_id))
        .order_by(Progress.created_at.desc())
    )
    return [ProgressResponse.model_validate(p) for p in result.scalars().all()]
