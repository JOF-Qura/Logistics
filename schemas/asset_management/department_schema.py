from typing import Optional
from datetime import datetime as dt
from pydantic import BaseModel

class DepartmentBase(BaseModel):
    department_name: str

# Schema for request body
class CreateDepartment(DepartmentBase):
    pass

# Schema for response body
class User(DepartmentBase):
    created_at: dt
    updated_at: dt