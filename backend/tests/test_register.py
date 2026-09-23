def test_register_user(client):
    response = client.post(
        "/api/v1/auth/register",
        json={
            "username": "new-user",
            "password": "TestPassword123!",
        },
    )

    assert response.status_code == 201

    data = response.json()

    assert data["username"] == "new-user"
    assert data["is_active"] is True
    assert data["is_admin"] is False
    assert "password" not in data
    assert "password_hash" not in data

def test_register_duplicate_username(client):
    payload = {
        "username": "duplicate-user",
        "password": "TestPassword123!",
    }

    first_response = client.post(
        "/api/v1/auth/register",
        json=payload,
    )

    assert first_response.status_code == 201

    second_response = client.post(
        "/api/v1/auth/register",
        json=payload,
    )

    assert second_response.status_code == 409
    assert second_response.json() == {
        "detail": "Username already exists"
    }

def test_register_user_cannot_create_admin(client):
    response = client.post(
        "/api/v1/auth/register",
        json={
            "username": "regular-user",
            "password": "TestPassword123!",
        },
    )

    assert response.status_code == 201
    assert response.json()["is_admin"] is False