from datetime import date
from pydantic import BaseModel
from typing import Optional, Text, List
from . import department, employee_type


# Employee
class Employee(BaseModel):
    first_name: str 
    last_name: str 
    middle_name: str 
    birthdate: date 
    contact_no: str 
    # email: str 
    address: str 
    department_id: str 
    employee_type_id: str 
    class Config():
        orm_mode = True

class ShowEmployee(BaseModel):
    id: str
    first_name: str 
    last_name: str 
    middle_name: str 
    birthdate: date 
    contact_no: str 
    # email: str 
    address: str 
    # password: str 
    department: department.ShowDepartment 
    employee_types: Optional[employee_type.ShowEmployeeType]
  
    class Config():
        orm_mode = True