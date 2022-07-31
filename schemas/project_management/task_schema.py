from datetime import datetime as dt
from schemas.project_management.activity_schema import ShowActivity
from pydantic import BaseModel
from typing import List, Optional

from schemas.Admin.employeeSchema import ShowEmployee

class TaskBase(BaseModel):
    name: str
    description: str
    priority: str
    deadline: dt
    status: str
    remarks: Optional[str] = None
    progress_status: str
    project_id: str
    employee_id: str

# Schema for request body
class CreateTask(TaskBase):
    pass

class ShowTask(TaskBase):
    id: str
    task_activity: List[ShowActivity]
    task_employee: ShowEmployee
    active_status: str
    created_at: dt
    class Config():
        orm_mode = True

#Schema for response body
class Department(TaskBase):
    created_at: dt
    updated_at: dt