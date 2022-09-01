from typing import Optional
from datetime import datetime as dt
from pydantic import BaseModel
from typing import List, Optional

class DepartmentBase(BaseModel):
    department_name: str
    department_description: str
    department_location: str
    department_head: str
    contact_no: str
    class Config():
        orm_mode = True

# Schema for request body
class CreateDepartment(DepartmentBase):
    pass


class UpdateHospitalDepartment(BaseModel):
    department_name: Optional[str]
    department_description: Optional[str]
    department_location: Optional[str]
    department_head: Optional[str]
    contact_no: Optional[str]

class ShowDepartment(DepartmentBase):
    department_id: str
    # manager: Optional[employeeSchema.ShowEmployee]
    class Config():
        orm_mode = True

#Schema for response body
class Department(DepartmentBase):
    created_at: dt
    updated_at: dt

# Schema for response body
class User(DepartmentBase):
    created_at: dt
    updated_at: dt