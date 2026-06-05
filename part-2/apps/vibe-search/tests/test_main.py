from __future__ import annotations

import numpy as np
from fastapi.testclient import TestClient

from app.api.dependencies import require_internal_api_key
from app.core.config import get_settings
from app.main import app
from app.services import vibe_search


class FakeModel:
    def encode(self, texts, normalize_embeddings=True):
        if isinstance(texts, str):
            if "ocean" in texts.lower() or "breeze" in texts.lower():
                return np.array([1.0, 0.0, 0.0])
            return np.array([0.0, 1.0, 0.0])

        vectors = []
        for text in texts:
            lower = text.lower()
            if "ocean blue" in lower:
                vectors.append([1.0, 0.0, 0.0])
            elif "teal" in lower:
                vectors.append([0.9, 0.1, 0.0])
            elif "sky blue" in lower:
                vectors.append([0.8, 0.2, 0.0])
            else:
                vectors.append([0.0, 1.0, 0.0])
        return np.array(vectors)


def client() -> TestClient:
    vibe_search._model = FakeModel()
    vibe_search._color_embeddings = None
    return TestClient(app)


def test_health_endpoint_returns_service_metadata():
    response = client().get("/api/health")

    assert response.status_code == 200
    assert response.json() == {"ok": True, "service": "vibe-search"}


def test_empty_query_is_rejected():
    response = client().post("/api/vibe-search", json={"query": "   "})

    assert response.status_code == 422


def test_vibe_search_returns_ranked_color_results():
    response = client().post("/api/vibe-search", json={"query": "forest trail"})

    assert response.status_code == 200
    body = response.json()

    assert body["query"] == "forest trail"
    assert body["model"] == "all-MiniLM-L6-v2"
    assert len(body["results"]) == 5
    assert all({"name", "hex", "score"} == set(result) for result in body["results"])
    assert all(isinstance(result["score"], float) for result in body["results"])


def test_ocean_breeze_ranks_blue_or_teal_near_the_top():
    response = client().post("/api/vibe-search", json={"query": "ocean breeze"})

    assert response.status_code == 200
    top_names = [result["name"] for result in response.json()["results"][:3]]
    assert "Ocean Blue" in top_names
    assert "Teal" in top_names


def test_internal_api_key_dependency_rejects_missing_or_wrong_key(monkeypatch):
    monkeypatch.setenv("VIBE_SEARCH_API_KEY", "secret-value")
    get_settings.cache_clear()

    try:
        for header in (None, "wrong-value"):
            try:
                require_internal_api_key(header)
            except Exception as exc:
                assert exc.status_code == 401
            else:
                raise AssertionError("Expected invalid API key to be rejected")
    finally:
        get_settings.cache_clear()


def test_internal_api_key_dependency_accepts_matching_key(monkeypatch):
    monkeypatch.setenv("VIBE_SEARCH_API_KEY", "secret-value")
    get_settings.cache_clear()

    try:
        assert require_internal_api_key("secret-value") is None
    finally:
        get_settings.cache_clear()
