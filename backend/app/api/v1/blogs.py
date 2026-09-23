from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError

from app.api.dependencies import require_admin
from app.db.session import get_db
from app.schemas.blog import (
    BlogCreate,
    BlogResponse,
    BlogUpdate,
)
from app.services import blog as blog_service


router = APIRouter(
    prefix="/blogs",
    tags=["Blogs"],
)


@router.get(
    "",
    response_model=list[BlogResponse],
)
def list_blogs(
    db: Session = Depends(get_db),
):
    return blog_service.get_blogs(db)


@router.get(
    "/{blog_id}",
    response_model=BlogResponse,
)
def get_blog(
    blog_id: UUID,
    db: Session = Depends(get_db),
):
    blog = blog_service.get_blog(
        db,
        blog_id,
    )

    if blog is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Blog not found",
        )

    return blog

@router.post(
    "",
    response_model=BlogResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_blog(
    blog_data: BlogCreate,
    db: Session = Depends(get_db),
    current_user=Depends(require_admin),
):
    try:
        return blog_service.create_blog(
            db,
            blog_data,
        )

    except IntegrityError:
        db.rollback()

        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Blog slug already exists",
        )


@router.patch(
    "/{blog_id}",
    response_model=BlogResponse,
)
def update_blog(
    blog_id: UUID,
    blog_data: BlogUpdate,
    db: Session = Depends(get_db),
    current_user=Depends(require_admin),
):
    blog = blog_service.get_blog(
        db,
        blog_id,
    )

    if blog is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Blog not found",
        )

    return blog_service.update_blog(
        db,
        blog,
        blog_data,
    )


@router.delete(
    "/{blog_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_blog(
    blog_id: UUID,
    db: Session = Depends(get_db),
    current_user=Depends(require_admin),
):
    blog = blog_service.get_blog(
        db,
        blog_id,
    )

    if blog is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Blog not found",
        )

    blog_service.delete_blog(
        db,
        blog,
    )