from pydantic import BaseModel
from typing import Optional, Text, List
from datetime import datetime, date, time, timedelta
from . import user, product, purchase_requisition_detail





# Purchase Requisition

class PurchaseRequisition(BaseModel):
    purpose: str
    message: str
    estimated_amount:float
    status: str
    department_id: str
    date_requested: datetime
    pr_detail: List[purchase_requisition_detail.PurchaseRequisitionDetail]
    class Config:
        orm_mode = True



class ShowPurchaseRequisition(BaseModel):
    id:str
    purpose: str
    status: str
    message: str
    department_id:str
    has_rfq:Optional[bool]
    purchase_requisition_number: int
    given_budget:Optional[str]
    estimated_amount:Optional[float]
    u_created_by: user.ShowUser
    approved_by: Optional[str]

    date_requested: Optional[datetime] 
    created_at: Optional[datetime] 

    purchase_requisition_detail: List[purchase_requisition_detail.ShowPurchaseRequisitionDetail] 

    class Config():
        orm_mode = True


class ShowPurchaseRequisitionToVendor(BaseModel):
    id:str
    purchase_requisition_number: int
    given_budget:int
    date_requested: Optional[datetime] 
    purchase_requisition_detail: List[purchase_requisition_detail.ShowPurchaseRequisitionDetail] 

    class Config():
        orm_mode = True


class PurchaseRequisitionStatus(BaseModel):
    status:str
    approved_by: Optional[str]
    given_budget: Optional[float]
    # has_quotation: Optional[bool]
    reason: Optional[str]

    
    
class PrDetailID(BaseModel):
    pr_details_id: List[str]

