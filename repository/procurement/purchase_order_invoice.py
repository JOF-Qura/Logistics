from datetime import datetime
from fastapi import status, HTTPException
from sqlalchemy.orm import Session
import models.procurement as models
# from security import oauth2

from fastapi import HTTPException, status
from schemas.procurement.purchase_order_invoice import PurchaseOrderInvoice, PurchaseOrderInvoiceStatus


# get one
def get_one(id,db : Session):
    invoice = db.query(models.PurchaseOrderInvoice).filter(models.PurchaseOrderInvoice.id == id).first()
    if not invoice:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f'PurchaseOrderInvoice with the id of {id} is not found')

    return invoice

# get all
def get( db : Session):
    invoice = db.query(models.PurchaseOrderInvoice).all()
    return invoice

# get all invoices of specific vendor
def get_vendor_invoice(vendor_id, db : Session):
    invoice = db.query(models.PurchaseOrderInvoice).filter(models.PurchaseOrderInvoice.created_by == vendor_id).all()
    return invoice

# create
def create(request: PurchaseOrderInvoice, db : Session,current_user):
    try:
        new_invoice = models.PurchaseOrderInvoice(
            prepared_by=request.prepared_by,
            message=request.message,
            invoice_date =datetime.now(),
            due_date =request.due_date,
            created_by =request.created_by,
            billing_address =request.billing_address,
            purchase_order_id =request.purchase_order_id,
            )
        db.add(new_invoice)
        db.commit()
        db.refresh(new_invoice)
    except:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,detail=f'You have already created an invoice for this purchase order')
    return new_invoice


# delete
def delete(id,request:PurchaseOrderInvoiceStatus,db : Session):
    invoice = db.query(models.PurchaseOrderInvoice).filter(models.PurchaseOrderInvoice.id == id)
    if not invoice.first():
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
        detail=f'PurchaseOrderInvoice with the {id} is not found')
    invoice.update({'status':request.status})
    db.commit()
    return "Deleted Successfully"

# update
def update(id, request: PurchaseOrderInvoice, db : Session):
    invoice = db.query(models.PurchaseOrderInvoice).filter(models.PurchaseOrderInvoice.id == id)
    if not invoice.first():
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
        detail=f'PurchaseOrderInvoice with the {id} is not found')
    invoice.update(
       {
          'prepared_by':request.prepared_by,
        'message':request.message,
        # 'invoice_date' :request.invoice_date,
        'due_date' :request.due_date,
        'billing_address' :request.billing_address,
        'purchase_order_id' :request.purchase_order_id,
       }
        )
    # invoice.update(request)
    db.commit()
    return 'Updated Succesfully'



