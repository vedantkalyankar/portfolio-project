from uuid import UUID
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.models.project import Project
from app.schemas.project import ProjectCreate, ProjectUpdate


def get_projects(
    db: Session,
    limit: int = 10,
    offset: int = 0,
) -> tuple[list[Project], int]:
    statement = (
        select(Project)
        .order_by(Project.created_at.desc())
        .offset(offset)
        .limit(limit)
    )

    projects = list(db.scalars(statement).all())

    total = db.scalar(
        select(func.count()).select_from(Project)
    ) or 0

    return projects, total


def get_project(
    db: Session,
    project_id: UUID,
) -> Project | None:
    return db.get(Project, project_id)


def create_project(
    db: Session,
    project_data: ProjectCreate,
) -> Project:
    project = Project(
        title=project_data.title,
        description=project_data.description,
        github_url=(
            str(project_data.github_url)
            if project_data.github_url
            else None
        ),
        live_url=(
            str(project_data.live_url)
            if project_data.live_url
            else None
        ),
    )

    db.add(project)
    db.commit()
    db.refresh(project)

    return project


def update_project(
    db: Session,
    project: Project,
    project_data: ProjectUpdate,
) -> Project:
    update_data = project_data.model_dump(
        exclude_unset=True,
    )

    for field, value in update_data.items():
        if value is not None:
            setattr(project, field, str(value) if field.endswith("_url") else value)
        else:
            setattr(project, field, None)

    db.commit()
    db.refresh(project)

    return project


def delete_project(
    db: Session,
    project: Project,
) -> None:
    db.delete(project)
    db.commit()