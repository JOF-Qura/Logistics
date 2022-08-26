from datetime import datetime as dt
from pydantic import BaseModel

class MilestoneBase(BaseModel):
    name: str
    description: str
    date: dt
    class Config():
        orm_mode = True

# Schema for request body
class CreateMilestone(MilestoneBase):
    pass

class ShowMilestone(MilestoneBase):
    id: str
    active_status: str
    created_at: dt
    class Config():
        orm_mode = True

# Schema for response body
class Milestone(BaseModel):
    created_at: dt
    updated_at: dt