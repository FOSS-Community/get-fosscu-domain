from datetime import datetime

from sqlalchemy import Column, DateTime, ForeignKey, Integer, String, Text

from ..postgres import Base


class Subdomain(Base):
    __tablename__ = "subdomains"

    id = Column(Integer, primary_key=True)
    subdomain = Column(String, unique=True)
    target_domain = Column(String)
    record_type = Column(String, default="CNAME")
    ttl = Column(Integer, default=3600)
    priority = Column(Integer, nullable=True)
    user_id = Column(Text, ForeignKey("users.id"))
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
