import logging
from logging.config import dictConfig

from fastapi import FastAPI, HTTPException, Request, Response
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from .api import router
from .logging import LogConfig
from .postgres import Base, engine
from .rate_limiting import (RateLimitExceeded, limiter,
                            rate_limit_exceeded_handler)

dictConfig(LogConfig())
logger = logging.getLogger("get_fosscu_domain")


origins = ["*"]


def configure_cors(app: FastAPI) -> None:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )


def create_app() -> FastAPI:
    app = FastAPI(title="get_fosscu_domain")
    # app = FastAPI(title="get_fosscu_domain", docs_url=None, redoc_url="/docs")
    configure_cors(app=app)

    app.include_router(router=router)

    # Base.metadata.create_all(bind=engine)

    @app.exception_handler(HTTPException)
    async def http_exception_handler(request: Request, exc: HTTPException):
        return JSONResponse(status_code=exc.status_code, content={"detail": exc.detail})

    return app


logger.info("Starting get_fosscu_domain API server")
app = create_app()

app.state.limiter = limiter

app.add_exception_handler(RateLimitExceeded, rate_limit_exceeded_handler)
