from pydantic import BaseModel
from typing import Optional, Text, List
from datetime import date, datetime


from . import vendor


# Vendor
class VendorLogTime(BaseModel):
    logged_type: str
    client_ip: str
    vendor_id: str

class ShowVendorLogTime(BaseModel):
    id:str
    logged_date: datetime
    logged_type: str
    client_ip: str
    vendor:vendor.ShowVendor

    class Config():
        orm_mode = True



        
