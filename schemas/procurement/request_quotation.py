from datetime import date, datetime
from pydantic import BaseModel
from typing import Optional, Text, List

from . import vendor, purchase_requisition,related_documents,rfq_vendor #terms_of_reference
from . import user

# quotation email sent
class QuotationStatus(BaseModel):
    status: Optional[str]
    po_status: Optional[str]
    class Config:
        orm_mode = True


# Request Quotation
class RequestQuotation(BaseModel):
    # vendor_id: Optional[str]
    message:str
    due_date: date
    prepared_by:str
    status: str
    quotation_code:str
    rfq_type:str
    purchase_requisition_id: str
   



class ShowRequestQuotation(BaseModel):

    id: str
    request_quotation_number:int
    message:str
    due_date: date
    created_at: datetime
    request_quotation_vendor:List[rfq_vendor.ShowRFQVendor]
    quotation_code:str
    prepared_by:str
    u_created_by: Optional[user.ShowUser]
    status: str
    # vendor_id: str
    # vendor: vendor.ShowVendor
    # workflow_approval: ShowWorkflowApproval
    purchase_requisition: purchase_requisition.ShowPurchaseRequisition
    related_documents: Optional[List[related_documents.ShowRelatedDocuments]]

    # terms_of_reference: Optional[terms_of_reference.ShowTermsOfReference]


    class Config():
        orm_mode = True


class ShowQuotationCode(BaseModel):

    quotation_code:str

    class Config():
        orm_mode = True

# for rfq
class EmailContent(BaseModel):
    subject: str
    email_message:str


class ShowRequestQuotationToVendor(BaseModel):
    id: str
    request_quotation_number:int
    message:str
    due_date: date
    created_at: datetime
    quotation_code:str
    prepared_by: str
    # has_proposal: bool
    status: str
    # vendor_id: str
    # request_quotation_vendor:rfq_vendor.ShowRFQVendor
    temp_rfq_status: Optional[str]

    related_documents: Optional[List[related_documents.ShowRelatedDocuments]]
    purchase_requisition: purchase_requisition.ShowPurchaseRequisitionToVendor


    class Config():
        orm_mode = True


class RequestQuotationStatus(BaseModel):
    status:str
    # approver_name:Optional[str]
    # approval_date:Optional[date]

    # reject_reason:Optional[str]
  
