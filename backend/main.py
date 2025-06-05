from fastapi import FastAPI
from backend.core.config import settings
from backend.api.v1.api import api_router_v1

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    openapi_url="/api/v1/openapi.json" # Standardize OpenAPI doc URL
)

app.include_router(api_router_v1, prefix="/api/v1")

@app.get("/")
async def root():
    return {"message": f"Welcome to {settings.PROJECT_NAME}!"}

# To run the app (from the 'backend' directory, after activating venv):
# uvicorn main:app --reload
