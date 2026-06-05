from pydantic import BaseModel, Field, field_validator


class Color(BaseModel):
    name: str
    hex: str
    description: str


class VibeSearchRequest(BaseModel):
    query: str = Field(min_length=1, max_length=500)

    @field_validator("query")
    @classmethod
    def query_must_have_words(cls, value: str) -> str:
        query = value.strip()
        if not query:
            raise ValueError("Query must not be empty")
        return query


class VibeSearchResult(BaseModel):
    name: str
    hex: str
    score: float


class VibeSearchResponse(BaseModel):
    query: str
    model: str
    results: list[VibeSearchResult]
