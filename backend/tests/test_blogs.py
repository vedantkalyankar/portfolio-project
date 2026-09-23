def blog_payload():
    return {
        "title": "Building a Production FastAPI Application",
        "slug": "building-production-fastapi-application",
        "excerpt": "A practical guide to building a production-grade FastAPI backend.",
        "content": "This article covers architecture, authentication, testing, and deployment.",
        "published": True,
    }


def test_create_blog(client, admin_headers):
    response = client.post(
        "/api/v1/blogs",
        json=blog_payload(),
        headers=admin_headers,
    )

    assert response.status_code == 201

    data = response.json()

    assert data["title"] == blog_payload()["title"]
    assert data["slug"] == blog_payload()["slug"]
    assert data["published"] is True
    assert "id" in data
    assert "created_at" in data
    assert "updated_at" in data


def test_list_blogs(client, admin_headers):
    client.post(
        "/api/v1/blogs",
        json=blog_payload(),
        headers=admin_headers,
    )

    response = client.get("/api/v1/blogs")

    assert response.status_code == 200

    data = response.json()

    assert isinstance(data, list)
    assert len(data) == 1
    assert data[0]["title"] == blog_payload()["title"]


def test_get_blog(client, admin_headers):
    create_response = client.post(
        "/api/v1/blogs",
        json=blog_payload(),
        headers=admin_headers,
    )

    blog_id = create_response.json()["id"]

    response = client.get(
        f"/api/v1/blogs/{blog_id}",
    )

    assert response.status_code == 200
    assert response.json()["id"] == blog_id


def test_get_nonexistent_blog(client):
    response = client.get(
        "/api/v1/blogs/00000000-0000-0000-0000-000000000000",
    )

    assert response.status_code == 404
    assert response.json()["detail"] == "Blog not found"


def test_update_blog(client, admin_headers):
    create_response = client.post(
        "/api/v1/blogs",
        json=blog_payload(),
        headers=admin_headers,
    )

    blog_id = create_response.json()["id"]

    response = client.patch(
        f"/api/v1/blogs/{blog_id}",
        json={
            "title": "Updated FastAPI Article",
            "published": False,
        },
        headers=admin_headers,
    )

    assert response.status_code == 200

    data = response.json()

    assert data["title"] == "Updated FastAPI Article"
    assert data["published"] is False


def test_partial_update_blog(client, admin_headers):
    create_response = client.post(
        "/api/v1/blogs",
        json=blog_payload(),
        headers=admin_headers,
    )

    blog_id = create_response.json()["id"]

    response = client.patch(
        f"/api/v1/blogs/{blog_id}",
        json={
            "excerpt": "Updated excerpt.",
        },
        headers=admin_headers,
    )

    assert response.status_code == 200

    data = response.json()

    assert data["excerpt"] == "Updated excerpt."
    assert data["title"] == blog_payload()["title"]


def test_delete_blog(client, admin_headers):
    create_response = client.post(
        "/api/v1/blogs",
        json=blog_payload(),
        headers=admin_headers,
    )

    blog_id = create_response.json()["id"]

    response = client.delete(
        f"/api/v1/blogs/{blog_id}",
        headers=admin_headers,
    )

    assert response.status_code == 204

    get_response = client.get(
        f"/api/v1/blogs/{blog_id}",
    )

    assert get_response.status_code == 404


def test_update_nonexistent_blog(client, admin_headers):
    response = client.patch(
        "/api/v1/blogs/00000000-0000-0000-0000-000000000000",
        json={
            "title": "Updated",
        },
        headers=admin_headers,
    )

    assert response.status_code == 404


def test_delete_nonexistent_blog(client, admin_headers):
    response = client.delete(
        "/api/v1/blogs/00000000-0000-0000-0000-000000000000",
        headers=admin_headers,
    )

    assert response.status_code == 404


def test_invalid_blog_uuid(client):
    response = client.get("/api/v1/blogs/not-a-uuid")

    assert response.status_code == 422


def test_create_blog_requires_admin(client):
    response = client.post(
        "/api/v1/blogs",
        json=blog_payload(),
    )

    assert response.status_code == 401


def test_update_blog_requires_admin(client):
    response = client.patch(
        "/api/v1/blogs/00000000-0000-0000-0000-000000000000",
        json={
            "title": "Updated",
        },
    )

    assert response.status_code == 401


def test_delete_blog_requires_admin(client):
    response = client.delete(
        "/api/v1/blogs/00000000-0000-0000-0000-000000000000",
    )

    assert response.status_code == 401

def test_create_blog_duplicate_slug(client, admin_headers):
    first_response = client.post(
        "/api/v1/blogs",
        json=blog_payload(),
        headers=admin_headers,
    )

    assert first_response.status_code == 201

    second_response = client.post(
        "/api/v1/blogs",
        json=blog_payload(),
        headers=admin_headers,
    )

    assert second_response.status_code == 409
    assert second_response.json()["detail"] == "Blog slug already exists"