from typing import Optional
from datetime import datetime as dt
from pydantic import BaseModel

class WarrantyBase(BaseModel):
    asset_id: str
    warranty_length: int
    expiration_date: dt
    warranty_contact: str
    warranty_email: str
    warranty_note: str
    


# Schema for request body
class CreateWarranty(WarrantyBase):
    
    created_by: str
    
