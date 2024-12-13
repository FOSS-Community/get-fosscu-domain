import time
from typing import Literal

from pydantic import BaseModel, Field


class HealthResponse(BaseModel):
    """Schema for successful health check response"""

    status: Literal["ok"] = "ok"
    database: Literal["connected"] = "connected"
    timestamp: float = Field(default_factory=time.time)
    db_response_time_ms: float = Field(ge=0)  # Must be greater than or equal to 0


class HealthErrorResponse(BaseModel):
    """Schema for failed health check response"""

    status: Literal["error"] = "error"
    database: Literal["disconnected"] = "disconnected"
    timestamp: float = Field(default_factory=time.time)
    error_message: str
