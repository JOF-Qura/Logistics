
from pydantic import BaseModel
from typing import Optional, Text, List
from datetime import datetime, date, time, timedelta
from . import user






class ShowPurchaseOrder(BaseModel):
    id:Optional[str]
    created_at:Optional[date]
    expected_delivery_date:date
    status:Optional[str]

    class Config():
        orm_mode = True

class ShowVendorProposal(BaseModel):
    id:Optional[str]
    created_at:Optional[date]

    status:Optional[str]
    purchase_order: Optional[List[ShowPurchaseOrder]]

    class Config():
        orm_mode = True

class ShowRequestQuotation(BaseModel):
    id:Optional[str]
    created_at:Optional[date]
    status:Optional[str]
    vendor_proposal: Optional[List[ShowVendorProposal]]

    class Config():
        orm_mode = True

class ShowPurchaseRequisitionTimeline(BaseModel):
    id:str
    purchase_requisition_number: str
    date_requested: Optional[datetime]
    created_at: Optional[datetime]
    date_approved: Optional[date]
    approved_by: Optional[str]

    status:str
    request_quotation: List[ShowRequestQuotation]

    class Config():
        orm_mode = True