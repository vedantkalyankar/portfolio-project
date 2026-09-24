from pathlib import Path
from uuid import UUID

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile, status
from fastapi.responses import FileResponse
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.api.dependencies import require_admin
from app.db.session import get_db
from app.models.upload import Upload
from app.schemas.upload import UploadResponse
from app.services import upload as upload_service


router = APIRouter(
    prefix="/uploads",
    tags=["Uploads"],
)


@router.post(
    "",
    response_model=UploadResponse,
    status_code=status.HTTP_201_CREATED,
)
async def upload_file(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user=Depends(require_admin),
):
    try:
        return await upload_service.create_upload(
            db,
            file,
        )

    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(exc),
        )


@router.get(
    "",
    response_model=list[UploadResponse],
)
def get_uploads(
    db: Session = Depends(get_db),
    current_user=Depends(require_admin),
):
    uploads = db.scalars(
        select(Upload).order_by(
            Upload.created_at.desc()
        )
    ).all()

    return uploads


@router.get(
    "/{upload_id}",
    response_class=FileResponse,
)
def download_file(
    upload_id: UUID,
    db: Session = Depends(get_db),
):
    upload = db.get(
        Upload,
        upload_id,
    )

    if upload is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Upload not found",
        )

    file_path = Path(upload.file_path)

    if not file_path.exists():
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="File not found",
        )

    return FileResponse(
        path=file_path,
        media_type=upload.content_type or "application/octet-stream",
        filename=upload.original_filename,
    )