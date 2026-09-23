from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class SkillBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    category: str = Field(..., min_length=1, max_length=100)
    proficiency: str = Field(..., min_length=1, max_length=50)


class SkillCreate(SkillBase):
    pass


class SkillUpdate(BaseModel):
    name: str | None = Field(default=None, min_length=1, max_length=100)
    category: str | None = Field(default=None, min_length=1, max_length=100)
    proficiency: str | None = Field(default=None, min_length=1, max_length=50)


class SkillResponse(SkillBase):
    id: UUID
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)

class SkillListResponse(BaseModel):
    items: list[SkillResponse]
    total: int
    limit: int
    offset: int