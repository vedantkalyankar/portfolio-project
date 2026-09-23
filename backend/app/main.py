from fastapi import FastAPI

from app.api.v1.projects import router as projects_router
from app.api.v1.skills import router as skills_router
from app.api.v1.auth import router as auth_router

app = FastAPI(
    title="Portfolio CMS API",
    description="Backend API for the portfolio and custom CMS",
    version="1.0.0",
)
app.include_router(projects_router, prefix="/api/v1")
app.include_router(skills_router, prefix="/api/v1")
app.include_router(auth_router, prefix="/api/v1")
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