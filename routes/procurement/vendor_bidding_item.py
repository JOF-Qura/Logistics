from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from typing import List
from repository.procurement import vendor_bidding_item
from database import get_db
from schemas.procurement.vendor_proposal import VendorBiddingItems, ShowVendorBiddingItems,VendorBiddingItemsStatus
# from schemas.procurement.user import User




router = APIRouter(
    prefix="/api/v1/bidding-item",
    tags=['Proposal Item']
)

# get one
@router.get('/{id}', response_model=ShowVendorBiddingItems)
def get_one(id, db : Session = Depends(get_db)):
    return vendor_bidding_item.get_one(id,db)




# delete bidding item
@router.delete('/status/{id}', status_code=status.HTTP_202_ACCEPTED)
def delete(id,request: VendorBiddingItemsStatus,db : Session = Depends(get_db)):
    return vendor_bidding_item.delete(id,request, db)


# update
@router.put('/{id}',status_code=status.HTTP_202_ACCEPTED)
def update(id, request: VendorBiddingItems, db : Session = Depends(get_db)):

    return vendor_bidding_item.update(id,request, db)