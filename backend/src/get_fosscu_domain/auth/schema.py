from typing import Any, Dict, Optional
from uuid import UUID

from pydantic import BaseModel


# Response Models
class TokenResponse(BaseModel):
    access_token: str
    token_type: str


class UserResponse(BaseModel):
    id: UUID
    github_id: int
    username: str
    email: Optional[str] = None
    avatar_url: str

    class Config:
        from_attributes = True


class GithubLoginResponse(BaseModel):
    url: str
