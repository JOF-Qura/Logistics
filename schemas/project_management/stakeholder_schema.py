from datetime import datetime as dt
from pydantic import BaseModel

class StakeholderBase(BaseModel):
    name: str
    role: str
    expectation: str
    project_id: str
    class Config():
        orm_mode = True

# Schema for request body
class CreateStakeholder(StakeholderBase):
    pass

class ShowStakeholder(StakeholderBase):
    id: str
    active_status: str
    created_at: dt
    class Config():
        orm_mode = True

# Schema for response body
class Stakeholder(BaseModel):
    created_at: dt
    updated_at: dt