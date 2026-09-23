from uuid import UUID

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.testimonial import Testimonial
from app.schemas.testimonial import TestimonialCreate, TestimonialUpdate


def get_testimonials(db: Session) -> list[Testimonial]:
    statement = select(Testimonial).order_by(
        Testimonial.created_at.desc()
    )

    return list(db.scalars(statement).all())


def get_testimonial(
    db: Session,
    testimonial_id: UUID,
) -> Testimonial | None:
    return db.get(Testimonial, testimonial_id)


def create_testimonial(
    db: Session,
    testimonial_data: TestimonialCreate,
) -> Testimonial:
    testimonial = Testimonial(
        name=testimonial_data.name,
        role=testimonial_data.role,
        company=testimonial_data.company,
        content=testimonial_data.content,
    )

    db.add(testimonial)
    db.commit()
    db.refresh(testimonial)

    return testimonial


def update_testimonial(
    db: Session,
    testimonial: Testimonial,
    testimonial_data: TestimonialUpdate,
) -> Testimonial:
    update_data = testimonial_data.model_dump(
        exclude_unset=True
    )

    for field, value in update_data.items():
        setattr(testimonial, field, value)

    db.commit()
    db.refresh(testimonial)

    return testimonial


def delete_testimonial(
    db: Session,
    testimonial: Testimonial,
) -> None:
    db.delete(testimonial)
    db.commit()