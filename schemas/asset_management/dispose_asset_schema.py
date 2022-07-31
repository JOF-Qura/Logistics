from typing import Optional
from datetime import datetime as dt
from pydantic import BaseModel

class DisposeBase(BaseModel):
    asset_id: str
    remarks: str
    dispose_to: str
    dispose_date: dt


# Schema for request body
class CreateDispose(DisposeBase):
    created_by: str



    