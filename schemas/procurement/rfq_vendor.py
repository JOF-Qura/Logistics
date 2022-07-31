from datetime import date
from pydantic import BaseModel
from typing import Optional, Text, List


from . import vendor


# RFQVendor
class RFQVendor(BaseModel):
    rfq_pr_id: Optional[str]
    # rfq_tor_id: Optional[str]
   
    request_quotation_id: str
    vendor_id:str


    class Config():
        orm_mode = True

class RFQVendorStatus(BaseModel):
    rfq_status: str

    approver_name:Optional[str]
    approval_date:Optional[date]

    reject_reason:Optional[str]
  

class ShowRFQVendor(BaseModel):
    # purchase_requisition_id: Optional[str]
    # terms_of_reference_id: Optional[str]
    # request_quotation: Optional[request_quotation.ShowRequestQuotation]
    # vendor_id:str
    rfq_status:str
    vendor:vendor.ShowVendor
    class Config():
        orm_mode = True