from uuid import UUID

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.skill import Skill
from app.schemas.skill import SkillCreate, SkillUpdate


def get_skills(db: Session) -> list[Skill]:
    statement = select(Skill).order_by(Skill.created_at.desc())
    return list(db.scalars(statement).all())


def get_skill(db: Session, skill_id: UUID) -> Skill | None:
    return db.get(Skill, skill_id)


def create_skill(db: Session, skill_data: SkillCreate) -> Skill:
    skill = Skill(
        name=skill_data.name,
        category=skill_data.category,
        proficiency=skill_data.proficiency,
    )

    db.add(skill)
    db.commit()
    db.refresh(skill)

    return skill


def update_skill(
    db: Session,
    skill: Skill,
    skill_data: SkillUpdate,
) -> Skill:
    update_data = skill_data.model_dump(exclude_unset=True)

    for field, value in update_data.items():
        setattr(skill, field, value)

    db.commit()
    db.refresh(skill)

    return skill


def delete_skill(db: Session, skill: Skill) -> None:
    db.delete(skill)
    db.commit()