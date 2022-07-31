from typing import Optional
from datetime import datetime as dt
from pydantic import BaseModel

class RepairBase(BaseModel):
    asset_id: str
    assigned_to: str
    repair_date: dt
    repair_price: int
    remarks: str
    


# Schema for request body
class CreateRepair(RepairBase):
    created_by: str



    