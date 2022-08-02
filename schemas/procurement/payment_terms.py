from pydantic import BaseModel
from typing import Optional, Text, List



# PaymentTerms
class PaymentTerms(BaseModel):
    method_name: str
    description: str
    class Config():
        orm_mode = True

class ShowPaymentTerms(BaseModel):
    id: str
    method_name: str
    description: str

    class Config():
        orm_mode = True