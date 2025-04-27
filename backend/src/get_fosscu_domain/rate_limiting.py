from typing import Any, Awaitable, Callable, List, Optional, Union

from fastapi import Request, Response
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from slowapi.util import get_remote_address

limiter = Limiter(key_func=get_remote_address)


def rate_limit_exceeded_handler(
    request: Request, exc: Exception
) -> Union[Response, Awaitable[Response]]:
    if isinstance(exc, RateLimitExceeded):
        return Response(content="Rate limit exceeded", status_code=429)
    return Response(content="An error occurred", status_code=500)
