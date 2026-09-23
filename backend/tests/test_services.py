from uuid import uuid4

from app.core.security import create_access_token, hash_password
from app.models.user import User


def service_payload():
    return {
        "title": "Backend Development",
        "description": "Production-grade backend API development.",
        "icon": "server",
    }


def test_list_services_empty(client):
    response = client.get("/api/v1/services")

    assert response.status_code == 200
    assert response.json() == []


def test_create_service(client, admin_headers):
    response = client.post(
        "/api/v1/services",
        json=service_payload(),
        headers=admin_headers,
    )

    assert response.status_code == 201

    data = response.json()

    assert data["title"] == "Backend Development"
    assert data["description"] == (
        "Production-grade backend API development."
    )
    assert data["icon"] == "server"
    assert "id" in data
    assert "created_at" in data
    assert "updated_at" in data


def test_create_service_requires_authentication(client):
    response = client.post(
        "/api/v1/services",
        json=service_payload(),
    )

    assert response.status_code == 401


def test_create_service_requires_admin(client, db_session):
    user = User(
        username="normal-service-user",
        password_hash=hash_password("TestPassword123!"),
        is_active=True,
        is_admin=False,
    )

    db_session.add(user)
    db_session.commit()
    db_session.refresh(user)

    token = create_access_token(str(user.id))

    response = client.post(
        "/api/v1/services",
        json=service_payload(),
        headers={"Authorization": f"Bearer {token}"},
    )

    assert response.status_code == 403


def test_get_service(client, admin_headers):
    create_response = client.post(
        "/api/v1/services",
        json=service_payload(),
        headers=admin_headers,
    )

    service_id = create_response.json()["id"]

    response = client.get(
        f"/api/v1/services/{service_id}"
    )

    assert response.status_code == 200
    assert response.json()["id"] == service_id


def test_get_service_not_found(client):
    service_id = uuid4()

    response = client.get(
        f"/api/v1/services/{service_id}"
    )

    assert response.status_code == 404
    assert response.json()["detail"] == "Service not found"


def test_get_service_invalid_uuid(client):
    response = client.get(
        "/api/v1/services/not-a-uuid"
    )

    assert response.status_code == 422


def test_update_service(client, admin_headers):
    create_response = client.post(
        "/api/v1/services",
        json=service_payload(),
        headers=admin_headers,
    )

    service_id = create_response.json()["id"]

    response = client.patch(
        f"/api/v1/services/{service_id}",
        json={
            "title": "Advanced Backend Development",
            "icon": "database",
        },
        headers=admin_headers,
    )

    assert response.status_code == 200

    data = response.json()

    assert data["title"] == "Advanced Backend Development"
    assert data["icon"] == "database"
    assert data["description"] == (
        "Production-grade backend API development."
    )


def test_update_service_requires_authentication(client):
    service_id = uuid4()

    response = client.patch(
        f"/api/v1/services/{service_id}",
        json={"title": "Updated Service"},
    )

    assert response.status_code == 401


def test_update_service_not_found(client, admin_headers):
    service_id = uuid4()

    response = client.patch(
        f"/api/v1/services/{service_id}",
        json={"title": "Updated Service"},
        headers=admin_headers,
    )

    assert response.status_code == 404
    assert response.json()["detail"] == "Service not found"


def test_delete_service(client, admin_headers):
    create_response = client.post(
        "/api/v1/services",
        json=service_payload(),
        headers=admin_headers,
    )

    service_id = create_response.json()["id"]

    response = client.delete(
        f"/api/v1/services/{service_id}",
        headers=admin_headers,
    )

    assert response.status_code == 204

    get_response = client.get(
        f"/api/v1/services/{service_id}"
    )

    assert get_response.status_code == 404


def test_delete_service_requires_authentication(client):
    service_id = uuid4()

    response = client.delete(
        f"/api/v1/services/{service_id}"
    )

    assert response.status_code == 401


def test_delete_service_not_found(client, admin_headers):
    service_id = uuid4()

    response = client.delete(
        f"/api/v1/services/{service_id}",
        headers=admin_headers,
    )

    assert response.status_code == 404
    assert response.json()["detail"] == "Service not found"


def test_list_services_returns_created_services(
    client,
    admin_headers,
):
    first = service_payload()

    second = {
        "title": "AI Development",
        "description": "AI and machine learning solutions.",
        "icon": "brain",
    }

    client.post(
        "/api/v1/services",
        json=first,
        headers=admin_headers,
    )

    client.post(
        "/api/v1/services",
        json=second,
        headers=admin_headers,
    )

    response = client.get("/api/v1/services")

    assert response.status_code == 200

    data = response.json()

    assert len(data) == 2
    assert {item["title"] for item in data} == {
        "Backend Development",
        "AI Development",
    }