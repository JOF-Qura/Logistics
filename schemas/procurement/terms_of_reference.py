
from pydantic import BaseModel
from typing import Optional, Text, List
from datetime import datetime, date, time, timedelta
from . import product,vendor,related_documents,project_request



class TermsOfReferenceUpdateStatus(BaseModel):
    status: str
    approver_name:Optional[str]
    approval_date:Optional[date]

    reject_reason:Optional[str]
  
  

class TermsOfReference(BaseModel):
    background: str
    objective: str
    scope_of_service: str
    qualifications: str
    reporting_and_working_arrangements: str
    tor_deliverables: str
    tor_annex_technical_specifications: Optional[str]
    tor_annex_key_experts: Optional[str]
    tor_annex_terms_conditions: Optional[str]
    tor_annex_deliverables: Optional[str]
    project_request_id:str
    vendor_id: str
    prepared_by: str
    status:Optional[str]

    class Config:
        orm_mode = True


class ShowTermsOfReference(BaseModel):
    id:str
    background: str
    tor_number: str
    objective: str
    scope_of_service: str
    qualifications: str
    reporting_and_working_arrangements: str
    tor_deliverables: str
    vendor_procurement:vendor.ShowVendor
    project_request_procurement:project_request.ShowProjectRequest
    project_request_id:str
    related_documents: Optional[List[related_documents.ShowRelatedDocuments]]
    tor_annex_technical_specifications: Optional[str]
    tor_annex_key_experts: Optional[str]
    tor_annex_deliverables: Optional[str]
    tor_annex_terms_conditions: Optional[str]
    prepared_by: str
    status:str
    
    class Config():
        orm_mode = True
