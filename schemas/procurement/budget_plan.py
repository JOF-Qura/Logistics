from pydantic import BaseModel
from typing import Optional, Text, List
from datetime import date
# from . import department

# Budget Plan
class BudgetPlan(BaseModel):
    given_budget: str
    year: str
    date_from: date
    date_to: date
    department_id: str


class ShowBudgetPlan(BaseModel): 
    id:str
    given_budget: float
    year: str
    date_from: date
    date_to: date
    total_spent:float
    # department: department.ShowDepartment
    class Config():
        orm_mode = True

class BudgetPlanStatus(BaseModel): 
    is_active:bool


class BudgetPlanPO(BaseModel):
    total_spent: float
  