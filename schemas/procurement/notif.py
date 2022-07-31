from pydantic import BaseModel
from typing import Optional, Text, List
from datetime import date, datetime




class Notif(BaseModel):
    request_quotation_id:str
    vendor_id:str
    status:str
    description:str

class UpdateNotif(BaseModel):
    status:str



class ShowNotif(BaseModel):
    id:str
    request_quotation_id:Optional[str]
    vendor_proposal_id:Optional[str]
    purchase_order_id:Optional[str]
    purchase_requisition_id:Optional[str]


    vendor_id:Optional[str]
    status:str
    title:str
    description:Optional[str]
    created_at:datetime
    class Config():
        orm_mode = True