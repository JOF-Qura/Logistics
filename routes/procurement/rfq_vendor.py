from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from typing import List
from repository.procurement import rfq_vendor
from .. import database
from security import oauth2

from schemas.procurement.rfq_vendor import RFQVendor, RFQVendorStatus,ShowRFQVendor
# from schemas.procurement.user import User


router = APIRouter(
    prefix="/api/v1/rfq-vendor",
    tags=['RFQVENDOR']
)
get_db = database.get_db


# get all
@router.get('/{vendor_id}/{pr_id}', response_model=List[ShowRFQVendor])
def get(vendor_id,pr_id, db : Session = Depends(get_db),current_user: User = Depends(oauth2.get_current_user)):#, current_user: User = Depends(oauth2.get_current_user)
    return rfq_vendor.get(vendor_id, pr_id,db)


# create
@router.post('/', status_code=status.HTTP_201_CREATED)
def create(request: RFQVendor, db : Session = Depends(get_db)):#, current_user: User = Depends(oauth2.get_current_user)
    return rfq_vendor.create(request, db)


# delete
@router.delete('/{rfq_id}/{vendor_id}', status_code=status.HTTP_204_NO_CONTENT)
def delete(rfq_id,vendor_id,db : Session = Depends(get_db),current_user: User = Depends(oauth2.get_current_user)):#, current_user: User = Depends(oauth2.get_current_user)
    return rfq_vendor.delete(rfq_id,vendor_id, db)


# update
@router.put('/{rfq_id}/{vendor_id}',status_code=status.HTTP_202_ACCEPTED)
def update(rfq_id,vendor_id, request: RFQVendorStatus, db : Session = Depends(get_db),current_user: User = Depends(oauth2.get_current_user)):#, current_user: User = Depends(oauth2.get_current_user)
    return rfq_vendor.update(rfq_id,vendor_id, request, db)


# get one
@router.get('/{rfq_id}/{vendor_id}')
def get_one(rfq_id,vendor_id, db : Session = Depends(get_db), current_user: User = Depends(oauth2.get_current_user)):
    return rfq_vendor.get_one(rfq_id, vendor_id,db)
    

# get_request_quotations_count
@router.get('/count/request-quotations/{vendor_id}', status_code=status.HTTP_200_OK)
def get_request_quotations_count(vendor_id,db : Session = Depends(get_db), current_user: User = Depends(oauth2.get_current_user)):
    return rfq_vendor.get_request_quotations_count(vendor_id,db)
