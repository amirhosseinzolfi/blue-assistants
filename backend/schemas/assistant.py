from typing import Optional
from pydantic import BaseModel, HttpUrl

class AssistantBase(BaseModel):
    name: str
    system_instruction: Optional[str] = None
    logo_url: Optional[HttpUrl] = None
    rag_source_path: Optional[str] = None # Path or identifier for RAG data

class AssistantCreate(AssistantBase):
    pass

class AssistantUpdate(BaseModel):
    name: Optional[str] = None
    system_instruction: Optional[str] = None
    logo_url: Optional[HttpUrl] = None
    rag_source_path: Optional[str] = None

class AssistantRead(AssistantBase):
    id: int

    class Config:
        orm_mode = True # Pydantic V1 way, for Pydantic V2 it's from_attributes = True
        # For Pydantic V2, use: from_attributes = True
        # Ensure your Pydantic version matches the Config setting.
        # If using Pydantic V2 and FastAPI, it usually handles this automatically.
        # For now, sticking to orm_mode for broader compatibility if Pydantic V1 is assumed by langchain/fastapi interactions.
        # Let's assume Pydantic v1 style for now, as it's common in some Langchain contexts.
        # If issues arise, this might need to be changed to from_attributes = True (Pydantic v2)
