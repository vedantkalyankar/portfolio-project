from pathlib import Path
from uuid import uuid4

from fastapi import UploadFile

from app.core.config import settings


def get_media_root() -> Path:
    media_root = Path(settings.MEDIA_ROOT)

    if not media_root.is_absolute():
        media_root = Path.cwd() / media_root

    media_root.mkdir(
        parents=True,
        exist_ok=True,
    )

    return media_root


def validate_content_type(content_type: str | None) -> str:
    """
    Allow all file types.

    The content type is stored as metadata by the upload API,
    but it is not used to restrict which files can be uploaded.
    """
    return ""


def generate_stored_filename(extension: str) -> str:
    return f"{uuid4()}{extension}"


async def save_upload(
    upload_file: UploadFile,
) -> tuple[str, str, int]:
    original_filename = upload_file.filename or ""

    extension = Path(original_filename).suffix.lower()

    stored_filename = generate_stored_filename(
        extension
    )

    media_root = get_media_root()
    file_path = media_root / stored_filename

    total_size = 0

    try:
        with file_path.open("wb") as output_file:
            while chunk := await upload_file.read(1024 * 1024):
                total_size += len(chunk)

                if total_size > settings.MAX_UPLOAD_SIZE:
                    raise ValueError(
                        "File size exceeds the maximum allowed size"
                    )

                output_file.write(chunk)

    except ValueError:
        file_path.unlink(missing_ok=True)
        raise

    return (
        stored_filename,
        str(file_path),
        total_size,
    )