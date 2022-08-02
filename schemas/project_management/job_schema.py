from datetime import datetime as dt
from pydantic import BaseModel

class JobBase(BaseModel):
    title: str
    description: str
    class Config():
        orm_mode = True

# Schema for request body
class CreateJob(JobBase):
    pass

class ShowJob(JobBase):
    id: str
    active_status: str
    created_at: dt
    class Config():
        orm_mode = True

# Schema for response body
class Job(BaseModel):
    created_at: dt
    updated_at: dt