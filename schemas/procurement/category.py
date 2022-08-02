from pydantic import BaseModel
from typing import Optional, Text, List

from . import user,vendor


class CategoryStatus(BaseModel):
    status: str


class Category(BaseModel):
    category_name: str
    description: str


class ShowCategory(BaseModel):
    id: str
    category_name: str
    description: str
    status:str
    vendor: Optional[List[vendor.ShowVendor]]
    class Config():
        orm_mode = True


# for payload 
class ShowCategoryPayload(BaseModel):
    category_name: str
    description: str
    status:str

    class Config():
        orm_mode = True