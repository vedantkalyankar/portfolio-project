from app.core.security import hash_password
from app.models.user import User


def create_test_user(db_session):
    user = User(
        username="admin",
        password_hash=hash_password("AdminPassword123!"),
        is_active=True,
        is_admin=True,
    )

    db_session.add(user)
    db_session.commit()
    db_session.refresh(user)

    return user


def test_login_success(client, db_session):
    create_test_user(db_session)

    response = client.post(
        "/api/v1/auth/login",
        json={
            "username": "admin",
            "password": "AdminPassword123!",
        },
    )

    assert response.status_code == 200

    data = response.json()

    assert "access_token" in data
    assert data["token_type"] == "bearer"


def test_login_wrong_password(client, db_session):
    create_test_user(db_session)

    response = client.post(
        "/api/v1/auth/login",
        json={
            "username": "admin",
            "password": "WrongPassword123!",
        },
    )

    assert response.status_code == 401
    assert response.json()["detail"] == "Invalid username or password"


def test_login_nonexistent_user(client):
    response = client.post(
        "/api/v1/auth/login",
        json={
            "username": "does-not-exist",
            "password": "SomePassword123!",
        },
    )

    assert response.status_code == 401
    assert response.json()["detail"] == "Invalid username or password"


def test_login_inactive_user(client, db_session):
    user = create_test_user(db_session)

    user.is_active = False
    db_session.commit()

    response = client.post(
        "/api/v1/auth/login",
        json={
            "username": "admin",
            "password": "AdminPassword123!",
        },
    )

    assert response.status_code == 401
    assert response.json()["detail"] == "Invalid username or password"


def test_login_missing_fields(client):
    response = client.post(
        "/api/v1/auth/login",
        json={},
    )

    assert response.status_code == 422