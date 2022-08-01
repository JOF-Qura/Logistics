from pydantic import BaseModel
from typing import Optional, Text, List
from datetime import date


# from . import user



# Vendor
class VendorEvaluationResult(BaseModel):
    message: str
    purchase_order_id: str
    cost: int
    timeliness: int
    reliability: int
    quality: int
    availability: int
    reputation: int


class ShowVendorEvaluationResults(BaseModel):
    id:str
    message: Optional[str]
    purchase_order_id: str
    cost: int
    timeliness: int
    reliability: int
    quality: int
    availability: int
    reputation: int
    # u_created_by: Optional[user.ShowUser]

    class Config():
        orm_mode = True



class ShowVendorEvaluationResultsVendor(BaseModel):
    id:str
    purchase_order_id: str
    cost: int
    timeliness: int
    reliability: int
    quality: int
    availability: int
    reputation: int
 
    class Config():
        orm_mode = True




        
