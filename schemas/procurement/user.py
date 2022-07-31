
from datetime import datetime
from pydantic import BaseModel
from typing import Optional, Text, List
from . import department,employee,vendor


# Users
class User(BaseModel):
    email:str
    password:str
    employee_id: Optional[str]
    vendor_id: Optional[str] 
    user_type_id: str 
    class Config():
        orm_mode = True

class UserType(BaseModel):
    name: str
    description: str


class ShowUserType(BaseModel):
    id: str
    name: str
    description: str
    created_at: datetime

    class Config():
        orm_mode = True


class ShowUser(BaseModel):
    id: str
    email:str
    password:str
    employees: Optional[employee.ShowEmployee]
    vendor: Optional[vendor.ShowVendor]
    user_types: ShowUserType 
    class Config():
        orm_mode = True