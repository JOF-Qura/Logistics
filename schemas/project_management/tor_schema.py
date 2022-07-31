from datetime import datetime as dt
from pydantic import BaseModel
from schemas.project_management.project_schema import ShowProject
from schemas.project_management.vendor_schema import ShowVendor

class ToRBase(BaseModel):
    tor_number: str
    background: str
    objective: str
    scope_of_service: str
    tor_deliverables: str
    qualifications: str
    reporting_and_working_arrangements: str
    tor_annex_technical_specifications: str
    tor_annex_key_experts: str
    # source_of_funds: str
    tor_annex_deliverables: str
    tor_annex_terms_conditions: str
    prepared_by: str
    status: str
    project_id: str
    vendor_id: str
    class Config():
        orm_mode = True

# Schema for request body
class CreateToR(ToRBase):
    pass

class ShowToR(ToRBase):
    id: str
    tor_vendor: ShowVendor
    tor_project: ShowProject
    created_at: dt
    class Config():
        orm_mode = True

# Schema for response body
class ToR(BaseModel):
    created_at: dt
    updated_at: dt