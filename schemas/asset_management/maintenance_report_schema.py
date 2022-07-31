from typing import Optional
from datetime import datetime as dt
from pydantic import BaseModel

class ReportBase(BaseModel):
    maintenance_id: str
    maintenance_cost: int
    completed_date: dt
    remarks: str


# Schema for request body
class CreateReport(ReportBase):
    pass