from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from typing import List
from repository.procurement import purchase_order_invoice
from database import get_db

from schemas.procurement.purchase_order_invoice import PurchaseOrderInvoice, PurchaseOrderInvoiceStatus,ShowPurchaseOrderInvoice
# from schemas.procurement.user import User


router = APIRouter(
    prefix="/api/v1/invoice",
    tags=['Purchase Order Invoice']
)



# get all
@router.get('/', response_model=List[ShowPurchaseOrderInvoice])
def get( db : Session = Depends(get_db)):#, current_user: User = Depends(oauth2.get_current_user)
    return purchase_order_invoice.get(db)

@router.get('/vendor/{vendor_id}', response_model=List[ShowPurchaseOrderInvoice])
def get_vendor_invoice(vendor_id, db : Session = Depends(get_db)):#, current_user: User = Depends(oauth2.get_current_user)
    return purchase_order_invoice.get_vendor_invoice(vendor_id,db)


# create
@router.post('/', status_code=status.HTTP_201_CREATED)
def create(request: PurchaseOrderInvoice, db : Session = Depends(get_db)):#, current_user: User = Depends(oauth2.get_current_user)
    return purchase_order_invoice.create(request, db)


# delete
@router.delete('/{id}', status_code=status.HTTP_204_NO_CONTENT)
def delete(id,request:PurchaseOrderInvoiceStatus, db : Session = Depends(get_db)):#, current_user: User = Depends(oauth2.get_current_user)
    return purchase_order_invoice.delete(id,request, db)


# update
@router.put('/{id}',status_code=status.HTTP_202_ACCEPTED)
def update(id, request: PurchaseOrderInvoice, db : Session = Depends(get_db)):#, current_user: User = Depends(oauth2.get_current_user)
    return purchase_order_invoice.update(id, request, db)


# get one
@router.get('/{id}', status_code=status.HTTP_200_OK, response_model=ShowPurchaseOrderInvoice)
def get_one(id, db : Session = Depends(get_db)):
    return purchase_order_invoice.get_one(id, db)
    