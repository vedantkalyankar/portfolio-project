from fastapi import APIRouter
from fastapi.testclient import TestClient

from app.main import app


def test_generic_exception_handler():
    router = APIRouter()

    @router.get("/test-error")
    def trigger_test_error():
        raise RuntimeError("This should not be exposed")

    app.include_router(router)

    try:
        with TestClient(
            app,
            raise_server_exceptions=False,
        ) as test_client:
            response = test_client.get("/test-error")

        assert response.status_code == 500
        assert response.json() == {
            "detail": "An unexpected error occurred."
        }

    finally:
        app.router.routes.pop()