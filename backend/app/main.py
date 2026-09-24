from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.v1.projects import router as projects_router
from app.api.v1.skills import router as skills_router
from app.api.v1.auth import router as auth_router
from app.core.exceptions import generic_exception_handler
from app.api.v1.about import router as about_router
from app.api.v1.blogs import router as blogs_router
from app.api.v1 import experiences
from app.api.v1 import testimonials
from app.api.v1 import services
from app.api.v1 import uploads

app = FastAPI(
    title="Portfolio CMS API",
    description="Backend API for the portfolio and custom CMS",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
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
app.include_router(uploads.router, prefix="/api/v1")

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