from datetime import datetime as dt
from pydantic import BaseModel
from schemas.project_management.project_schema import ShowProject
from schemas.project_management.task_schema import ShowTask

class QuotationBase(BaseModel):
    project_id: str
    task_id: str
    name: str
    description: str
    quantity: int
    price: int
    total: int
    class Config():
        orm_mode = True

# Schema for request body
class CreateQuotation(QuotationBase):
    pass

class ShowQuotation(QuotationBase):
    id: str
    quotation_project: ShowProject
    quotation_task: ShowTask
    active_status: str
    created_at: dt
    class Config():
        orm_mode = True

# Schema for response body
class Quotation(BaseModel):
    created_at: dt
    updated_at: dt