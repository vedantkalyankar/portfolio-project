from sqlalchemy.orm import Session

from app.models.upload import Upload
from app.schemas.upload import UploadResponse
from app.services.storage import save_upload


async def create_upload(
    db: Session,
    upload_file,
) -> Upload:
    (
        stored_filename,
        file_path,
        file_size,
    ) = await save_upload(upload_file)

    upload = Upload(
        original_filename=upload_file.filename or "unknown",
        stored_filename=stored_filename,
        file_path=file_path,
        content_type=upload_file.content_type or "application/octet-stream",
        file_size=file_size,
    )

    db.add(upload)
    db.commit()
    db.refresh(upload)

    return upload