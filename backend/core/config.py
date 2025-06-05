import os
from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
from langchain_ollama.embeddings import OllamaEmbeddings

# Load environment variables from .env file
# This should be called early, ideally before other modules try to access os.environ
dotenv_path = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), '.env')
if os.path.exists(dotenv_path):
    load_dotenv(dotenv_path)
else:
    print("Warning: .env file not found. Please create one based on .env.example")

class Settings:
    PROJECT_NAME: str = "AI Chatbot Platform"
    VERSION: str = "0.1.0"

    # LLM Configuration
    # For ChatOpenAI with a custom base URL (like a local proxy or self-hosted)
    LLM_BASE_URL: str = os.getenv("LLM_BASE_URL", "http://141.98.210.149:15203/v1")
    LLM_MODEL_NAME: str = os.getenv("LLM_MODEL_NAME", "gpt-4o")
    LLM_API_KEY: str = os.getenv("LLM_API_KEY", "324") # Replace with your actual key or ensure it's in .env
    LLM_TEMPERATURE: float = float(os.getenv("LLM_TEMPERATURE", 0.5))

    # Embeddings Configuration
    EMBEDDINGS_MODEL: str = os.getenv("EMBEDDINGS_MODEL", "nomic-embed-text")
    OLLAMA_BASE_URL: str = os.getenv("OLLAMA_BASE_URL") # Optional: if your Ollama instance is not at default localhost

    # Database Configuration (SQLite for now)
    # Example: SQLALCHEMY_DATABASE_URL = "sqlite:///./chat_platform.db"
    # For PostgreSQL: SQLALCHEMY_DATABASE_URL = "postgresql://user:password@host:port/dbname"
    SQLALCHEMY_DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./chat_platform.db")

    # RAG Uploads directory
    RAG_UPLOAD_DIR: str = os.getenv("RAG_UPLOAD_DIR", "rag_uploads")


settings = Settings()

# --- Initialize LLM ---
llm = ChatOpenAI(
    base_url=settings.LLM_BASE_URL,
    model_name=settings.LLM_MODEL_NAME,
    temperature=settings.LLM_TEMPERATURE,
    api_key=settings.LLM_API_KEY
)

# --- Initialize Embeddings ---
# If Ollama is running on a different host/port, set OLLAMA_BASE_URL in .env
ollama_kwargs = {}
if settings.OLLAMA_BASE_URL:
    ollama_kwargs['base_url'] = settings.OLLAMA_BASE_URL

embeddings = OllamaEmbeddings(model=settings.EMBEDDINGS_MODEL, **ollama_kwargs)

# Ensure RAG upload directory exists
rag_full_path = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), settings.RAG_UPLOAD_DIR)
if not os.path.exists(rag_full_path):
    os.makedirs(rag_full_path, exist_ok=True)

if __name__ == "__main__":
    # For testing the configuration
    print(f"Project Name: {settings.PROJECT_NAME}")
    print(f"LLM Model: {settings.LLM_MODEL_NAME} at {settings.LLM_BASE_URL}")
    print(f"Embeddings Model: {settings.EMBEDDINGS_MODEL}")
    if settings.OLLAMA_BASE_URL:
        print(f"Ollama Base URL: {settings.OLLAMA_BASE_URL}")
    print(f"Database URL: {settings.SQLALCHEMY_DATABASE_URL}")
    print(f"RAG Upload Directory: {rag_full_path}")

    # Example of using the LLM (requires connection to the LLM server)
    # from langchain_core.messages import HumanMessage
    # try:
    #     print("\nTesting LLM connection...")
    #     response = llm.invoke([HumanMessage(content="Hello!")])
    #     print(f"LLM Response: {response.content[:100]}...")
    # except Exception as e:
    #     print(f"Error connecting to LLM: {e}")

    # Example of using embeddings (requires Ollama server to be running)
    # try:
    #     print("\nTesting Embeddings connection...")
    #     vector = embeddings.embed_query("Test query")
    #     print(f"Embedding vector (first 5 dims): {vector[:5]}...")
    # except Exception as e:
    #     print(f"Error with embeddings: {e}")
