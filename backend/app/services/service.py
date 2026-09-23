from uuid import UUID

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.service import Service
from app.schemas.service import ServiceCreate, ServiceUpdate


def get_services(db: Session) -> list[Service]:
    statement = select(Service).order_by(
        Service.created_at.desc()
    )

    return list(db.scalars(statement).all())


def get_service(
    db: Session,
    service_id: UUID,
) -> Service | None:
    return db.get(Service, service_id)


def create_service(
    db: Session,
    service_data: ServiceCreate,
) -> Service:
    service = Service(
        title=service_data.title,
        description=service_data.description,
        icon=service_data.icon,
    )

    db.add(service)
    db.commit()
    db.refresh(service)

    return service


def update_service(
    db: Session,
    service: Service,
    service_data: ServiceUpdate,
) -> Service:
    update_data = service_data.model_dump(
        exclude_unset=True
    )

    for field, value in update_data.items():
        setattr(service, field, value)

    db.commit()
    db.refresh(service)

    return service


def delete_service(
    db: Session,
    service: Service,
) -> None:
    db.delete(service)
    db.commit()