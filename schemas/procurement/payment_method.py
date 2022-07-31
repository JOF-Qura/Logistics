from pydantic import BaseModel
from typing import Optional, Text, List



# PaymentMethod
class PaymentMethod(BaseModel):
    method_name: str
    description: str
    class Config():
        orm_mode = True

class ShowPaymentMethod(BaseModel):
    id: str
    method_name: str
    description: str
    
    class Config():
        orm_mode = True