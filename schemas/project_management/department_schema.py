from datetime import datetime as dt
from os import name
from pydantic import BaseModel

class DepartmentBase(BaseModel):
    name: str
    description: str
    location: str
    class Config():
        orm_mode = True

# Schema for request body
class CreateDepartment(DepartmentBase):
    pass

class ShowDepartment(DepartmentBase):
    id: str
    class Config():
        orm_mode = True

#Schema for response body
class Department(DepartmentBase):
    created_at: dt
    updated_at: dt