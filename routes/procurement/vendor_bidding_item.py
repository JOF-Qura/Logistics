from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from typing import List
from app.repository import vendor_bidding_item
from .. import  database, models
from app.security import oauth2
from app.schemas.vendor_proposal import VendorBiddingItems, ShowVendorBiddingItems,VendorBiddingItemsStatus
from app.schemas.user import User




router = APIRouter(
    prefix="/api/v1/bidding-item",
    tags=['Proposal Item']
)
get_db = database.get_db

# get one
@router.get('/{id}', response_model=ShowVendorBiddingItems)
def get_one(id, db : Session = Depends(get_db), current_user: User = Depends(oauth2.get_current_user)):
    return vendor_bidding_item.get_one(id,db)




# delete bidding item
@router.delete('/status/{id}', status_code=status.HTTP_202_ACCEPTED)
def delete(id,request: VendorBiddingItemsStatus,db : Session = Depends(get_db), current_user: User = Depends(oauth2.get_current_user)):
    return vendor_bidding_item.delete(id,request, db)


# update
@router.put('/{id}',status_code=status.HTTP_202_ACCEPTED)
def update(id, request: VendorBiddingItems, db : Session = Depends(get_db), current_user: User = Depends(oauth2.get_current_user)):

    return vendor_bidding_item.update(id,request, db,current_user)