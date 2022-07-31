from pydantic import BaseModel
from typing import Optional, Text, List
from datetime import date
from sqlalchemy.sql.sqltypes import Date
from . import category, request_quotation, vendor,related_documents,user


        

# Vendor Proposal

class VendorBiddingItems(BaseModel):
    product_name:str
    category_id:str
    description: str
    quantity: int
    price_per_unit:float
    # total: int
    
class VendorBiddingItemsStatus(BaseModel):
    status: str
    


class VendorProposal(BaseModel):
    request_quotation_id:str
    subtotal: str
    discount:str
    tax:str
    total_amount:int
    arrival_date: date
    message: Optional[str]
    prepared_by: str
    contact_no: str
    status:str
    notes:str
    vendor_bidding_item: List[VendorBiddingItems]


    class Config:
        orm_mode = True



class ShowVendorBiddingItems(BaseModel):
    id:str
    product_name:str
    category: category.ShowCategory
    description:str
    quantity: int
    price_per_unit:float
    status:str

    class Config:
	    orm_mode=True

class ShowVendorProposal(BaseModel):
    id:str
    subtotal: float
    notes:str
    discount:float
    tax:float
    created_at: date
    status: str
    total_amount:float #total_amount
    request_quotation_id:str
    request_quotation: request_quotation.ShowRequestQuotationToVendor
    related_documents: Optional[List[related_documents.ShowRelatedDocuments]]
    u_created_by: user.ShowUser
    message: Optional[str]
    created_by: str
    prepared_by: str
    contact_no: str
    arrival_date:date
    is_ordered:bool

    vendor_bidding_item: List[ShowVendorBiddingItems] = []

    class Config():
        orm_mode = True


class VendorProposalStatus(BaseModel):
    status:str
 

class AwardVendor(BaseModel):
    status:str
    subtotal: float
    tax: float
    total_amount: float


class BiddingItemID(BaseModel):
    bidding_items_id: List[str]



# FOR AUDIT TRAIL PAYLOAD

class ShowVendorBiddingItemsPayload(BaseModel):
    product_name:str
    category: category.ShowCategoryPayload
    description:str
    quantity: int
    price_per_unit:float
    status:str
    class Config:
	    orm_mode=True

class ShowVendorProposalPayload(BaseModel):
    id: str
    subtotal: float
    notes:str
    discount:float
    tax:float
    created_at: date
    status: str
    total_amount:float 
    message: Optional[str]
    prepared_by: str
    contact_no: str
    arrival_date:date
    vendor_bidding_item: List[ShowVendorBiddingItemsPayload] = []

    # user: List[User] =[]
    class Config():
        orm_mode = True


class ShowVendorProposalToProcurement(BaseModel):
    id:str
    subtotal: float
    notes:str
    discount:float
    tax:float
    created_at: date
    status: str
    total_amount:float #total_amount
    request_quotation_id:str
    request_quotation: request_quotation.ShowRequestQuotation
    message: Optional[str]
    created_by: str
    prepared_by: str
    contact_no: str
    arrival_date:date
    is_ordered:bool
    vendor_bidding_item: List[ShowVendorBiddingItems] = []

    # user: List[User] =[]
    class Config():
        orm_mode = True