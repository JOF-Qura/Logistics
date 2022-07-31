from typing import Optional
from datetime import datetime as dt
from pydantic import BaseModel

class BrokenBase(BaseModel):
    asset_id: str
    remarks: str
    broken_date: dt


# Schema for request body
class CreateBroken(BrokenBase):
    created_by: str



    