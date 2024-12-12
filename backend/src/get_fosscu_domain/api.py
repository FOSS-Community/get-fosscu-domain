from fastapi import APIRouter
from get_fosscu_domain.health.endpoints import router as health_router
from get_fosscu_domain.auth.endpoints import router as auth_router

# from get_fosscu_domain.health import router as health_router
router = APIRouter(prefix="/api/v1")

router.include_router(health_router)
router.include_router(auth_router, prefix="/auth")
