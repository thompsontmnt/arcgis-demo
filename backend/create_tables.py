# Script to create all tables for the geometry app
from app.core.db import engine, Base
from app.models.geometry import Geometry

if __name__ == "__main__":
    print("Creating tables...")
    Base.metadata.create_all(bind=engine)
    print("Done.")
