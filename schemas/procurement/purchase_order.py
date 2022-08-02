from pydantic import BaseModel
from typing import Optional, Text, List


from . import vendor_proposal,vendor,payment_method,payment_terms
from datetime import date


# Purchase Order Detail
class PurchaseOrderDetail(BaseModel):
    product_name:str
    quantity: int
    product_category: str
    product_price: float
    # total_cost: str


# Purchase Order
class PurchaseOrder(BaseModel):
    vendor_proposal_id:str
    order_date: date #date
    expected_delivery_date: date #date
    notes: str
    payment_method_id: str
    payment_terms_id: str
    shipping_method: str
    subtotal:float
    tax:float
    discount:float
    total_amount:float
    status:str
    vendor_id:str
    purchase_order_detail: List[PurchaseOrderDetail]


class UpdatePurchaseOrderStatus(BaseModel):
    status: str


class ShowPurchaseOrderDetail(BaseModel):
    id: str
    product_name:str
    quantity: str
    category: str
    product_price: str

    class Config():
        orm_mode = True

class ShowPurchaseOrder(BaseModel):
    id:str
    order_date: Optional[date]
    expected_delivery_date: Optional[date]
    shipping_method: Optional[str]
    purchase_order_number:str
    payment_method: payment_method.ShowPaymentMethod
    payment_terms: payment_terms.ShowPaymentTerms

    subtotal:str
    tax:str
    discount:str
    total_amount:str
    status:str
    notes: str

    vendor:vendor.ShowVendor
    vendor_proposal: vendor_proposal.ShowVendorProposalToProcurement
    purchase_order_detail: List[ShowPurchaseOrderDetail]

    class Config():
        orm_mode = True


class ShowPurchaseOrderDetailReturns(BaseModel):
    id: str
    product_name:str
    quantity: str
    category: str
    product_price: str
    purchase_order:ShowPurchaseOrder
    class Config():
        orm_mode = True