from pydantic import BaseModel
from typing import Optional, Text, List
# from . import user
from . import product
from ..Admin import supplySchema




# Purchase Requisition
class PurchaseRequisitionDetail(BaseModel):
    quantity: int
    product_id: Optional[str]
    supply_id: Optional[str]
    new_category: Optional[str]
    new_product_name: Optional[str]
    estimated_price: Optional[str]

    description: Optional[str]


class ShowPurchaseRequisitionDetail(BaseModel):
    id:str
    quantity: int
    product: Optional[product.ShowProduct]
    supply: Optional[supplySchema.ShowSupply]
    product_id:Optional[str]
    supply_id:Optional[str]
    new_category: Optional[str]
    new_product_name: Optional[str]
    estimated_price: Optional[str]
    status:str
    purchase_requisition_id:str
    # purchase_requisition:Optional

    description: Optional[str]
    class Config:
	    orm_mode=True


    
class PurchaseRequestItemsStatus(BaseModel):
    status: str
    estimated_amount: Optional[float]

class PurchaseRequisitionDetailStatus(BaseModel):
    status:str


    