from app.models.project import Project
from app.services.project import delete_project
def project_payload():
    return {
        "title": "Test Project",
        "description": "Project created during automated testing.",
        "github_url": "https://github.com/example/test-project",
        "live_url": "https://example.com/test-project",
    }


def test_create_project(client):
    response = client.post(
        "/api/v1/projects",
        json=project_payload(),
    )

    assert response.status_code == 201

    data = response.json()

    assert data["title"] == "Test Project"
    assert data["description"] == "Project created during automated testing."
    assert data["github_url"] == "https://github.com/example/test-project"
    assert data["live_url"] == "https://example.com/test-project"

    assert "id" in data
    assert "created_at" in data
    assert "updated_at" in data


def test_list_projects(client):
    client.post(
        "/api/v1/projects",
        json=project_payload(),
    )

    response = client.get("/api/v1/projects")

    assert response.status_code == 200

    data = response.json()

    assert isinstance(data, list)
    assert len(data) >= 1


def test_get_project(client):
    create_response = client.post(
        "/api/v1/projects",
        json=project_payload(),
    )

    project_id = create_response.json()["id"]

    response = client.get(
        f"/api/v1/projects/{project_id}"
    )

    assert response.status_code == 200

    data = response.json()

    assert data["id"] == project_id
    assert data["title"] == "Test Project"


def test_get_nonexistent_project(client):
    nonexistent_id = "00000000-0000-0000-0000-000000000000"

    response = client.get(
        f"/api/v1/projects/{nonexistent_id}"
    )

    assert response.status_code == 404
    assert response.json()["detail"] == "Project not found"


def test_update_project(client):
    create_response = client.post(
        "/api/v1/projects",
        json=project_payload(),
    )

    project_id = create_response.json()["id"]

    update_payload = {
        "title": "Updated Project",
        "description": "Updated project description.",
    }

    response = client.patch(
        f"/api/v1/projects/{project_id}",
        json=update_payload,
    )

    assert response.status_code == 200

    data = response.json()

    assert data["id"] == project_id
    assert data["title"] == "Updated Project"
    assert data["description"] == "Updated project description."


def test_partial_update_project(client):
    create_response = client.post(
        "/api/v1/projects",
        json=project_payload(),
    )

    project_id = create_response.json()["id"]

    response = client.patch(
        f"/api/v1/projects/{project_id}",
        json={
            "title": "Only Title Changed",
        },
    )

    assert response.status_code == 200

    data = response.json()

    assert data["title"] == "Only Title Changed"
    assert data["description"] == "Project created during automated testing."


def test_delete_project(client):
    create_response = client.post(
        "/api/v1/projects",
        json=project_payload(),
    )

    project_id = create_response.json()["id"]

    delete_response = client.delete(
        f"/api/v1/projects/{project_id}"
    )

    assert delete_response.status_code == 204

    get_response = client.get(
        f"/api/v1/projects/{project_id}"
    )

    assert get_response.status_code == 404


def test_invalid_project_uuid(client):
    response = client.get(
        "/api/v1/projects/not-a-valid-uuid"
    )

    assert response.status_code == 422


def test_invalid_github_url(client):
    payload = project_payload()
    payload["github_url"] = "not-a-url"

    response = client.post(
        "/api/v1/projects",
        json=payload,
    )

    assert response.status_code == 422


def test_missing_required_fields(client):
    response = client.post(
        "/api/v1/projects",
        json={},
    )

    assert response.status_code == 422

def test_update_nonexistent_project(client):
    nonexistent_id = "00000000-0000-0000-0000-000000000000"

    response = client.patch(
        f"/api/v1/projects/{nonexistent_id}",
        json={
            "title": "Updated Project",
        },
    )

    assert response.status_code == 404
    assert response.json()["detail"] == "Project not found"

def test_delete_nonexistent_project(client):
    nonexistent_id = "00000000-0000-0000-0000-000000000000"

    response = client.delete(
        f"/api/v1/projects/{nonexistent_id}"
    )

    assert response.status_code == 404
    assert response.json()["detail"] == "Project not found"

def test_delete_project_service(db_session):
    project = Project(
        title="Service Test Project",
        description="Testing service layer deletion.",
    )

    db_session.add(project)
    db_session.commit()
    db_session.refresh(project)

    delete_project(db_session, project)

    deleted_project = db_session.get(Project, project.id)

    assert deleted_project is None