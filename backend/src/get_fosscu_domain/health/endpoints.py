import time
from fastapi import APIRouter, Depends, HTTPException, status, Request
from get_fosscu_domain.rate_limiting import limiter
from get_fosscu_domain.health.schema import HealthErrorResponse, HealthResponse
from get_fosscu_domain.postgres import get_db
from sqlalchemy import text
from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError

router = APIRouter(tags=["health"])


@router.get(
    "/healthz",
    status_code=status.HTTP_200_OK,
    response_model=HealthResponse,
    responses={
        503: {"model": HealthErrorResponse, "description": "Database connection failed"}
    },
)
@limiter.limit("50/minute")
async def healthz(request: Request, db: Session = Depends(get_db)) -> HealthResponse:
    """
    Health check endpoint that verifies database connectivity.

    Returns:
        HealthResponse: Contains database response time in milliseconds

    Raises:
        HTTPException (503): When database connection fails
    """
    try:
        # Measure database response time
        start_time = time.perf_counter()  # More precise than time.time()

        # Execute a simple query to check database connectivity
        db.execute(text("SELECT 1"))
        db.commit()  # Ensure connection is properly released

        end_time = time.perf_counter()
        response_time = round((end_time - start_time) * 1000, 2)

        return HealthResponse(db_response_time_ms=response_time)

    except SQLAlchemyError as e:
        # Specifically catch database-related errors
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=HealthErrorResponse(
                error_message=f"Database connection error: {str(e)}"
            ).model_dump(),
        )
    except Exception as e:
        # Catch any other unexpected errors
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=HealthErrorResponse(
                error_message=f"Unexpected error during health check: {str(e)}"
            ).model_dump(),
        )
