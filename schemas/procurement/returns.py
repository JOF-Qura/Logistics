from datetime import date
from pydantic import BaseModel
from typing import Optional, Text, List

from . import purchase_order


# ReturnDetails
class ReturnDetails(BaseModel):
    quantity: int
    # status: str
    purchase_order_detail_id:str
    return_id:str



class ShowReturnDetails(BaseModel):
    id: str
    quantity: str
    status: str
    purchase_order_detail:purchase_order.ShowPurchaseOrderDetailReturns
    return_id:str
    class Config():
        orm_mode = True


# Returns
class Returns(BaseModel):
    return_date: date
    returner: str
    return_status:str
    return_type:str

    class Config():
        orm_mode = True

class ShowReturns(BaseModel):
    id: str
    return_date: date
    returner: str
    return_status:str
    return_type:str
    return_details: List[ShowReturnDetails]
    class Config():
        orm_mode = True