from uuid import uuid4

from app.models.testimonial import Testimonial


def testimonial_payload():
    return {
        "name": "John Doe",
        "role": "Software Engineer",
        "company": "Example Corp",
        "content": "Excellent developer with strong problem-solving skills.",
    }


def test_list_testimonials_empty(client):
    response = client.get("/api/v1/testimonials")

    assert response.status_code == 200
    assert response.json() == []


def test_create_testimonial(client, admin_headers):
    response = client.post(
        "/api/v1/testimonials",
        json=testimonial_payload(),
        headers=admin_headers,
    )

    assert response.status_code == 201

    data = response.json()

    assert data["name"] == "John Doe"
    assert data["role"] == "Software Engineer"
    assert data["company"] == "Example Corp"
    assert data["content"] == (
        "Excellent developer with strong problem-solving skills."
    )
    assert "id" in data
    assert "created_at" in data
    assert "updated_at" in data


def test_create_testimonial_requires_authentication(client):
    response = client.post(
        "/api/v1/testimonials",
        json=testimonial_payload(),
    )

    assert response.status_code == 401


def test_create_testimonial_requires_admin(client, db_session):
    from app.core.security import create_access_token, hash_password
    from app.models.user import User

    user = User(
        username="normal-user",
        password_hash=hash_password("TestPassword123!"),
        is_active=True,
        is_admin=False,
    )

    db_session.add(user)
    db_session.commit()
    db_session.refresh(user)

    token = create_access_token(str(user.id))

    response = client.post(
        "/api/v1/testimonials",
        json=testimonial_payload(),
        headers={"Authorization": f"Bearer {token}"},
    )

    assert response.status_code == 403


def test_get_testimonial(client, admin_headers):
    create_response = client.post(
        "/api/v1/testimonials",
        json=testimonial_payload(),
        headers=admin_headers,
    )

    testimonial_id = create_response.json()["id"]

    response = client.get(
        f"/api/v1/testimonials/{testimonial_id}"
    )

    assert response.status_code == 200
    assert response.json()["id"] == testimonial_id


def test_get_testimonial_not_found(client):
    testimonial_id = uuid4()

    response = client.get(
        f"/api/v1/testimonials/{testimonial_id}"
    )

    assert response.status_code == 404
    assert response.json()["detail"] == "Testimonial not found"


def test_get_testimonial_invalid_uuid(client):
    response = client.get(
        "/api/v1/testimonials/not-a-uuid"
    )

    assert response.status_code == 422


def test_update_testimonial(client, admin_headers):
    create_response = client.post(
        "/api/v1/testimonials",
        json=testimonial_payload(),
        headers=admin_headers,
    )

    testimonial_id = create_response.json()["id"]

    response = client.patch(
        f"/api/v1/testimonials/{testimonial_id}",
        json={
            "role": "Senior Software Engineer",
            "company": "Updated Corp",
        },
        headers=admin_headers,
    )

    assert response.status_code == 200

    data = response.json()

    assert data["role"] == "Senior Software Engineer"
    assert data["company"] == "Updated Corp"
    assert data["name"] == "John Doe"


def test_update_testimonial_requires_authentication(client):
    testimonial_id = uuid4()

    response = client.patch(
        f"/api/v1/testimonials/{testimonial_id}",
        json={"role": "Updated Role"},
    )

    assert response.status_code == 401


def test_update_testimonial_not_found(client, admin_headers):
    testimonial_id = uuid4()

    response = client.patch(
        f"/api/v1/testimonials/{testimonial_id}",
        json={"role": "Updated Role"},
        headers=admin_headers,
    )

    assert response.status_code == 404
    assert response.json()["detail"] == "Testimonial not found"


def test_delete_testimonial(client, admin_headers):
    create_response = client.post(
        "/api/v1/testimonials",
        json=testimonial_payload(),
        headers=admin_headers,
    )

    testimonial_id = create_response.json()["id"]

    response = client.delete(
        f"/api/v1/testimonials/{testimonial_id}",
        headers=admin_headers,
    )

    assert response.status_code == 204

    get_response = client.get(
        f"/api/v1/testimonials/{testimonial_id}"
    )

    assert get_response.status_code == 404


def test_delete_testimonial_requires_authentication(client):
    testimonial_id = uuid4()

    response = client.delete(
        f"/api/v1/testimonials/{testimonial_id}"
    )

    assert response.status_code == 401


def test_delete_testimonial_not_found(client, admin_headers):
    testimonial_id = uuid4()

    response = client.delete(
        f"/api/v1/testimonials/{testimonial_id}",
        headers=admin_headers,
    )

    assert response.status_code == 404
    assert response.json()["detail"] == "Testimonial not found"


def test_list_testimonials_returns_created_testimonials(
    client,
    admin_headers,
):
    first = testimonial_payload()

    second = {
        "name": "Jane Smith",
        "role": "Product Manager",
        "company": "Another Corp",
        "content": "Great collaboration and communication.",
    }

    client.post(
        "/api/v1/testimonials",
        json=first,
        headers=admin_headers,
    )

    client.post(
        "/api/v1/testimonials",
        json=second,
        headers=admin_headers,
    )

    response = client.get("/api/v1/testimonials")

    assert response.status_code == 200

    data = response.json()

    assert len(data) == 2
    assert {item["name"] for item in data} == {
        "John Doe",
        "Jane Smith",
    }