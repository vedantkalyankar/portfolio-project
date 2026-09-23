from app.core.security import create_access_token, hash_password
from app.models.user import User


def create_test_user(
    db_session,
    username="dependencyuser",
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


def test_get_current_user_success(client, db_session):
    from app.api.dependencies import get_current_user

    user = create_test_user(db_session)

    token = create_access_token(str(user.id))

    credentials = type(
        "Credentials",
        (),
        {"credentials": token},
    )()

    result = get_current_user(
        credentials=credentials,
        db=db_session,
    )

    assert result.id == user.id
    assert result.username == "dependencyuser"


def test_get_current_user_invalid_token(client, db_session):
    from app.api.dependencies import get_current_user
    from fastapi import HTTPException

    credentials = type(
        "Credentials",
        (),
        {"credentials": "invalid-token"},
    )()

    try:
        get_current_user(
            credentials=credentials,
            db=db_session,
        )
        assert False, "Expected HTTPException"
    except HTTPException as exc:
        assert exc.status_code == 401


def test_require_admin_success(db_session):
    from app.api.dependencies import require_admin

    user = create_test_user(
        db_session,
        username="admin-dependency",
        is_admin=True,
    )

    result = require_admin(user)

    assert result.id == user.id


def test_require_admin_forbidden(db_session):
    from app.api.dependencies import require_admin
    from fastapi import HTTPException

    user = create_test_user(
        db_session,
        username="normal-dependency",
        is_admin=False,
    )

    try:
        require_admin(user)
        assert False, "Expected HTTPException"
    except HTTPException as exc:
        assert exc.status_code == 403
        assert exc.detail == "Admin access required"