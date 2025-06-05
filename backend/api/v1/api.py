from fastapi import APIRouter
from backend.api.v1.endpoints import assistants

api_router_v1 = APIRouter()
api_router_v1.include_router(assistants.router, prefix="/assistants", tags=["Assistants"])

# Future routers can be added here:
# from backend.api.v1.endpoints import chat
# api_router_v1.include_router(chat.router, prefix="/chat", tags=["Chat"])
