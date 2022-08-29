from datetime import date
from pydantic import BaseModel
from typing import Optional, Text, List



# ProjectRequest
class ProjectRequest(BaseModel):
    name: str
    background: str
    coverage:str
    type:str
    target_beneficiaries:str
    objectives:str
    expected_output:str
    assumptions:str
    constraints:str
    cost:str
    start_date:date
    end_date:date

    class Config():
        orm_mode = True

class ShowProjectRequest(BaseModel):
    id: str
    name: str
    background: str
    coverage:str
    type:str
    target_beneficiaries:str
    objectives:str
    expected_output:str
    assumptions:str
    constraints:str
    cost:str
    start_date:date
    end_date:date
    approval_status: str
    class Config():
        orm_mode = True