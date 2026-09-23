from app.core.security import create_access_token, hash_password
from app.models import User


def create_user(
    db_session,
    username,
    is_admin=False,
    is_active=True,
):
    user = User(
        username=username,
        password_hash=hash_password("TestPassword123!"),
        is_active=is_active,
        is_admin=is_admin,
    )

    db_session.add(user)
    db_session.commit()
    db_session.refresh(user)

    return user


def test_create_project_without_authentication(client):
    response = client.post(
        "/api/v1/projects",
        json={
            "title": "Unauthorized Project",
            "description": "Should not be created",
        },
    )

    assert response.status_code == 401


def test_create_project_with_normal_user(client, db_session):
    user = create_user(
        db_session,
        "normal-project-user",
        is_admin=False,
    )

    token = create_access_token(str(user.id))

    response = client.post(
        "/api/v1/projects",
        json={
            "title": "Unauthorized Project",
            "description": "Normal user should not create this",
        },
        headers={
            "Authorization": f"Bearer {token}",
        },
    )

    assert response.status_code == 403
    assert response.json()["detail"] == "Admin access required"


def test_create_project_with_admin(client, admin_headers):
    response = client.post(
        "/api/v1/projects",
        json={
            "title": "Admin Project",
            "description": "Created by admin",
        },
        headers=admin_headers,
    )

    assert response.status_code == 201


def test_create_skill_with_normal_user(client, db_session):
    user = create_user(
        db_session,
        "normal-skill-user",
        is_admin=False,
    )

    token = create_access_token(str(user.id))

    response = client.post(
        "/api/v1/skills",
        json={
            "name": "Python",
            "category": "Backend",
            "proficiency": "Advanced",
        },
        headers={
            "Authorization": f"Bearer {token}",
        },
    )

    assert response.status_code == 403
    assert response.json()["detail"] == "Admin access required"


def test_create_skill_with_admin(client, admin_headers):
    response = client.post(
        "/api/v1/skills",
        json={
            "name": "Python",
            "category": "Backend",
            "proficiency": "Advanced",
        },
        headers=admin_headers,
    )

    assert response.status_code == 201