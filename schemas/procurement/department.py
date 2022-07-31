from pydantic import BaseModel
from typing import Optional, Text, List



# Department
class Department(BaseModel):
    department_name: str
    contact_no: str
    department_head:str
    class Config():
        orm_mode = True

class ShowDepartment(BaseModel):
    id: str
    department_name: str
    contact_no: str
    department_head:str
    class Config():
        orm_mode = True