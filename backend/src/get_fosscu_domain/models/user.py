from sqlalchemy import Column, Integer, String, DateTime, Text
import uuid
from datetime import datetime

from get_fosscu_domain.postgres import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Text, primary_key=True, default=lambda: str(uuid.uuid4()))
    github_id = Column(Integer, unique=True, index=True)
    username = Column(String, unique=True)
    email = Column(String, nullable=True)
    avatar_url = Column(String)
    access_token = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
