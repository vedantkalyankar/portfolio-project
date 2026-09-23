from datetime import date, datetime
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class ExperienceBase(BaseModel):
    company: str = Field(..., min_length=1, max_length=150)
    role: str = Field(..., min_length=1, max_length=150)
    location: str = Field(..., min_length=1, max_length=150)
    description: str = Field(..., min_length=1)
    start_date: date
    end_date: date | None = None
    is_current: bool = False


class ExperienceCreate(ExperienceBase):
    pass


class ExperienceUpdate(BaseModel):
    company: str | None = Field(default=None, min_length=1, max_length=150)
    role: str | None = Field(default=None, min_length=1, max_length=150)
    location: str | None = Field(default=None, min_length=1, max_length=150)
    description: str | None = Field(default=None, min_length=1)
    start_date: date | None = None
    end_date: date | None = None
    is_current: bool | None = None


class ExperienceResponse(ExperienceBase):
    id: UUID
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)