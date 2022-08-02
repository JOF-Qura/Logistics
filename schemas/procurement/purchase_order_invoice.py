from datetime import date
from re import S
from pydantic import BaseModel
from typing import Optional, Text, List

from . import purchase_order



# PurchaseOrderInvoice
class PurchaseOrderInvoice(BaseModel):
    prepared_by: str
    message: str
    # invoice_date:date
    created_by:str
    due_date:date
    billing_address:str
    # amount_paid:float
    purchase_order_id:str




    class Config():
        orm_mode = True

class ShowPurchaseOrderInvoice(BaseModel):
    id: str
    prepared_by: str
    message: str
    invoice_date:date
    due_date:date
    status:str
    billing_address:str
    # amount_paid:float
    purchase_order: purchase_order.ShowPurchaseOrder
    class Config():
        orm_mode = True


class PurchaseOrderInvoiceStatus(BaseModel):
    status:str
