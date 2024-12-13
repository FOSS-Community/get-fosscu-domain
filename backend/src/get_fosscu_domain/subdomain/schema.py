import re
from datetime import datetime
from typing import Optional

from pydantic import BaseModel, validator


class SubdomainCreate(BaseModel):
    subdomain: str
    target_domain: str
    record_type: str = "CNAME"  # Default to CNAME if not specified
    ttl: int = 3600  # Default TTL
    priority: Optional[int] = None  # For MX records

    @validator("subdomain")
    def validate_subdomain(cls, v):
        # Check if subdomain contains only allowed characters
        if not re.match("^[a-zA-Z0-9-]+$", v):
            raise ValueError("Subdomain can only contain letters, numbers, and hyphens")

        # Check length constraints
        if len(v) < 3 or len(v) > 63:
            raise ValueError("Subdomain must be between 3 and 63 characters")

        return v.lower()

    @validator("record_type")
    def validate_record_type(cls, v):
        allowed_types = {"A", "AAAA", "CNAME", "MX", "TXT", "NS"}
        if v.upper() not in allowed_types:
            raise ValueError(f"Record type must be one of: {', '.join(allowed_types)}")
        return v.upper()

    @validator("priority")
    def validate_priority(cls, v, values):
        if v is not None and values.get("record_type") != "MX":
            raise ValueError("Priority can only be set for MX records")
        if v is not None and (v < 0 or v > 65535):
            raise ValueError("Priority must be between 0 and 65535")
        return v


class SubdomainResponse(BaseModel):
    id: int
    subdomain: str
    target_domain: str
    record_type: str
    ttl: int
    priority: Optional[int]
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True
