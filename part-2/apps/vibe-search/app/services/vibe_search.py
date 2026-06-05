from typing import Any

from app.core.config import get_settings
from app.data.colors import COLORS
from app.models import VibeSearchResponse, VibeSearchResult

_model: Any | None = None
_color_embeddings: Any | None = None


def get_model() -> Any:
    global _model

    if _model is None:
        from sentence_transformers import SentenceTransformer

        _model = SentenceTransformer(get_settings().model_name)

    return _model


def get_color_embeddings() -> Any:
    global _color_embeddings

    if _color_embeddings is None:
        model = get_model()
        color_texts = [f"{color.name}. {color.description}" for color in COLORS]
        _color_embeddings = model.encode(color_texts, normalize_embeddings=True)

    return _color_embeddings


def cosine_scores(query_embedding: Any, color_embeddings: Any) -> list[float]:
    scores = color_embeddings @ query_embedding
    return [float(score) for score in scores]


def search_colors(query: str) -> VibeSearchResponse:
    model = get_model()
    query_embedding = model.encode(query, normalize_embeddings=True)
    scores = cosine_scores(query_embedding, get_color_embeddings())

    ranked = sorted(
        zip(COLORS, scores, strict=True),
        key=lambda item: item[1],
        reverse=True,
    )

    return VibeSearchResponse(
        query=query,
        model=get_settings().model_name,
        results=[
            VibeSearchResult(name=color.name, hex=color.hex, score=round(score, 4))
            for color, score in ranked[:5]
        ],
    )
