from pydantic import BaseModel
from typing import Optional, Text, List



# EmployeeType
class EmployeeType(BaseModel):
    name: str
    description: str
    class Config():
        orm_mode = True

class ShowEmployeeType(BaseModel):
    id: str
    name: str
    description: str

    class Config():
        orm_mode = True