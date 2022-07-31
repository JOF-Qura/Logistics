from datetime import datetime as dt
from pydantic import BaseModel
from typing import Optional
from schemas.project_management.project_schema import ShowProject
from schemas.Admin.employeeSchema import ShowEmployee

class HistoryBase(BaseModel):
    project_id: str
    employee_id: str
    subject: str
    date: dt
    remarks: str
    class Config():
        orm_mode = True

# Schema for request body
class CreateHistory(HistoryBase):
    pass

class ShowHistory(HistoryBase):
    id: str
    history_project: ShowProject
    history_employee: Optional[ShowEmployee]
    active_status: str
    created_at: dt
    class Config():
        orm_mode = True

# Schema for response body
class History(BaseModel):
    created_at: dt
    updated_at: dt