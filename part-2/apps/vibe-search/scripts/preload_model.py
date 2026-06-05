from sentence_transformers import SentenceTransformer

MODEL_NAME = "all-MiniLM-L6-v2"


def main() -> None:
    model = SentenceTransformer(MODEL_NAME)
    dimension = model.get_embedding_dimension()
    print(f"Loaded model ({dimension}d embeddings)")


if __name__ == "__main__":
    main()
