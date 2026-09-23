from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from app.api.dependencies import require_admin
from app.db.session import get_db
from app.schemas.skill import (
    SkillCreate,
    SkillResponse,
    SkillUpdate,
    SkillListResponse,
)
from app.services import skill as skill_service


router = APIRouter(
    prefix="/skills",
    tags=["Skills"],
)


@router.get(
    "",
    response_model=SkillListResponse,
)
def list_skills(
    limit: int = Query(
        default=10,
        ge=1,
        le=100,
    ),
    offset: int = Query(
        default=0,
        ge=0,
    ),
    db: Session = Depends(get_db),
):
    skills, total = skill_service.get_skills(
        db,
        limit=limit,
        offset=offset,
    )

    return {
        "items": skills,
        "total": total,
        "limit": limit,
        "offset": offset,
    }

@router.get(
    "/{skill_id}",
    response_model=SkillResponse,
)
def get_skill(
    skill_id: UUID,
    db: Session = Depends(get_db),
):
    skill = skill_service.get_skill(db, skill_id)

    if skill is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Skill not found",
        )

    return skill


@router.post(
    "",
    response_model=SkillResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_skill(
    skill_data: SkillCreate,
    db: Session = Depends(get_db),
    current_user=Depends(require_admin)
):
    return skill_service.create_skill(db, skill_data)


@router.patch(
    "/{skill_id}",
    response_model=SkillResponse,
)
def update_skill(
    skill_id: UUID,
    skill_data: SkillUpdate,
    db: Session = Depends(get_db),
    current_user=Depends(require_admin)
):
    skill = skill_service.get_skill(db, skill_id)

    if skill is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Skill not found",
        )

    return skill_service.update_skill(
        db,
        skill,
        skill_data,
    )


@router.delete(
    "/{skill_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_skill(
    skill_id: UUID,
    db: Session = Depends(get_db),
    current_user=Depends(require_admin)
):
    skill = skill_service.get_skill(db, skill_id)

    if skill is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Skill not found",
        )

    skill_service.delete_skill(db, skill)