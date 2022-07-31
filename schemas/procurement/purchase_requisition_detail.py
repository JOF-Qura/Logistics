from pydantic import BaseModel
from typing import Optional, Text, List
from . import user
from . import product




# Purchase Requisition
class PurchaseRequisitionDetail(BaseModel):
    quantity: int
    product_id: Optional[str]
    new_category: Optional[str]
    new_product_name: Optional[str]
    estimated_price: Optional[str]

    description: Optional[str]


class ShowPurchaseRequisitionDetail(BaseModel):
    id:str
    quantity: int
    product: Optional[product.ShowProduct]
    product_id:Optional[str]
    new_category: Optional[str]
    new_product_name: Optional[str]
    estimated_price: Optional[str]
    status:str

    description: Optional[str]
    class Config:
	    orm_mode=True


    
class PurchaseRequestItemsStatus(BaseModel):
    status: str
    estimated_amount: Optional[float]
    