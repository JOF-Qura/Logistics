from datetime import datetime as dt
from schemas.project_management.document_schema import ShowDocument
from schemas.Admin.employeeSchema import ShowEmployee
from pydantic import BaseModel
from typing import Optional, List
from schemas.project_management.department_schema import ShowDepartment
from schemas.project_management.activity_schema import ShowActivity
from schemas.project_management.milestone_schema import ShowMilestone
from schemas.project_management.budget_requirements_schema import ShowBudgetRequirements
from schemas.project_management.stakeholder_schema import ShowStakeholder
from schemas.project_management.task_schema import ShowTask

class ProjectBase(BaseModel):
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
    progress_status: Optional[str]
    concept_paper_id: Optional[str]
    notification: Optional[str]
    class Config():
        orm_mode = True

# Schema for request body
class CreateProject(ProjectBase):
    pass

class ShowProject(ProjectBase):
    id: str
    project_department: ShowDepartment
    project_user: ShowEmployee
    project_document: List[ShowDocument]
    project_task: List[ShowTask]
    project_activity: List[ShowActivity]
    project_budget: List[ShowBudgetRequirements]
    project_stakeholder: List[ShowStakeholder]
    project_milestone: List[ShowMilestone]
    active_status: str
    created_at: dt
    class Config():
        orm_mode = True

class AdminCreateProject(BaseModel):
    name: str
    description: str
    type: str
    cost: int
    start_date: dt
    end_date: dt
    manager_id: str
    department_id: str

# Schema for response body
class Project(BaseModel):
    created_at: dt
    updated_at: dt