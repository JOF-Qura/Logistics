from datetime import datetime as dt
from pydantic import BaseModel
from typing import Optional

class BudgetRequirementsBase(BaseModel):
    name: str
    description: str
    cost: int
    project_id: Optional[str]
    concept_paper_id: Optional[str]
    class Config():
        orm_mode = True

# Schema for request body
class CreateBudgetRequirements(BudgetRequirementsBase):
    pass

class ShowBudgetRequirements(BudgetRequirementsBase):
    id: str
    active_status: str
    created_at: dt
    class Config():
        orm_mode = True

# Schema for response body
class BudgetRequirements(BaseModel):
    created_at: dt
    updated_at: dt