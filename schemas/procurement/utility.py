from datetime import date
from pydantic import BaseModel
from typing import Optional, Text, List

from . import vendor


# Utilities
class Utilities(BaseModel):
    utility_type: str
    attachment: str
    utility_amount:str
    due_date:date
    notes:str
    vendor_id:str


    class Config():
        orm_mode = True

class ShowUtilities(BaseModel):
    id:str
    utility_type: str
    attachment: str
    utility_amount:str
    due_date:date
    notes:str
    status:str
    vendor_procurement:vendor.ShowVendor
    class Config():
        orm_mode = True