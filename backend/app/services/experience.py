from uuid import UUID

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.experience import Experience
from app.schemas.experience import ExperienceCreate, ExperienceUpdate


def get_experiences(db: Session) -> list[Experience]:
    statement = select(Experience).order_by(
        Experience.start_date.desc()
    )

    return list(db.scalars(statement).all())


def get_experience(
    db: Session,
    experience_id: UUID,
) -> Experience | None:
    return db.get(Experience, experience_id)


def create_experience(
    db: Session,
    experience_data: ExperienceCreate,
) -> Experience:
    experience = Experience(
        company=experience_data.company,
        role=experience_data.role,
        location=experience_data.location,
        description=experience_data.description,
        start_date=experience_data.start_date,
        end_date=experience_data.end_date,
        is_current=experience_data.is_current,
    )

    db.add(experience)
    db.commit()
    db.refresh(experience)

    return experience


def update_experience(
    db: Session,
    experience: Experience,
    experience_data: ExperienceUpdate,
) -> Experience:
    update_data = experience_data.model_dump(
        exclude_unset=True
    )

    for field, value in update_data.items():
        setattr(experience, field, value)

    db.commit()
    db.refresh(experience)

    return experience


def delete_experience(
    db: Session,
    experience: Experience,
) -> None:
    db.delete(experience)
    db.commit()