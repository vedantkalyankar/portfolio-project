from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.dependencies import require_admin
from app.db.session import get_db
from app.schemas.about import (
    AboutCreate,
    AboutResponse,
    AboutUpdate,
)
from app.services import about as about_service


router = APIRouter(
    prefix="/about",
    tags=["About"],
)


@router.get(
    "",
    response_model=AboutResponse,
)
def get_about(
    db: Session = Depends(get_db),
):
    about = about_service.get_about(db)

    if about is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="About information not found",
        )

    return about


@router.post(
    "",
    response_model=AboutResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_about(
    about_data: AboutCreate,
    db: Session = Depends(get_db),
    current_user=Depends(require_admin),
):
    existing_about = about_service.get_about(db)

    if existing_about is not None:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="About information already exists",
        )

    return about_service.create_about(
        db,
        about_data,
    )


@router.patch(
    "",
    response_model=AboutResponse,
)
def update_about(
    about_data: AboutUpdate,
    db: Session = Depends(get_db),
    current_user=Depends(require_admin),
):
    about = about_service.get_about(db)

    if about is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="About information not found",
        )

    return about_service.update_about(
        db,
        about,
        about_data,
    )


@router.delete(
    "",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_about(
    db: Session = Depends(get_db),
    current_user=Depends(require_admin),
):
    about = about_service.get_about(db)

    if about is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="About information not found",
        )

    about_service.delete_about(
        db,
        about,
    )