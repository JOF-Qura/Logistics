
from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
# from repository import vendor_log_time 

from typing import List
from repository.procurement import vendor_log_time
from .. import database, models
from security import oauth2


from schemas.procurement.vendor_log_time import VendorLogTime,ShowVendorLogTime
# from schemas.procurement.user import User





router = APIRouter(
    prefix="/api/v1/vendor-time-log",
    tags=['Vendor Log Time'],
)


get_db = database.get_db



# get all
@router.get('/{start_date}/{end_date}/{vendor_id}', response_model=List[ShowVendorLogTime])#, response_model=List[ShowVendorLogTime]
def get( start_date,end_date,vendor_id,db : Session = Depends(get_db), current_vendor_log_time: User = Depends(oauth2.get_current_user)):#, current_vendor_log_time: User = Depends(oauth2.get_current_user)
    return vendor_log_time.get(start_date,end_date,vendor_id,db)

# create
@router.post('/', status_code=status.HTTP_201_CREATED)
def create(request: VendorLogTime, db : Session = Depends(get_db)):#, current_vendor_log_time: User = Depends(oauth2.get_current_user)
    return vendor_log_time.create(request, db)

# delete
@router.delete('/{id}', status_code=status.HTTP_204_NO_CONTENT)
def delete(id,db : Session = Depends(get_db), current_vendor_log_time: User = Depends(oauth2.get_current_user)):#
    return vendor_log_time.delete(id, db)

# update
# @router.put('/{id}',status_code=status.HTTP_202_ACCEPTED)
# def update(id,request: VendorLogTime, db : Session = Depends(get_db)):#, current_vendor_log_time: User = Depends(oauth2.get_current_user)
#     return vendor_log_time.update(id,request, db)

# get one
@router.get('/{id}', status_code=status.HTTP_200_OK, response_model=ShowVendorLogTime)
def get_one(id, db : Session = Depends(get_db), current_vendor_log_time: User = Depends(oauth2.get_current_user)):#, current_vendor_log_time: User = Depends(oauth2.get_current_user)
    return vendor_log_time.get_one(id, db)


