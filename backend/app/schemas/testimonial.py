from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class TestimonialBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=150)
    role: str = Field(..., min_length=1, max_length=150)
    company: str | None = Field(default=None, max_length=150)
    content: str = Field(..., min_length=1)


class TestimonialCreate(TestimonialBase):
    pass


class TestimonialUpdate(BaseModel):
    name: str | None = Field(default=None, min_length=1, max_length=150)
    role: str | None = Field(default=None, min_length=1, max_length=150)
    company: str | None = Field(default=None, max_length=150)
    content: str | None = Field(default=None, min_length=1)


class TestimonialResponse(TestimonialBase):
    id: UUID
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)