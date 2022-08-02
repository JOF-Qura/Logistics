from pydantic import BaseModel
from typing import Optional, Text, List



# Related Documents
class RelatedDocuments(BaseModel):
    attachment: str
    request_quotation_id: Optional[str]
    vendor_proposal_id:Optional[str]


class ShowRelatedDocuments(BaseModel):
    id: str
    attachment:str
    request_quotation_id: Optional[str]
    vendor_proposal_id:Optional[str]
  
    class Config():
        orm_mode = True