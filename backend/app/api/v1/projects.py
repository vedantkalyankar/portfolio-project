from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from app.api.dependencies import require_admin

from app.db.session import get_db
from app.schemas.project import (
    ProjectCreate,
    ProjectListResponse,
    ProjectResponse,
    ProjectUpdate,
)
from app.services import project as project_service


router = APIRouter(
    prefix="/projects",
    tags=["Projects"],
)

@router.get(
    "",
    response_model=ProjectListResponse,
)
def list_projects(
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
    projects, total = project_service.get_projects(
        db,
        limit=limit,
        offset=offset,
    )

    return {
        "items": projects,
        "total": total,
        "limit": limit,
        "offset": offset,
    }


@router.get(
    "/{project_id}",
    response_model=ProjectResponse,
)
def get_project(
    project_id: UUID,
    db: Session = Depends(get_db),
):
    project = project_service.get_project(
        db,
        project_id,
    )

    if project is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found",
        )

    return project


@router.post(
    "",
    response_model=ProjectResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_project(
    project_data: ProjectCreate,
    db: Session = Depends(get_db),
    current_user=Depends(require_admin),
):
    return project_service.create_project(
        db,
        project_data,
    )


@router.patch(
    "/{project_id}",
    response_model=ProjectResponse,
)
def update_project(
    project_id: UUID,
    project_data: ProjectUpdate,
    db: Session = Depends(get_db),
    current_user=Depends(require_admin),
):
    project = project_service.get_project(
        db,
        project_id,
    )

    if project is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found",
        )

    return project_service.update_project(
        db,
        project,
        project_data,
    )


@router.delete(
    "/{project_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_project(
    project_id: UUID,
    db: Session = Depends(get_db),
    current_user=Depends(require_admin),
):
    project = project_service.get_project(
        db,
        project_id,
    )

    if project is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found",
        )

    project_service.delete_project(
        db,
        project,
    )