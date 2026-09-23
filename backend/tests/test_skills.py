def skill_payload():
    return {
        "name": "Python",
        "category": "Backend",
        "proficiency": "Advanced",
    }


def test_create_skill(client):
    response = client.post(
        "/api/v1/skills",
        json=skill_payload(),
    )

    assert response.status_code == 201

    data = response.json()

    assert data["name"] == "Python"
    assert data["category"] == "Backend"
    assert data["proficiency"] == "Advanced"

    assert "id" in data
    assert "created_at" in data
    assert "updated_at" in data


def test_list_skills(client):
    client.post(
        "/api/v1/skills",
        json=skill_payload(),
    )

    response = client.get("/api/v1/skills")

    assert response.status_code == 200

    data = response.json()

    assert isinstance(data, list)
    assert len(data) >= 1


def test_get_skill(client):
    create_response = client.post(
        "/api/v1/skills",
        json=skill_payload(),
    )

    skill_id = create_response.json()["id"]

    response = client.get(
        f"/api/v1/skills/{skill_id}"
    )

    assert response.status_code == 200

    data = response.json()

    assert data["id"] == skill_id
    assert data["name"] == "Python"


def test_get_nonexistent_skill(client):
    nonexistent_id = "00000000-0000-0000-0000-000000000000"

    response = client.get(
        f"/api/v1/skills/{nonexistent_id}"
    )

    assert response.status_code == 404
    assert response.json()["detail"] == "Skill not found"


def test_update_skill(client):
    create_response = client.post(
        "/api/v1/skills",
        json=skill_payload(),
    )

    skill_id = create_response.json()["id"]

    response = client.patch(
        f"/api/v1/skills/{skill_id}",
        json={
            "name": "FastAPI",
            "category": "Backend",
            "proficiency": "Advanced",
        },
    )

    assert response.status_code == 200

    data = response.json()

    assert data["id"] == skill_id
    assert data["name"] == "FastAPI"
    assert data["category"] == "Backend"
    assert data["proficiency"] == "Advanced"


def test_partial_update_skill(client):
    create_response = client.post(
        "/api/v1/skills",
        json=skill_payload(),
    )

    skill_id = create_response.json()["id"]

    response = client.patch(
        f"/api/v1/skills/{skill_id}",
        json={
            "proficiency": "Expert",
        },
    )

    assert response.status_code == 200

    data = response.json()

    assert data["name"] == "Python"
    assert data["category"] == "Backend"
    assert data["proficiency"] == "Expert"


def test_delete_skill(client):
    create_response = client.post(
        "/api/v1/skills",
        json=skill_payload(),
    )

    skill_id = create_response.json()["id"]

    delete_response = client.delete(
        f"/api/v1/skills/{skill_id}"
    )

    assert delete_response.status_code == 204

    get_response = client.get(
        f"/api/v1/skills/{skill_id}"
    )

    assert get_response.status_code == 404


def test_update_nonexistent_skill(client):
    nonexistent_id = "00000000-0000-0000-0000-000000000000"

    response = client.patch(
        f"/api/v1/skills/{nonexistent_id}",
        json={
            "name": "Python",
        },
    )

    assert response.status_code == 404
    assert response.json()["detail"] == "Skill not found"


def test_delete_nonexistent_skill(client):
    nonexistent_id = "00000000-0000-0000-0000-000000000000"

    response = client.delete(
        f"/api/v1/skills/{nonexistent_id}"
    )

    assert response.status_code == 404
    assert response.json()["detail"] == "Skill not found"


def test_invalid_skill_uuid(client):
    response = client.get(
        "/api/v1/skills/not-a-valid-uuid"
    )

    assert response.status_code == 422


def test_missing_required_skill_fields(client):
    response = client.post(
        "/api/v1/skills",
        json={},
    )

    assert response.status_code == 422


def test_invalid_skill_field_lengths(client):
    response = client.post(
        "/api/v1/skills",
        json={
            "name": "",
            "category": "",
            "proficiency": "",
        },
    )

    assert response.status_code == 422