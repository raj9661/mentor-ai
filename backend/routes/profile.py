from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from database import get_db
from models.user import User, StudentProfile, ParentProfile
from schemas.profile import (
    StudentProfileCreate, StudentProfileResponse,
    ParentProfileCreate, ParentProfileResponse,
)
from services.auth_service import get_current_user

router = APIRouter(prefix="/profile", tags=["Profile"])


# ── STUDENT PROFILE ──────────────────────────────────────────

@router.get("/student", response_model=StudentProfileResponse)
async def get_student_profile(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    result = await db.execute(
        select(StudentProfile).where(StudentProfile.user_id == current_user.id)
    )
    profile = result.scalar_one_or_none()
    if not profile:
        raise HTTPException(status_code=404, detail="Student profile not found")
    return profile


@router.post("/student", response_model=StudentProfileResponse)
async def upsert_student_profile(
    payload: StudentProfileCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    result = await db.execute(
        select(StudentProfile).where(StudentProfile.user_id == current_user.id)
    )
    profile = result.scalar_one_or_none()

    if profile:
        for field, value in payload.model_dump(exclude_unset=True).items():
            setattr(profile, field, value)
    else:
        profile = StudentProfile(user_id=current_user.id, **payload.model_dump())
        db.add(profile)

    await db.flush()
    await db.refresh(profile)
    return profile


# ── PARENT PROFILE ───────────────────────────────────────────

@router.get("/parent", response_model=ParentProfileResponse)
async def get_parent_profile(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    result = await db.execute(
        select(ParentProfile).where(ParentProfile.user_id == current_user.id)
    )
    profile = result.scalar_one_or_none()
    if not profile:
        raise HTTPException(status_code=404, detail="Parent profile not found")
    return profile


@router.post("/parent", response_model=ParentProfileResponse)
async def upsert_parent_profile(
    payload: ParentProfileCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    result = await db.execute(
        select(ParentProfile).where(ParentProfile.user_id == current_user.id)
    )
    profile = result.scalar_one_or_none()

    if profile:
        for field, value in payload.model_dump(exclude_unset=True).items():
            setattr(profile, field, value)
    else:
        profile = ParentProfile(user_id=current_user.id, **payload.model_dump())
        db.add(profile)

    await db.flush()
    await db.refresh(profile)
    return profile


# ── CHILD PROFILE (parent views child) ──────────────────────

@router.get("/student/{student_id}", response_model=StudentProfileResponse)
async def get_child_profile(
    student_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    from models.relation import ParentChildRelation
    from uuid import UUID

    # Verify parent-child relationship
    rel = await db.execute(
        select(ParentChildRelation).where(
            ParentChildRelation.parent_id == current_user.id,
            ParentChildRelation.student_id == UUID(student_id),
        )
    )
    if not rel.scalar_one_or_none() and current_user.role != "student":
        raise HTTPException(status_code=403, detail="Access denied")

    result = await db.execute(
        select(StudentProfile).where(StudentProfile.user_id == UUID(student_id))
    )
    profile = result.scalar_one_or_none()
    if not profile:
        raise HTTPException(status_code=404, detail="Student profile not found")
    return profile
