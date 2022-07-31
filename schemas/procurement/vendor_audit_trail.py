from pydantic import BaseModel
from typing import Optional, Text, List
from datetime import date, datetime


from . import vendor


# Vendor
class VendorAuditTrail(BaseModel):
    crud: str
    client_ip: Optional[str]
    table: str
    payload: Optional[str]
    vendor_id: str



class ShowVendorAuditTrail(BaseModel):
    id:str
    crud: str
    client_ip: str
    table: str
    payload: str
    vendor:vendor.ShowVendor
    class Config():
        orm_mode = True



        
