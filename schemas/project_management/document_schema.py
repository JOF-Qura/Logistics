from datetime import datetime as dt
from pydantic import BaseModel

class DocumentBase(BaseModel):
    file: str
    project_id: str
    class Config():
        orm_mode = True

# Schema for request body
class CreateDocument(DocumentBase):
    pass

class ShowDocument(DocumentBase):
    id: str
    active_status: str
    created_at: dt
    class Config():
        orm_mode = True

# Schema for response body
class Document(BaseModel):
    created_at: dt
    updated_at: dt