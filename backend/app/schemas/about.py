from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, ConfigDict, EmailStr, Field, HttpUrl


class AboutBase(BaseModel):
    name: str = Field(
        ...,
        min_length=1,
        max_length=150,
    )

    title: str = Field(
        ...,
        min_length=1,
        max_length=150,
    )

    bio: str = Field(
        ...,
        min_length=1,
    )

    email: EmailStr

    location: str = Field(
        ...,
        min_length=1,
        max_length=150,
    )

    github_url: HttpUrl | None = None

    linkedin_url: HttpUrl | None = None


class AboutCreate(AboutBase):
    pass


class AboutUpdate(BaseModel):
    name: str | None = Field(
        default=None,
        min_length=1,
        max_length=150,
    )

    title: str | None = Field(
        default=None,
        min_length=1,
        max_length=150,
    )

    bio: str | None = Field(
        default=None,
        min_length=1,
    )

    email: EmailStr | None = None

    location: str | None = Field(
        default=None,
        min_length=1,
        max_length=150,
    )

    github_url: HttpUrl | None = None

    linkedin_url: HttpUrl | None = None


class AboutResponse(AboutBase):
    id: UUID
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(
        from_attributes=True,
    )