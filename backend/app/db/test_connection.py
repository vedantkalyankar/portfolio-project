from sqlalchemy import text

from app.db.session import engine


with engine.connect() as connection:
    result = connection.execute(text("SELECT current_database(), version()"))
    database, version = result.fetchone()

    print(f"Database: {database}")
    print(f"PostgreSQL: {version}")