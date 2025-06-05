from sqlalchemy.orm import Session
from backend.models.assistant import Assistant
from backend.schemas.assistant import AssistantCreate, AssistantUpdate

def get_assistant(db: Session, assistant_id: int) -> Assistant | None:
    return db.query(Assistant).filter(Assistant.id == assistant_id).first()

def get_assistants(db: Session, skip: int = 0, limit: int = 100) -> list[Assistant]:
    return db.query(Assistant).offset(skip).limit(limit).all()

def create_assistant(db: Session, assistant: AssistantCreate) -> Assistant:
    db_assistant = Assistant(
        name=assistant.name,
        system_instruction=assistant.system_instruction,
        logo_url=str(assistant.logo_url) if assistant.logo_url else None, # Ensure HttpUrl is converted to str for DB
        rag_source_path=assistant.rag_source_path
    )
    db.add(db_assistant)
    db.commit()
    db.refresh(db_assistant)
    return db_assistant

def update_assistant(db: Session, assistant_id: int, assistant_update: AssistantUpdate) -> Assistant | None:
    db_assistant = get_assistant(db, assistant_id)
    if db_assistant:
        update_data = assistant_update.model_dump(exclude_unset=True) # Pydantic v2, use .dict() for v1
        # update_data = assistant_update.dict(exclude_unset=True) # Pydantic v1

        # Ensure HttpUrl is converted to str for DB if present
        if 'logo_url' in update_data and update_data['logo_url'] is not None:
            update_data['logo_url'] = str(update_data['logo_url'])

        for key, value in update_data.items():
            setattr(db_assistant, key, value)

        db.commit()
        db.refresh(db_assistant)
    return db_assistant

def delete_assistant(db: Session, assistant_id: int) -> Assistant | None:
    db_assistant = get_assistant(db, assistant_id)
    if db_assistant:
        db.delete(db_assistant)
        db.commit()
    return db_assistant
