from fastapi import FastAPI

from app.api.v1.projects import router as projects_router
from app.api.v1.skills import router as skills_router
from app.api.v1.auth import router as auth_router
from app.core.exceptions import generic_exception_handler
from app.api.v1.about import router as about_router
from app.api.v1.blogs import router as blogs_router
from app.api.v1 import experiences
from app.api.v1 import testimonials
from app.api.v1 import services

app = FastAPI(
    title="Portfolio CMS API",
    description="Backend API for the portfolio and custom CMS",
    version="1.0.0",
)
app.add_exception_handler(Exception, generic_exception_handler)

app.include_router(projects_router, prefix="/api/v1")
app.include_router(skills_router, prefix="/api/v1")
app.include_router(auth_router, prefix="/api/v1")
app.include_router(about_router, prefix="/api/v1")
app.include_router(blogs_router, prefix="/api/v1")
app.include_router(experiences.router, prefix="/api/v1")
app.include_router(testimonials.router, prefix="/api/v1")
app.include_router(services.router, prefix="/api/v1")

@app.get("/")
def root():
    return {
        "message": "Portfolio CMS API is running"
    }


@app.get("/health")
def health():
    return {
        "status": "healthy"
    }