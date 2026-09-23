from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class ServiceBase(BaseModel):
    title: str = Field(..., min_length=1, max_length=150)
    description: str = Field(..., min_length=1)
    icon: str | None = Field(default=None, max_length=100)


class ServiceCreate(ServiceBase):
    pass


class ServiceUpdate(BaseModel):
    title: str | None = Field(
        default=None,
        min_length=1,
        max_length=150,
    )

    description: str | None = Field(
        default=None,
        min_length=1,
    )

    icon: str | None = Field(
        default=None,
        max_length=100,
    )


class ServiceResponse(ServiceBase):
    id: UUID
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)