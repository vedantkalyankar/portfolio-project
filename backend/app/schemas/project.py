from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field, HttpUrl


class ProjectBase(BaseModel):
    title: str = Field(
        ...,
        min_length=1,
        max_length=150,
    )

    description: str = Field(
        ...,
        min_length=1,
    )

    github_url: HttpUrl | None = None

    live_url: HttpUrl | None = None


class ProjectCreate(ProjectBase):
    pass


class ProjectUpdate(BaseModel):
    title: str | None = Field(
        default=None,
        min_length=1,
        max_length=150,
    )

    description: str | None = Field(
        default=None,
        min_length=1,
    )

    github_url: HttpUrl | None = None

    live_url: HttpUrl | None = None


class ProjectResponse(ProjectBase):
    id: UUID
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(
        from_attributes=True,
    )

class ProjectListResponse(BaseModel):
    items: list[ProjectResponse]
    total: int
    limit: int
    offset: int