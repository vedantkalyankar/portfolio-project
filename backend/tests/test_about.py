def about_payload():
    return {
        "name": "Vedant Kalyankar",
        "title": "Software Engineer",
        "bio": "Backend-focused software engineer building production-grade applications.",
        "email": "vedant@example.com",
        "location": "Pune, India",
        "github_url": "https://github.com/vedant",
        "linkedin_url": "https://www.linkedin.com/in/vedant",
    }


def test_get_about_when_not_exists(client):
    response = client.get("/api/v1/about")

    assert response.status_code == 404
    assert response.json()["detail"] == "About information not found"


def test_create_about(client, admin_headers):
    response = client.post(
        "/api/v1/about",
        json=about_payload(),
        headers=admin_headers,
    )

    assert response.status_code == 201

    data = response.json()

    assert data["name"] == "Vedant Kalyankar"
    assert data["title"] == "Software Engineer"
    assert data["email"] == "vedant@example.com"
    assert data["location"] == "Pune, India"
    assert "id" in data
    assert "created_at" in data
    assert "updated_at" in data


def test_get_about(client, admin_headers):
    client.post(
        "/api/v1/about",
        json=about_payload(),
        headers=admin_headers,
    )

    response = client.get("/api/v1/about")

    assert response.status_code == 200

    data = response.json()

    assert data["name"] == "Vedant Kalyankar"
    assert data["title"] == "Software Engineer"


def test_create_about_twice(client, admin_headers):
    first_response = client.post(
        "/api/v1/about",
        json=about_payload(),
        headers=admin_headers,
    )

    assert first_response.status_code == 201

    second_response = client.post(
        "/api/v1/about",
        json=about_payload(),
        headers=admin_headers,
    )

    assert second_response.status_code == 409
    assert second_response.json()["detail"] == (
        "About information already exists"
    )


def test_update_about(client, admin_headers):
    client.post(
        "/api/v1/about",
        json=about_payload(),
        headers=admin_headers,
    )

    response = client.patch(
        "/api/v1/about",
        json={
            "title": "Senior Software Engineer",
            "location": "Mumbai, India",
        },
        headers=admin_headers,
    )

    assert response.status_code == 200

    data = response.json()

    assert data["title"] == "Senior Software Engineer"
    assert data["location"] == "Mumbai, India"


def test_delete_about(client, admin_headers):
    client.post(
        "/api/v1/about",
        json=about_payload(),
        headers=admin_headers,
    )

    response = client.delete(
        "/api/v1/about",
        headers=admin_headers,
    )

    assert response.status_code == 204

    get_response = client.get("/api/v1/about")

    assert get_response.status_code == 404


def test_create_about_requires_admin(client):
    response = client.post(
        "/api/v1/about",
        json=about_payload(),
    )

    assert response.status_code == 401


def test_update_about_requires_admin(client):
    response = client.patch(
        "/api/v1/about",
        json={
            "title": "Software Engineer",
        },
    )

    assert response.status_code == 401


def test_delete_about_requires_admin(client):
    response = client.delete("/api/v1/about")

    assert response.status_code == 401


def test_create_about_invalid_email(client, admin_headers):
    payload = about_payload()
    payload["email"] = "invalid-email"

    response = client.post(
        "/api/v1/about",
        json=payload,
        headers=admin_headers,
    )

    assert response.status_code == 422


def test_create_about_invalid_url(client, admin_headers):
    payload = about_payload()
    payload["github_url"] = "not-a-url"

    response = client.post(
        "/api/v1/about",
        json=payload,
        headers=admin_headers,
    )

    assert response.status_code == 422