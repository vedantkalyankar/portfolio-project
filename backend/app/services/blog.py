from uuid import UUID

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.blog import Blog
from app.schemas.blog import BlogCreate, BlogUpdate


def get_blogs(
    db: Session,
) -> list[Blog]:
    statement = (
        select(Blog)
        .order_by(Blog.created_at.desc())
    )

    return list(db.scalars(statement).all())


def get_blog(
    db: Session,
    blog_id: UUID,
) -> Blog | None:
    return db.get(Blog, blog_id)


def create_blog(
    db: Session,
    blog_data: BlogCreate,
) -> Blog:
    blog = Blog(
        title=blog_data.title,
        slug=blog_data.slug,
        excerpt=blog_data.excerpt,
        content=blog_data.content,
        published=blog_data.published,
    )

    db.add(blog)
    db.commit()
    db.refresh(blog)

    return blog


def update_blog(
    db: Session,
    blog: Blog,
    blog_data: BlogUpdate,
) -> Blog:
    update_data = blog_data.model_dump(
        exclude_unset=True,
    )

    for field, value in update_data.items():
        setattr(blog, field, value)

    db.commit()
    db.refresh(blog)

    return blog


def delete_blog(
    db: Session,
    blog: Blog,
) -> None:
    db.delete(blog)
    db.commit()