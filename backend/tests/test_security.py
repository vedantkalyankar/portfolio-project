from app.core.security import hash_password, verify_password
from uuid import uuid4

from app.core.security import (
    create_access_token,
    decode_access_token,
    hash_password,
    verify_password,
)

def test_hash_password():
    password = "TestPassword123!"

    hashed = hash_password(password)

    assert hashed != password
    assert len(hashed) > 0


def test_verify_correct_password():
    password = "TestPassword123!"

    hashed = hash_password(password)

    assert verify_password(password, hashed) is True


def test_verify_incorrect_password():
    password = "TestPassword123!"

    hashed = hash_password(password)

    assert verify_password("WrongPassword123!", hashed) is False


def test_hash_password():
    password = "TestPassword123!"

    hashed = hash_password(password)

    assert hashed != password
    assert len(hashed) > 0


def test_verify_correct_password():
    password = "TestPassword123!"

    hashed = hash_password(password)

    assert verify_password(password, hashed) is True


def test_verify_incorrect_password():
    password = "TestPassword123!"

    hashed = hash_password(password)

    assert verify_password("WrongPassword123!", hashed) is False


def test_create_and_decode_access_token():
    user_id = str(uuid4())

    token = create_access_token(user_id)
    payload = decode_access_token(token)

    assert payload["sub"] == user_id
    assert "exp" in payload