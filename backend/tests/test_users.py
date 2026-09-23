from app.core.security import verify_password
from app.schemas.user import UserCreate
from app.services.user import (
    authenticate_user,
    create_user,
    get_user_by_username,
)


def test_create_user(db_session):
    user_data = UserCreate(
        username="admin",
        password="AdminPassword123!",
    )

    user = create_user(
        db_session,
        user_data,
        is_admin=True,
    )

    assert user.username == "admin"
    assert user.is_admin is True
    assert user.is_active is True
    assert user.password_hash != "AdminPassword123!"
    assert verify_password(
        "AdminPassword123!",
        user.password_hash,
    )


def test_get_user_by_username(db_session):
    user_data = UserCreate(
        username="testuser",
        password="TestPassword123!",
    )

    created_user = create_user(db_session, user_data)

    user = get_user_by_username(
        db_session,
        created_user.username,
    )

    assert user is not None
    assert user.id == created_user.id


def test_get_nonexistent_user(db_session):
    user = get_user_by_username(
        db_session,
        "does-not-exist",
    )

    assert user is None


def test_authenticate_user_success(db_session):
    user_data = UserCreate(
        username="loginuser",
        password="LoginPassword123!",
    )

    created_user = create_user(db_session, user_data)

    user = authenticate_user(
        db_session,
        created_user.username,
        "LoginPassword123!",
    )

    assert user is not None
    assert user.id == created_user.id


def test_authenticate_user_wrong_password(db_session):
    user_data = UserCreate(
        username="wrongpassword",
        password="CorrectPassword123!",
    )

    created_user = create_user(db_session, user_data)

    user = authenticate_user(
        db_session,
        created_user.username,
        "WrongPassword123!",
    )

    assert user is None


def test_authenticate_nonexistent_user(db_session):
    user = authenticate_user(
        db_session,
        "missing-user",
        "SomePassword123!",
    )

    assert user is None


def test_authenticate_inactive_user(db_session):
    user_data = UserCreate(
        username="inactiveuser",
        password="InactivePassword123!",
    )

    created_user = create_user(db_session, user_data)

    created_user.is_active = False
    db_session.commit()

    user = authenticate_user(
        db_session,
        created_user.username,
        "InactivePassword123!",
    )

    assert user is None