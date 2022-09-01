from datetime import datetime as dt
from pydantic import BaseModel
from typing import Optional, List
from schemas.project_management.budget_requirements_schema import ShowBudgetRequirements
from schemas.asset_management.department_schema import ShowDepartment
from schemas.Admin.employeeSchema import ShowEmployee

class ConceptPaperBase(BaseModel):
    name: str
    background: str
    coverage: str
    assumptions: str
    constraints: str
    target_beneficiaries: str
    objectives: str
    expected_output: str
    type: str
    cost: float
    remarks: Optional[str]
    start_date: dt
    end_date: dt
    manager_id: str
    department_id: str
    approval_status: Optional[str]
    notification: Optional[str]
    class Config():
        orm_mode = True

# Schema for request body
class CreateConceptPaper(ConceptPaperBase):
    pass

class ShowConceptPaper(ConceptPaperBase):
    id: str
    concept_employee: ShowEmployee
    concept_department: ShowDepartment
    concept_budget: List[ShowBudgetRequirements]
    active_status: str
    created_at: dt
    class Config():
        orm_mode = True

# Schema for response body
class ConceptPaper(BaseModel):
    created_at: dt
    updated_at: dt