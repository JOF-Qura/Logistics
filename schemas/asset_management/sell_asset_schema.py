from typing import Optional
from datetime import datetime as dt
from pydantic import BaseModel

class SellBase(BaseModel):
    asset_id: str
    sell_to: str
    sell_to_contact: str
    sell_to_email: str
    sell_date: dt
    sell_price: int
    remarks: str
    


# Schema for request body
class CreateSell(SellBase):
    created_by: str



    