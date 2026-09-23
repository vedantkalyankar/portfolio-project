from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.about import About
from app.schemas.about import AboutCreate, AboutUpdate


def get_about(
    db: Session,
) -> About | None:
    statement = select(About).limit(1)

    return db.scalar(statement)


def create_about(
    db: Session,
    about_data: AboutCreate,
) -> About:
    about = About(
        name=about_data.name,
        title=about_data.title,
        bio=about_data.bio,
        email=str(about_data.email),
        location=about_data.location,
        github_url=(
            str(about_data.github_url)
            if about_data.github_url
            else None
        ),
        linkedin_url=(
            str(about_data.linkedin_url)
            if about_data.linkedin_url
            else None
        ),
    )

    db.add(about)
    db.commit()
    db.refresh(about)

    return about


def update_about(
    db: Session,
    about: About,
    about_data: AboutUpdate,
) -> About:
    update_data = about_data.model_dump(
        exclude_unset=True,
    )

    for field, value in update_data.items():
        if field in {"github_url", "linkedin_url"}:
            value = str(value) if value is not None else None

        elif field == "email":
            value = str(value)

        setattr(about, field, value)

    db.commit()
    db.refresh(about)

    return about


def delete_about(
    db: Session,
    about: About,
) -> None:
    db.delete(about)
    db.commit()