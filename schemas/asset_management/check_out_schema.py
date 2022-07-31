from typing import Optional
from datetime import datetime as dt
from pydantic import BaseModel

class CheckOutBase(BaseModel):
    asset_id: Optional [str] = None
    user_id: Optional [str] = None
    department_id: Optional [str] = None


# Schema for request body
class CreateCheckOut(CheckOutBase):
    location: str
    check_out_date: dt
    check_out_due: Optional [dt] = None
    remarks: str