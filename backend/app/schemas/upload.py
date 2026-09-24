from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, ConfigDict


class UploadResponse(BaseModel):
    id: UUID
    original_filename: str
    stored_filename: str
    file_path: str
    content_type: str
    file_size: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)