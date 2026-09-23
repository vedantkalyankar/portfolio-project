from uuid import uuid4


def experience_payload():
    return {
        "company": "Expleo",
        "role": "Software Engineer",
        "location": "Pune, India",
        "description": "Backend development, automation, and software engineering.",
        "start_date": "2025-04-02",
        "end_date": None,
        "is_current": True,
    }


def test_create_experience(client, admin_headers):
    response = client.post(
        "/api/v1/experiences",
        json=experience_payload(),
        headers=admin_headers,
    )

    assert response.status_code == 201

    data = response.json()

    assert data["company"] == "Expleo"
    assert data["role"] == "Software Engineer"
    assert data["location"] == "Pune, India"
    assert data["start_date"] == "2025-04-02"
    assert data["end_date"] is None
    assert data["is_current"] is True
    assert "id" in data
    assert "created_at" in data
    assert "updated_at" in data


def test_list_experiences(client, admin_headers):
    client.post(
        "/api/v1/experiences",
        json=experience_payload(),
        headers=admin_headers,
    )

    response = client.get("/api/v1/experiences")

    assert response.status_code == 200

    data = response.json()

    assert isinstance(data, list)
    assert len(data) == 1
    assert data[0]["company"] == "Expleo"


def test_get_experience(client, admin_headers):
    create_response = client.post(
        "/api/v1/experiences",
        json=experience_payload(),
        headers=admin_headers,
    )

    experience_id = create_response.json()["id"]

    response = client.get(
        f"/api/v1/experiences/{experience_id}"
    )

    assert response.status_code == 200
    assert response.json()["id"] == experience_id


def test_get_nonexistent_experience(client):
    experience_id = uuid4()

    response = client.get(
        f"/api/v1/experiences/{experience_id}"
    )

    assert response.status_code == 404
    assert response.json()["detail"] == "Experience not found"


def test_update_experience(client, admin_headers):
    create_response = client.post(
        "/api/v1/experiences",
        json=experience_payload(),
        headers=admin_headers,
    )

    experience_id = create_response.json()["id"]

    response = client.patch(
        f"/api/v1/experiences/{experience_id}",
        json={
            "role": "Senior Software Engineer",
            "location": "Mumbai, India",
        },
        headers=admin_headers,
    )

    assert response.status_code == 200

    data = response.json()

    assert data["role"] == "Senior Software Engineer"
    assert data["location"] == "Mumbai, India"
    assert data["company"] == "Expleo"


def test_partial_update_experience(client, admin_headers):
    create_response = client.post(
        "/api/v1/experiences",
        json=experience_payload(),
        headers=admin_headers,
    )

    experience_id = create_response.json()["id"]

    response = client.patch(
        f"/api/v1/experiences/{experience_id}",
        json={
            "description": "Updated backend engineering experience.",
        },
        headers=admin_headers,
    )

    assert response.status_code == 200

    data = response.json()

    assert data["description"] == (
        "Updated backend engineering experience."
    )
    assert data["company"] == "Expleo"
    assert data["role"] == "Software Engineer"


def test_delete_experience(client, admin_headers):
    create_response = client.post(
        "/api/v1/experiences",
        json=experience_payload(),
        headers=admin_headers,
    )

    experience_id = create_response.json()["id"]

    response = client.delete(
        f"/api/v1/experiences/{experience_id}",
        headers=admin_headers,
    )

    assert response.status_code == 204

    get_response = client.get(
        f"/api/v1/experiences/{experience_id}"
    )

    assert get_response.status_code == 404


def test_update_nonexistent_experience(client, admin_headers):
    experience_id = uuid4()

    response = client.patch(
        f"/api/v1/experiences/{experience_id}",
        json={"role": "Updated Role"},
        headers=admin_headers,
    )

    assert response.status_code == 404
    assert response.json()["detail"] == "Experience not found"


def test_delete_nonexistent_experience(client, admin_headers):
    experience_id = uuid4()

    response = client.delete(
        f"/api/v1/experiences/{experience_id}",
        headers=admin_headers,
    )

    assert response.status_code == 404
    assert response.json()["detail"] == "Experience not found"


def test_invalid_experience_uuid(client):
    response = client.get(
        "/api/v1/experiences/not-a-uuid"
    )

    assert response.status_code == 422


def test_create_experience_requires_admin(client):
    response = client.post(
        "/api/v1/experiences",
        json=experience_payload(),
    )

    assert response.status_code == 401


def test_update_experience_requires_admin(client):
    experience_id = uuid4()

    response = client.patch(
        f"/api/v1/experiences/{experience_id}",
        json={"role": "Updated Role"},
    )

    assert response.status_code == 401


def test_delete_experience_requires_admin(client):
    experience_id = uuid4()

    response = client.delete(
        f"/api/v1/experiences/{experience_id}"
    )

    assert response.status_code == 401


def test_create_experience_with_end_date(client, admin_headers):
    payload = experience_payload()
    payload["end_date"] = "2026-03-31"
    payload["is_current"] = False

    response = client.post(
        "/api/v1/experiences",
        json=payload,
        headers=admin_headers,
    )

    assert response.status_code == 201

    data = response.json()

    assert data["end_date"] == "2026-03-31"
    assert data["is_current"] is False