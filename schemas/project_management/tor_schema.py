# from datetime import datetime as dt
# from pydantic import BaseModel
# from typing import Optional
# from schemas.project_management.project_schema import ShowProject
# from schemas.procurement.vendor import ShowVendor

# class ToRBase(BaseModel):
#     tor_number: int
#     background: str
#     objective: str
#     scope_of_service: str
#     tor_deliverables: str
#     qualifications: str
#     reporting_and_working_arrangements: str
#     tor_annex_technical_specifications: str
#     tor_annex_key_experts: str
#     # source_of_funds: str
#     tor_annex_deliverables: str
#     tor_annex_terms_conditions: str
#     status: str
#     prepared_by: str
#     approver_name: Optional[str]
#     approval_date: Optional[str]
#     reject_reason: Optional[str]
#     project_request_id: str
#     vendor_id: str
#     class Config():
#         orm_mode = True

# # Schema for request body
# class CreateToR(ToRBase):
#     pass

# class ShowToR(ToRBase):
#     id: str
#     vendor_procurement: ShowVendor
#     project_request: ShowProject
#     created_at: dt
#     class Config():
#         orm_mode = True

# # Schema for response body
# class ToR(BaseModel):
#     created_at: dt
#     updated_at: dt