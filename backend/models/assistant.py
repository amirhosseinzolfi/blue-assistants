from sqlalchemy import Column, Integer, String, Text
from backend.db.session import Base

class Assistant(Base):
    __tablename__ = "assistants"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True, nullable=False)
    system_instruction = Column(Text, nullable=True)
    logo_url = Column(String, nullable=True)
    rag_source_path = Column(String, nullable=True) # Stores path or identifier for RAG data
    # Add other fields as necessary, e.g., user_id if implementing multi-tenancy
