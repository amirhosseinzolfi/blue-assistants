from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from backend.db.session import get_db
from backend.schemas.assistant import AssistantCreate, AssistantRead, AssistantUpdate
from backend.crud import crud_assistant

router = APIRouter()

@router.post("/", response_model=AssistantRead, status_code=status.HTTP_201_CREATED)
def create_new_assistant(
    assistant_in: AssistantCreate,
    db: Session = Depends(get_db)
):
    '''\
    Create a new assistant.
    - **rag_source_path**: Stores a path or identifier for the RAG data source.
                         Actual file upload and processing will be handled separately.
    '''
    return crud_assistant.create_assistant(db=db, assistant=assistant_in)

@router.get("/{assistant_id}", response_model=AssistantRead)
def read_assistant_by_id(
    assistant_id: int,
    db: Session = Depends(get_db)
):
    '''
    Get a specific assistant by its ID.
    '''
    db_assistant = crud_assistant.get_assistant(db, assistant_id=assistant_id)
    if db_assistant is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Assistant not found")
    return db_assistant

@router.get("/", response_model=List[AssistantRead])
def read_all_assistants(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    '''
    Retrieve all assistants with pagination.
    '''
    assistants = crud_assistant.get_assistants(db, skip=skip, limit=limit)
    return assistants

@router.put("/{assistant_id}", response_model=AssistantRead)
def update_existing_assistant(
    assistant_id: int,
    assistant_in: AssistantUpdate,
    db: Session = Depends(get_db)
):
    '''\
    Update an existing assistant.
    - **rag_source_path**: Stores a path or identifier for the RAG data source.
                         Actual file upload and processing will be handled separately.
    '''
    db_assistant = crud_assistant.get_assistant(db, assistant_id=assistant_id)
    if db_assistant is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Assistant not found")
    updated_assistant = crud_assistant.update_assistant(db=db, assistant_id=assistant_id, assistant_update=assistant_in)
    return updated_assistant

@router.delete("/{assistant_id}", response_model=AssistantRead) # Or just status_code=204 if no content on delete
def delete_existing_assistant(
    assistant_id: int,
    db: Session = Depends(get_db)
):
    '''
    Delete an existing assistant.
    '''
    db_assistant = crud_assistant.get_assistant(db, assistant_id=assistant_id)
    if db_assistant is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Assistant not found")
    deleted_assistant = crud_assistant.delete_assistant(db=db, assistant_id=assistant_id)
    return deleted_assistant # Returns the deleted object, useful for confirmation
