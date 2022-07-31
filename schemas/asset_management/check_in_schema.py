from typing import Optional
from datetime import datetime as dt
from pydantic import BaseModel

class CheckInBase(BaseModel):
    check_out_id: str



# Schema for request body
class CreateCheckIn(CheckInBase):
    return_location: Optional [str] = None
    return_date: dt
    remarks: Optional [str] = None