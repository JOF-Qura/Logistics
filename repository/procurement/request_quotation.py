
from fastapi import APIRouter, Depends, status, BackgroundTasks, UploadFile
from datetime import date
from sqlalchemy.orm import Session
from app.models.rfq_vendor import RequestQuotationVendor
from .. import database, models
from fastapi import HTTPException, status
from starlette.responses import JSONResponse
from fastapi_mail import FastMail, MessageSchema,ConnectionConfig
from collections import defaultdict
from sqlalchemy import and_,or_

from app.schemas.request_quotation import EmailContent,QuotationStatus,ShowRequestQuotation,RequestQuotation,RequestQuotationStatus
from app.schemas.user import User
from app.schemas.terms_of_reference import TermsOfReference
from app.repository import purchase_requisition_detail
from datetime import datetime
from random import randint
#dotenv
from dotenv import dotenv_values
credentials = dotenv_values(".env")

# generate random request for quotation number
def random_integer( db : Session):
    min_ = 100
    max_ = 10000
    rand = randint(min_, max_)
    while db.query(models.RequestQuotation).filter(models.RequestQuotation.request_quotation_number == rand).limit(1).first() is not None:
        rand = randint(min_, max_)
    return rand


# create request for quotation
def create_rfq( request: RequestQuotation, db : Session,current_user ):#
 
    new_rq = models.RequestQuotation(
        # vendor_id=request.vendor_id,
        status=request.status,
        message=request.message,
        prepared_by = request.prepared_by,
        quotation_code = request.quotation_code,
        due_date = request.due_date,
        created_by = current_user,
        request_quotation_number = random_integer(db),
        rfq_type = request.rfq_type,
        purchase_requisition_id=request.purchase_requisition_id,
        )  
    db.add(new_rq)
    db.commit()
  
    db.refresh(new_rq)

    return new_rq

# get filtered request for quotation by date and status
def get_filtered_rfq_reports(start_date,end_date, rfq_status, db : Session):

    if(start_date != "none" and rfq_status != "none"):
        print("date, status not null")
        request_quotation = db.query(models.RequestQuotation).filter(models.RequestQuotation.created_at >= start_date+'T00:00:00').filter(models.RequestQuotation.created_at <= end_date+'T23:59:59').filter(models.RequestQuotation.status == rfq_status).order_by(models.RequestQuotation.created_at.desc()).all()
        
    elif(start_date != "none" and rfq_status == "none"):
        print("date not null, status null")
        request_quotation = db.query(models.RequestQuotation).filter(models.RequestQuotation.created_at >= start_date+'T00:00:00').filter(models.RequestQuotation.created_at <= end_date+'T23:59:59').order_by(models.RequestQuotation.created_at.desc()).all()

    elif(start_date == "none" and rfq_status != "none"):
        print("status not null, date null")
        request_quotation = db.query(models.RequestQuotation).filter(models.RequestQuotation.status == rfq_status).order_by(models.RequestQuotation.created_at.desc()).all()

    else:
        request_quotation = db.query(models.RequestQuotation).order_by(models.RequestQuotation.created_at.desc()).all()

    return request_quotation



# get all request for quotation that equal to rfq_type
def get(rfq_type, db : Session ):
    request_quotation = db.query(models.RequestQuotation).filter(models.RequestQuotation.rfq_type == rfq_type).all()
    return request_quotation




# get request for quotation code
# def get_code( db : Session ):
#     request_quotation= []
#     for value in db.query(models.RequestQuotation.quotation_code).distinct():
#         request_quotation.append(value)
#     return request_quotation



# delete request for quotation
def delete(id,db : Session ):
    request_quotation = db.query(models.RequestQuotation).filter(models.RequestQuotation.id == id)
    if not request_quotation.first():
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
        detail=f'Request Quotation with the {id} is not found')
    request_quotation.delete(synchronize_session=False)
    db.commit()
    return "Deleted Successfully"




# get one request for quotation
def get_one(id, db : Session ):
    request_quotation = db.query(models.RequestQuotation).filter(models.RequestQuotation.id == id).first()
    return request_quotation

# get all request for quotation for specific vendor
def get_vendor_rfq(vendor_id,rfq_type,rfq_status, db : Session):
    if rfq_status != "all":       
        # request_quotation = db.query(models.RequestQuotation).filter(models.RequestQuotation.vendor_id == vendor_id).filter(models.RequestQuotation.status == rfq_status).filter(models.RequestQuotation.rfq_type == rfq_type).all()
        request_quotation = db.query(models.RequestQuotation, models.RequestQuotationVendor).\
            filter(models.RequestQuotation.id == models.RequestQuotationVendor.request_quotation_id).filter(models.RequestQuotationVendor.vendor_id == vendor_id).\
            filter(models.RequestQuotationVendor.rfq_status == rfq_status).filter(models.RequestQuotation.rfq_type == rfq_type).all()
    else:
      
        request_quotation = db.query(models.RequestQuotation,models.RequestQuotationVendor).\
            filter(models.RequestQuotation.id == models.RequestQuotationVendor.request_quotation_id).\
            filter(models.RequestQuotationVendor.vendor_id == vendor_id).\
            filter(models.RequestQuotation.rfq_type == rfq_type).all()

    return request_quotation




# get one request for quotation for specific vendor
def get_one_vendor_rfq(vendor_id,id, db : Session):
    request_quotation = db.query(models.RequestQuotation,RequestQuotationVendor).\
    filter(models.RequestQuotation.id == models.RequestQuotationVendor.request_quotation_id).\
    filter(models.PurchaseRequisition.id == models.RequestQuotationVendor.rfq_pr_id).\
    filter(models.RequestQuotationVendor.vendor_id == vendor_id).filter(models.RequestQuotation.id == id).first()

    related_documents = db.query(models.RelatedDocuments).\
         filter(models.RelatedDocuments.request_quotation_id == request_quotation[0].id).all()

    request_quotation[0].temp_rfq_status = request_quotation[1].rfq_status

    return request_quotation[0]
 


# update status of request for quotation
def update_status(id, request:RequestQuotationStatus, db : Session,current_user ):
    request_quotation = db.query(models.RequestQuotation).filter(models.RequestQuotation.id == id)
    if not request_quotation:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
        detail=f'Request Quotation with the {id} is not found')
    request_quotation.update (
       {
        'status' : request.status,
        # 'approver_name' : request.approver_name,
        # 'approval_date' : datetime.now(),
        # 'reject_reason' : request.reject_reason,
       }
    )
    db.commit()
   
    return request_quotation.first()


# get count of request for quotation
def get_count( db : Session):
    request_quotation = db.query(models.RequestQuotation).count()
    return request_quotation

# update status of request for quotation
# def updateStatus(id,request:RequestQuotationStatus,db : Session,current_user ):
#     update_quotation = db.query(models.RequestQuotation).filter(models.RequestQuotation.id == id)
#     if not update_quotation.first():
#         raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
#         detail=f'Request Quotation with the {id} is not found')
#     # product.delete(synchronize_session=False)
#     update_quotation.update (
#        {
#         'status' : request.status,
     
#        }
#     )

#     db.commit()
#     return 'Update Successfully'