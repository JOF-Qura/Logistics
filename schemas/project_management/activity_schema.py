from datetime import datetime as dt
from os import name
from typing import List
from pydantic import BaseModel
from schemas.Admin.employeeSchema import ShowEmployee

class ActivityBase(BaseModel):
    subject: str
    remarks: str
    date: dt
    project_id: str
    task_id: str
    employee_id: str
    class Config():
        orm_mode = True

# Schema for request body
class CreateActivity(ActivityBase):
    pass

class ShowActivity(ActivityBase):
    id: str
    activity_employee: ShowEmployee
    active_status: str
    created_at: dt
    class Config():
        orm_mode = True

#Schema for response body
class Activity(ActivityBase):
    created_at: dt
    updated_at: dt