import time

from fastapi import APIRouter, Depends, HTTPException, status
from get_fosscu_domain.health.schema import HealthErrorResponse, HealthResponse
from get_fosscu_domain.postgres import get_db
from sqlalchemy import text
from sqlalchemy.orm import Session

router = APIRouter(tags=["health"])


@router.get(
    "/healthz",
    status_code=status.HTTP_200_OK,
    response_model=HealthResponse,
    responses={
        503: {"model": HealthErrorResponse, "description": "Database connection failed"}
    },
)
async def healthz(db: Session = Depends(get_db)) -> HealthResponse:
    """
    Health check endpoint that verifies database connectivity.
    Returns:
        200 OK: Database is connected and healthy
        503 Service Unavailable: Database connection failed
    """
    try:
        # Measure database response time
        start_time = time.time()
        db.execute(text("SELECT 1"))
        end_time = time.time()

        return HealthResponse(
            db_response_time_ms=round((end_time - start_time) * 1000, 2)
        )

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=HealthErrorResponse(error_message=str(e)).model_dump(),
        )
