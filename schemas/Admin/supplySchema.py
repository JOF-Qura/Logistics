from datetime import datetime as dt
from pydantic import BaseModel
from typing import List, Optional
from schemas.Admin import supply_categorySchema
from schemas.Admin import supplierSchema

#================================ Supplies Table =================================#
class SupplyBase(BaseModel):
    product_name: str
    description: str
    estimated_price: str
    status: str

    # supply_name: str
    supply_reorder_interval: str
    # supply_description: str
    supply_status: str
    # supply_unit_cost: int
    supply_unit_type: str
    supply_quantity: int
    supply_expiration: dt

    class Config():
        orm_mode = True

# Schema for request body
class CreateSupply(SupplyBase):
    # supplier_id: str
    # supply_category_id: str
    category_id: str
    pass

class UpdateSupply(BaseModel):
    product_name: Optional[str]
    description: Optional[str]
    estimated_price: Optional[str]
    status: Optional[str]

    # supply_name: Optional[str]
    supply_reorder_interval: Optional[str]
    # supply_description: Optional[str]
    # supply_unit_cost: Optional[int]
    supply_status: Optional[str]
    supply_unit_type: Optional[str]
    supply_quantity: Optional[int]
    supply_expiration: Optional[dt]

#Schema for response body
class ShowSupply(SupplyBase):
    id: Optional[str] = None
    category_id: Optional[str] = None

    # supply_id: Optional[str] = None
    # supplier_id: Optional[str] = None
    # supply_category_id: Optional[str] = None
    
    created_at: Optional[dt] = None
    updated_at: Optional[dt] = None
    
    # supply_category: Optional[supply_categorySchema.ShowSupplyCategory]
    category: Optional[supply_categorySchema.ShowSupplyCategory]
    # supply_supplier: Optional[supplierSchema.ShowSupplier]

    class Config():
        orm_mode = True

class ShowSuppliesCateg(BaseModel):
    id: str
    category_name: str
    description: str

    class Config():
        orm_mode = True

class ShowSupplies(BaseModel):
    id: str
    product_name: str
    # category: ShowSuppliesCateg
    estimated_price: Optional[str]
    description:str
    created_at: dt
    updated_at: dt
    status: str


    class Config():
        orm_mode = True