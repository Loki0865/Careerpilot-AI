import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session
from .models import Base, User

# Resolve database file path relative to database directory
DB_DIR = os.path.dirname(os.path.abspath(__file__))
DB_FILE = os.path.join(DB_DIR, "careerpilot.db")
DATABASE_URL = f"sqlite:///{DB_FILE}"

engine = create_engine(
    DATABASE_URL, 
    connect_args={"check_same_thread": False} # Required for SQLite multi-threading in FastAPI
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def init_db():
    """
    Initializes the database, creating all tables and seeding a default user if empty.
    """
    Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    try:
        if db.query(User).count() == 0:
            default_user = User(
                username="guest_user",
                email="guest@careerpilot.ai"
            )
            db.add(default_user)
            db.commit()
            print("Database initialized and seeded with default guest user.")
    except Exception as e:
        print(f"Error during db initialization: {e}")
    finally:
        db.close()

def get_db():
    """
    FastAPI dependency for generating local database sessions.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
