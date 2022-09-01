from datetime import datetime
from fastapi import status, HTTPException
from sqlalchemy.orm import Session
from models import procurement as models

from fastapi import HTTPException, status
from schemas.procurement.replacement_request import ReplacementRequest, ReplacementRequestStatus


# get one
def get_one(id,db : Session):
    replacement_request = db.query(models.ReplacementRequest).filter(models.ReplacementRequest.id == id).first()
    if not replacement_request:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f'Replacement Request with the id of {id} is not found')

    return replacement_request

# get all
def get( db : Session):
    try:
        replacement_request = db.query(models.ReplacementRequest).all()
        return replacement_request
    except Exception as e:
        print(e)
  
def get_replacement_vendor( vendor_id,db : Session):
    replacement_request = db.query(models.ReplacementRequest).filter(models.ReplacementRequest.return_id == models.ReturnProcurement.id).\
    filter(models.ReturnProcurement.id == models.ReturnDetailProcurement.return_id).filter(models.ReturnDetailProcurement.purchase_order_detail_id == models.PurchaseOrderDetail.id).\
        filter(models.PurchaseOrderDetail.purchase_order_id == models.PurchaseOrder.id).\
           filter(models.PurchaseOrder.vendor_id == vendor_id).all()
    return replacement_request

# create
def create(request: ReplacementRequest, db : Session):
    if db.query(models.ReplacementRequest).filter_by(return_id = request.return_id).count() > 0:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,detail=f'This Return is already requested to the vendor')

    new_replacement_request = models.ReplacementRequest(
        message=request.message,
        request_type ="Replace Item",
        prepared_by =request.prepared_by,
        return_id =request.return_id,
       
        replacement_request_date = datetime.now()

        )
    db.add(new_replacement_request)
    db.commit()
    db.refresh(new_replacement_request)
    # create notification
    # new_notif = models.Notification(
    # vendor_id=request.vendor_id,
    # notif_to="vendor",
    # title="Replacement Request",
    # description="You have new replacement request",

    # status="unread",
    #     )
    # db.add(new_notif)
    # db.commit()
    # db.refresh(new_notif)
    try:
        returns = db.query(models.ReturnProcurement).filter(models.ReturnProcurement.id == request.return_id)
        returns.update({'return_status': 'Requested to Vendor'})
    except Exception as e:
        print(e)

    return new_replacement_request


# delete
def delete(id,db : Session):
    replacement_request = db.query(models.ReplacementRequest).filter(models.ReplacementRequest.id == id)
    if not replacement_request.first():
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
        detail=f'Replacement Request with the {id} is not found')
    replacement_request.delete(synchronize_session=False)
    db.commit()
    return replacement_request

# update
def update(id, request: ReplacementRequestStatus, db : Session):
    replacement_request = db.query(models.ReplacementRequest).filter(models.ReplacementRequest.id == id)
    if not replacement_request.first():
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
        detail=f'Replacement Request with the {id} is not found')
    replacement_request.update(
       {
        'status':request.status,
        'expected_arrival_date':request.expected_arrival_date,
        'confirmed_by':request.confirmed_by,
        'reason' :request.reason,

       }
        )
    db.commit()
    
    # create norification
    # new_notif = models.Notification(
    # vendor_id=request.vendor_id,
    # notif_to="vendor",
    # title="Replacement Request",
    # description="You have new replacement request",

    # status="unread",
    #     )
    # db.add(new_notif)
    # db.commit()
    # db.refresh(new_notif)
    return 'Updated Succesfully'



