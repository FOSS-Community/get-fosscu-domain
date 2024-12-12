from fastapi import APIRouter, status, Depends, HTTPException
from fastapi.responses import RedirectResponse
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
import httpx
from get_fosscu_domain.config import get_settings
from get_fosscu_domain.models.user import User
from get_fosscu_domain.postgres import get_db
from get_fosscu_domain.auth.auth import create_access_token, get_current_user
from get_fosscu_domain.auth.schema import (
    UserResponse,
    GithubLoginResponse,
)

router = APIRouter(tags=["auth"])

# GitHub OAuth Configuration
GITHUB_CLIENT_ID = get_settings().GITHUB_CLIENT_ID
GITHUB_CLIENT_SECRET = get_settings().GITHUB_CLIENT_SECRET
GITHUB_REDIRECT_URI = "http://localhost:8000/api/v1/auth/github/callback"
FRONTEND_URL = "http://localhost:5173"


@router.get(
    "/login/github",
    response_model=GithubLoginResponse,
    status_code=status.HTTP_200_OK,
    description="Initiates GitHub OAuth flow",
)
async def github_login() -> GithubLoginResponse:
    """
    Returns the GitHub OAuth authorization URL.
    """
    return GithubLoginResponse(
        url=f"https://github.com/login/oauth/authorize?client_id={GITHUB_CLIENT_ID}&redirect_uri={GITHUB_REDIRECT_URI}"
    )


@router.get(
    "/github/callback",
    status_code=status.HTTP_302_FOUND,
    responses={
        400: {"description": "Invalid GitHub code"},
        500: {"description": "GitHub API error"},
    },
    description="Handles GitHub OAuth callback and redirects to frontend",
)
async def github_callback(code: str, db: Session = Depends(get_db)):
    """
    Handles GitHub OAuth callback:
    1. Exchanges code for access token
    2. Fetches user info from GitHub
    3. Creates/updates user in database
    4. Redirects to frontend with JWT token
    """
    try:
        # Exchange code for access token
        async with httpx.AsyncClient() as client:
            token_response = await client.post(
                "https://github.com/login/oauth/access_token",
                headers={"Accept": "application/json"},
                data={
                    "client_id": GITHUB_CLIENT_ID,
                    "client_secret": GITHUB_CLIENT_SECRET,
                    "code": code,
                    "redirect_uri": GITHUB_REDIRECT_URI,
                },
            )

            if token_response.status_code != 200:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Invalid GitHub code",
                )

            token_data = token_response.json()
            access_token = token_data.get("access_token")

            if not access_token:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="GitHub access token not received",
                )

            # Get user info from GitHub
            user_response = await client.get(
                "https://api.github.com/user",
                headers={
                    "Authorization": f"Bearer {access_token}",
                    "Accept": "application/json",
                },
            )

            if user_response.status_code != 200:
                raise HTTPException(
                    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                    detail="Failed to fetch GitHub user data",
                )

            user_data = user_response.json()

            # Create or update user in database
            user = db.query(User).filter(User.github_id == user_data["id"]).first()
            if not user:
                user = User(
                    github_id=user_data["id"],
                    email=user_data.get("email"),
                    username=user_data["login"],
                    avatar_url=user_data["avatar_url"],
                    access_token=access_token,
                )
                db.add(user)
            else:
                user.access_token = access_token
                user.avatar_url = user_data["avatar_url"]

            db.commit()

            # Create JWT token
            jwt_token = create_access_token(data={"sub": str(user.github_id)})

            # Redirect to frontend with token
            redirect_url = f"{FRONTEND_URL}/callback?token={jwt_token}"
            return RedirectResponse(url=redirect_url)

    except httpx.RequestError as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"GitHub API request failed: {str(e)}",
        )


@router.get(
    "/me",
    response_model=UserResponse,
    status_code=status.HTTP_200_OK,
    responses={401: {"description": "Not authenticated"}},
    description="Get current user profile",
)
async def read_users_me(current_user: User = Depends(get_current_user)) -> UserResponse:
    """
    Returns the profile of the currently authenticated user.
    """
    return UserResponse(
        id=current_user.id,
        github_id=current_user.github_id,
        username=current_user.username,
        email=current_user.email,
        avatar_url=current_user.avatar_url,
    )
