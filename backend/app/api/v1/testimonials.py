from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.dependencies import require_admin
from app.db.session import get_db
from app.schemas.testimonial import (
    TestimonialCreate,
    TestimonialResponse,
    TestimonialUpdate,
)
from app.services import testimonial as testimonial_service


router = APIRouter(
    prefix="/testimonials",
    tags=["Testimonials"],
)


@router.get(
    "",
    response_model=list[TestimonialResponse],
)
def list_testimonials(
    db: Session = Depends(get_db),
):
    return testimonial_service.get_testimonials(db)


@router.get(
    "/{testimonial_id}",
    response_model=TestimonialResponse,
)
def get_testimonial(
    testimonial_id: UUID,
    db: Session = Depends(get_db),
):
    testimonial = testimonial_service.get_testimonial(
        db,
        testimonial_id,
    )

    if testimonial is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Testimonial not found",
        )

    return testimonial


@router.post(
    "",
    response_model=TestimonialResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_testimonial(
    testimonial_data: TestimonialCreate,
    db: Session = Depends(get_db),
    current_user=Depends(require_admin),
):
    return testimonial_service.create_testimonial(
        db,
        testimonial_data,
    )


@router.patch(
    "/{testimonial_id}",
    response_model=TestimonialResponse,
)
def update_testimonial(
    testimonial_id: UUID,
    testimonial_data: TestimonialUpdate,
    db: Session = Depends(get_db),
    current_user=Depends(require_admin),
):
    testimonial = testimonial_service.get_testimonial(
        db,
        testimonial_id,
    )

    if testimonial is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Testimonial not found",
        )

    return testimonial_service.update_testimonial(
        db,
        testimonial,
        testimonial_data,
    )


@router.delete(
    "/{testimonial_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_testimonial(
    testimonial_id: UUID,
    db: Session = Depends(get_db),
    current_user=Depends(require_admin),
):
    testimonial = testimonial_service.get_testimonial(
        db,
        testimonial_id,
    )

    if testimonial is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Testimonial not found",
        )

    testimonial_service.delete_testimonial(
        db,
        testimonial,
    )