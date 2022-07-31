from datetime import datetime as dt
from pydantic import BaseModel

class VendorBase(BaseModel):
    vendor_name: str
    contact_person: str
    contact_no: str
    vendor_website: str
    email: str
    organization_type: str
    class Config():
        orm_mode = True

# Schema for request body
class CreateVendor(VendorBase):
    pass

class ShowVendor(VendorBase):
    id: str
    created_at: dt
    class Config():
        orm_mode = True

# Schema for response body
class Vendor(BaseModel):
    created_at: dt
    updated_at: dt