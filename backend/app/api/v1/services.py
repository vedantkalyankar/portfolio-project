from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.dependencies import require_admin
from app.db.session import get_db
from app.schemas.service import (
    ServiceCreate,
    ServiceResponse,
    ServiceUpdate,
)
from app.services import service as service_service


router = APIRouter(
    prefix="/services",
    tags=["Services"],
)


@router.get(
    "",
    response_model=list[ServiceResponse],
)
def list_services(
    db: Session = Depends(get_db),
):
    return service_service.get_services(db)


@router.get(
    "/{service_id}",
    response_model=ServiceResponse,
)
def get_service(
    service_id: UUID,
    db: Session = Depends(get_db),
):
    service = service_service.get_service(
        db,
        service_id,
    )

    if service is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Service not found",
        )

    return service


@router.post(
    "",
    response_model=ServiceResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_service(
    service_data: ServiceCreate,
    db: Session = Depends(get_db),
    current_user=Depends(require_admin),
):
    return service_service.create_service(
        db,
        service_data,
    )


@router.patch(
    "/{service_id}",
    response_model=ServiceResponse,
)
def update_service(
    service_id: UUID,
    service_data: ServiceUpdate,
    db: Session = Depends(get_db),
    current_user=Depends(require_admin),
):
    service = service_service.get_service(
        db,
        service_id,
    )

    if service is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Service not found",
        )

    return service_service.update_service(
        db,
        service,
        service_data,
    )


@router.delete(
    "/{service_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_service(
    service_id: UUID,
    db: Session = Depends(get_db),
    current_user=Depends(require_admin),
):
    service = service_service.get_service(
        db,
        service_id,
    )

    if service is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Service not found",
        )

    service_service.delete_service(
        db,
        service,
    )