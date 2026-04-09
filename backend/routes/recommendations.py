from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from uuid import UUID
from database import get_db
from models.user import User
from models.career import CareerRecommendation
from models.relation import ParentChildRelation
from schemas.career import CareerRecommendationResponse
from services.auth_service import get_current_user
from typing import List

router = APIRouter(prefix="/recommendations", tags=["Recommendations"])


@router.get("/", response_model=List[CareerRecommendationResponse])
async def get_my_recommendations(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    result = await db.execute(
        select(CareerRecommendation)
        .where(CareerRecommendation.user_id == current_user.id)
        .order_by(CareerRecommendation.created_at.desc())
        .limit(5)
    )
    recs = result.scalars().all()
    return [CareerRecommendationResponse.model_validate(r) for r in recs]


@router.get("/child/{student_id}", response_model=List[CareerRecommendationResponse])
async def get_child_recommendations(
    student_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Parent views their child's recommendations."""
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
        select(CareerRecommendation)
        .where(CareerRecommendation.user_id == UUID(student_id))
        .order_by(CareerRecommendation.created_at.desc())
        .limit(5)
    )
    recs = result.scalars().all()
    return [CareerRecommendationResponse.model_validate(r) for r in recs]
