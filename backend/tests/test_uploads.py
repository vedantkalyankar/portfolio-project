from pathlib import Path
from uuid import uuid4

from fastapi.testclient import TestClient


def test_upload_requires_authentication(client):
    response = client.post(
        "/api/v1/uploads",
        files={
            "file": (
                "test.png",
                b"fake-image-data",
                "image/png",
            )
        },
    )

    assert response.status_code == 401


def test_upload_requires_admin(client, db_session):
    from app.core.security import create_access_token, hash_password
    from app.models.user import User

    user = User(
        username="upload-normal-user",
        password_hash=hash_password("TestPassword123!"),
        is_active=True,
        is_admin=False,
    )

    db_session.add(user)
    db_session.commit()
    db_session.refresh(user)

    token = create_access_token(str(user.id))

    response = client.post(
        "/api/v1/uploads",
        files={
            "file": (
                "test.png",
                b"fake-image-data",
                "image/png",
            )
        },
        headers={
            "Authorization": f"Bearer {token}",
        },
    )

    assert response.status_code == 403


def test_upload_png(client, admin_headers):
    response = client.post(
        "/api/v1/uploads",
        files={
            "file": (
                "profile.png",
                b"fake-png-content",
                "image/png",
            )
        },
        headers=admin_headers,
    )

    assert response.status_code == 201

    data = response.json()

    assert data["original_filename"] == "profile.png"
    assert data["content_type"] == "image/png"
    assert data["file_size"] == len(b"fake-png-content")
    assert data["stored_filename"].endswith(".png")
    assert "id" in data


def test_upload_jpeg(client, admin_headers):
    response = client.post(
        "/api/v1/uploads",
        files={
            "file": (
                "photo.jpg",
                b"fake-jpeg-content",
                "image/jpeg",
            )
        },
        headers=admin_headers,
    )

    assert response.status_code == 201

    data = response.json()

    assert data["original_filename"] == "photo.jpg"
    assert data["content_type"] == "image/jpeg"
    assert data["stored_filename"].endswith(".jpg")


def test_upload_webp(client, admin_headers):
    response = client.post(
        "/api/v1/uploads",
        files={
            "file": (
                "image.webp",
                b"fake-webp-content",
                "image/webp",
            )
        },
        headers=admin_headers,
    )

    assert response.status_code == 201

    data = response.json()

    assert data["content_type"] == "image/webp"
    assert data["stored_filename"].endswith(".webp")


def test_upload_pdf(client, admin_headers):
    response = client.post(
        "/api/v1/uploads",
        files={
            "file": (
                "document.pdf",
                b"fake-pdf-content",
                "application/pdf",
            )
        },
        headers=admin_headers,
    )

    assert response.status_code == 201

    data = response.json()

    assert data["content_type"] == "application/pdf"
    assert data["stored_filename"].endswith(".pdf")


def test_upload_rejects_unsupported_file_type(
    client,
    admin_headers,
):
    response = client.post(
        "/api/v1/uploads",
        files={
            "file": (
                "script.exe",
                b"fake-executable",
                "application/octet-stream",
            )
        },
        headers=admin_headers,
    )

    assert response.status_code == 400
    assert response.json()["detail"] == "Unsupported file type"


def test_upload_rejects_large_file(
    client,
    admin_headers,
):
    large_file = b"x" * (5 * 1024 * 1024 + 1)

    response = client.post(
        "/api/v1/uploads",
        files={
            "file": (
                "large.png",
                large_file,
                "image/png",
            )
        },
        headers=admin_headers,
    )

    assert response.status_code == 400
    assert response.json()["detail"] == (
        "File size exceeds the maximum allowed size"
    )


def test_get_uploaded_file(
    client,
    admin_headers,
):
    response = client.post(
        "/api/v1/uploads",
        files={
            "file": (
                "download-test.png",
                b"download-content",
                "image/png",
            )
        },
        headers=admin_headers,
    )

    assert response.status_code == 201

    upload_id = response.json()["id"]

    download_response = client.get(
        f"/api/v1/uploads/{upload_id}"
    )

    assert download_response.status_code == 200
    assert download_response.content == b"download-content"
    assert download_response.headers["content-type"] == "image/png"


def test_get_upload_not_found(client):
    upload_id = uuid4()

    response = client.get(
        f"/api/v1/uploads/{upload_id}"
    )

    assert response.status_code == 404
    assert response.json()["detail"] == "Upload not found"


def test_get_upload_invalid_uuid(client):
    response = client.get(
        "/api/v1/uploads/not-a-uuid"
    )

    assert response.status_code == 422


def test_upload_stores_uuid_based_filename(
    client,
    admin_headers,
):
    response = client.post(
        "/api/v1/uploads",
        files={
            "file": (
                "my-profile-photo.png",
                b"image-content",
                "image/png",
            )
        },
        headers=admin_headers,
    )

    assert response.status_code == 201

    data = response.json()

    assert data["stored_filename"] != "my-profile-photo.png"
    assert data["stored_filename"].endswith(".png")

    file_path = Path(data["file_path"])

    assert file_path.exists()

    file_path.unlink(missing_ok=True)


def test_upload_with_missing_file(
    client,
    admin_headers,
):
    response = client.post(
        "/api/v1/uploads",
        headers=admin_headers,
    )

    assert response.status_code == 422