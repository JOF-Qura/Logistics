
from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
# from repository import vendor_audit_trail 

from typing import List
from repository.procurement import vendor_audit_trail
from database import get_db


from schemas.procurement.vendor_audit_trail import VendorAuditTrail,ShowVendorAuditTrail
# from schemas.procurement.user import User





router = APIRouter(
    prefix="/api/v1/vendor-audit-trail",
    tags=['Vendor Audit Trail'],
)





# get all
@router.get('/{start_date}/{end_date}/{vendor_id}', response_model=List[ShowVendorAuditTrail])#, response_model=List[ShowVendorAuditTrail]
def get(start_date,end_date,vendor_id, db : Session = Depends(get_db)):#
    return vendor_audit_trail.get(start_date,end_date,vendor_id,db)

# create
@router.post('/', status_code=status.HTTP_201_CREATED)
def create(request: VendorAuditTrail, db : Session = Depends(get_db)):#
    return vendor_audit_trail.create(request, db)

# delete
@router.delete('/{id}', status_code=status.HTTP_204_NO_CONTENT)
def delete(id,db : Session = Depends(get_db)):#
    return vendor_audit_trail.delete(id, db)

# update
# @router.put('/{id}',status_code=status.HTTP_202_ACCEPTED)
# def update(id,request: VendorAuditTrail, db : Session = Depends(get_db)):#
#     return vendor_audit_trail.update(id,request, db)

# get one
@router.get('/{id}', status_code=status.HTTP_200_OK, response_model=ShowVendorAuditTrail)
def get_one(id, db : Session = Depends(get_db)):#
    return vendor_audit_trail.get_one(id, db)


