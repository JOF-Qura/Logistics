from pydantic import BaseModel
from typing import Optional, Text, List
from datetime import date

from . import  product


# Vendor
class Vendor(BaseModel):
    vendor_name: str
    contact_no: str
    contact_person: str
    vendor_website: str
    email: str
    region: str
    province: str
    municipality: Optional[str]
    barangay: Optional[str]
    street: str
    category_id: str
    organization_type:str
    status: Optional[str]
  

class ShowVendor(BaseModel):
    id:str
    vendor_logo:str
    vendor_name: str
    contact_no: str
    contact_person: str
    vendor_website: str
    email: str
    region: str
    province: str
    municipality: Optional[str]
    barangay: Optional[str]
    street: str
    category: product.ShowProductCateg
    organization_type:str
    status: str
    has_user: Optional[bool]
    # vendor_application_id:str
    # password:str
    class Config():
        orm_mode = True


class BlacklistVendor(BaseModel):
    vendor_name: str
    vendor_email: str
    remarks: str
    vendor_id: str



class ShowBlacklistVendor(BaseModel):
    id:str
    vendor_name: str
    contact_no: int
    contact_person: str
    vendor_website: str
    email: str
    region: str
    province: str
    municipality: str
    barangay: str
    street: str
    category: product.ShowProductCateg
    organization_type:str
    status: str
    class Config():
        orm_mode = True



class VendorStatus(BaseModel):
    status:str
        
