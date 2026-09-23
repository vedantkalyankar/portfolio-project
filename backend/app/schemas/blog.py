from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class BlogBase(BaseModel):
    title: str = Field(
        ...,
        min_length=1,
        max_length=200,
    )

    slug: str = Field(
        ...,
        min_length=1,
        max_length=220,
    )

    excerpt: str = Field(
        ...,
        min_length=1,
    )

    content: str = Field(
        ...,
        min_length=1,
    )

    published: bool = False


class BlogCreate(BlogBase):
    pass


class BlogUpdate(BaseModel):
    title: str | None = Field(
        default=None,
        min_length=1,
        max_length=200,
    )

    slug: str | None = Field(
        default=None,
        min_length=1,
        max_length=220,
    )

    excerpt: str | None = Field(
        default=None,
        min_length=1,
    )

    content: str | None = Field(
        default=None,
        min_length=1,
    )

    published: bool | None = None


class BlogResponse(BlogBase):
    id: UUID
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(
        from_attributes=True,
    )