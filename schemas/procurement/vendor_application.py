from pydantic import BaseModel
from typing import Optional, Text, List
from datetime import date



from . import  product



# Vendor
class VendorApplication(BaseModel):
    vendor_name: str
    contact_no: str
    contact_person: str
    vendor_website: str
    email: str
    region: str
    province: str
    municipality: str
    barangay: str
    street: str
    category_id: str
    organization_type:str
    status:Optional[str]


class VendorApplicationStatus(BaseModel):
    status:str


class ShowVendorApplication(BaseModel):
    id:str
    vendor_name: str
    contact_no: str
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
    status:str
 
    class Config():
        orm_mode = True





        
