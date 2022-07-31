from typing import Optional
from datetime import datetime as dt
from pydantic import BaseModel

class MissingBase(BaseModel):
    asset_id: str
    remarks: str
    missing_date: dt


# Schema for request body
class CreateMissing(MissingBase):
    created_by: str



    