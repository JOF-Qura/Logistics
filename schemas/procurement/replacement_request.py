from datetime import date
from pydantic import BaseModel
from typing import Optional, Text, List

from . import returns


# Replacement Request
class ReplacementRequest(BaseModel):
    message: str
    # replacement_request_date: date
    expected_arrival_date: Optional[date]
    # request_type: str
    prepared_by: str
    return_id: str


# cancel resent request
class ReplacementRequestStatus(BaseModel):
    status:str
    expected_arrival_date:Optional[str]
    confirmed_by:Optional[str]
    reason:Optional[str]





class ShowReplacementRequest(BaseModel):
    id: str
    message: str
    replacement_request_date: date
    expected_arrival_date: Optional[date]
    request_type: str
    returns: returns.ShowReturns
    status:str
    prepared_by: str
  
    class Config():
        orm_mode = True