from typing import Optional
from pydantic import BaseModel
from datetime import datetime

# Using a class for SenderType to allow for dot notation access if ever needed,
# and to group constants. Could also use Literal["user", "ai"] directly in schemas.
class SenderType:
    USER = "user"
    AI = "ai"

class ChatMessageBase(BaseModel):
    content: str

class ChatMessageCreate(ChatMessageBase):
    # User only sends content. Assistant ID will be part of the path.
    pass

class ChatMessageRead(ChatMessageBase):
    id: int
    assistant_id: int
    # session_id: Optional[str] = None # To be considered if explicit session management is added
    sender_type: str # Will be 'user' or 'ai'
    timestamp: datetime

    class Config:
        orm_mode = True # For Pydantic V1. For V2, use from_attributes = True
        # from_attributes = True # For Pydantic V2
