from fastapi import APIRouter

from app.models import VibeSearchRequest, VibeSearchResponse
from app.services.vibe_search import search_colors

router = APIRouter(prefix="/api")


@router.get("/health")
def health() -> dict[str, bool | str]:
    return {"ok": True, "service": "vibe-search"}


@router.post("/vibe-search")
def vibe_search(request: VibeSearchRequest) -> VibeSearchResponse:
    return search_colors(request.query)
