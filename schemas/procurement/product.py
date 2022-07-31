from datetime import date
from pydantic import BaseModel
from typing import Optional, Text, List




# Product
class Product(BaseModel):
    # product_pic: str
    product_name: str
    category_id: str 
    estimated_price: str
    description:str
    is_active: Optional[bool]
    class Config():
        orm_mode = True

class ProductCateg(BaseModel):
    category_name: str
    description: str


class ShowProductCateg(BaseModel):
    id: str
    category_name: str
    description: str

    class Config():
        orm_mode = True


class ShowProduct(BaseModel):
    id: str
    product_name: str
    category: ShowProductCateg
    estimated_price: Optional[str]
    description:str
    created_at: date
    updated_at: date
    status:str


    class Config():
        orm_mode = True


class ProductStatus(BaseModel):
    status: str