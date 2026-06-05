from fastapi import Header, HTTPException

from app.core.config import get_settings


def require_internal_api_key(
    x_internal_api_key: str | None = Header(default=None),
) -> None:
    expected_api_key = get_settings().vibe_search_api_key

    if not expected_api_key:
        raise HTTPException(status_code=500, detail="VIBE_SEARCH_API_KEY is not configured")

    if x_internal_api_key != expected_api_key:
        raise HTTPException(status_code=401, detail="Invalid API key")
