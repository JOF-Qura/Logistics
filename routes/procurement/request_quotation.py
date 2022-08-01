from fastapi import APIRouter, Depends, status, BackgroundTasks
from sqlalchemy.orm import Session
from fastapi.responses import FileResponse

from starlette.responses import JSONResponse
from starlette.requests import Request
from fastapi_mail import FastMail, MessageSchema,ConnectionConfig


from typing import List
from repository.procurement import request_quotation
from .. import database, models
from security import oauth2


from schemas.procurement.request_quotation import EmailContent,QuotationStatus, RequestQuotationStatus,ShowRequestQuotation,RequestQuotation,ShowRequestQuotationToVendor,ShowQuotationCode

# from schemas.procurement.user import User

# from schemas.procurement.terms_of_reference import TermsOfReference



#dotenv
from dotenv import dotenv_values
# Email credentials 
credentials = dotenv_values(".env")

router = APIRouter(
    prefix="/api/v1/request-quotation",
    tags=['Request Quotation']
)
get_db = database.get_db


# Sending Email Config
# conf = ConnectionConfig(
#     MAIL_USERNAME = credentials['EMAIL'],
#     MAIL_PASSWORD = credentials['PASSWORD'],
#     MAIL_FROM = credentials['EMAIL'],
#     MAIL_PORT = 587,
#     MAIL_SERVER = "smtp.gmail.com",
#     MAIL_TLS = True,
#     MAIL_SSL = False,
#     USE_CREDENTIALS = True,
#     VALIDATE_CERTS = True,
#     TEMPLATE_FOLDER= './templates/email'

# )


# create request for quotation
@router.post('/rfq-products/', status_code=status.HTTP_201_CREATED,response_model=ShowRequestQuotation)
def create_rfq(request: RequestQuotation, db : Session = Depends(get_db),current_user: User = Depends(oauth2.get_current_user)) -> JSONResponse:#, current_user: User = Depends(oauth2.get_current_user)
    return request_quotation.create_rfq(request,db,current_user)

# get filtered request for quotation by date and status
@router.get('/filtered/rfq/reports/{start_date}/{end_date}/{rfq_status}', response_model=List[ShowRequestQuotation])
def get_filtered_rfq_reports( start_date,end_date,rfq_status,db : Session = Depends(get_db), current_user: User = Depends(oauth2.get_current_user)):

    return request_quotation.get_filtered_rfq_reports(start_date,end_date,rfq_status,db)



# get all request for quotation that equal to rfq_type
@router.get('/status/{rfq_type}', response_model=List[ShowRequestQuotation])
def get(rfq_type, db : Session = Depends(get_db), current_user: User = Depends(oauth2.get_current_user)):
    return request_quotation.get(rfq_type,db)



# delete request for quotation
@router.delete('/{id}', status_code=status.HTTP_204_NO_CONTENT)
def delete(id,db : Session = Depends(get_db), current_user: User = Depends(oauth2.get_current_user)):
    return request_quotation.delete(id, db)


# update
@router.put('/{id}',status_code=status.HTTP_202_ACCEPTED)
def update(id,request_tor: TermsOfReference, request: RequestQuotation, db : Session = Depends(get_db), current_user: User = Depends(oauth2.get_current_user)):
    return request_quotation.update(id,request_tor,request, db,current_user)

# update status of request for quotation
@router.put('/update_status/{id}',status_code=status.HTTP_202_ACCEPTED)
def update_status(id, request: RequestQuotationStatus, db : Session = Depends(get_db), current_user: User = Depends(oauth2.get_current_user)):
    return request_quotation.update_status(id,request, db,current_user)



# get one request for quotation
@router.get('/{id}', status_code=status.HTTP_200_OK, response_model=ShowRequestQuotation)#
def get_one(id, db : Session = Depends(get_db), current_user: User = Depends(oauth2.get_current_user)):
    return request_quotation.get_one(id, db)


# get all request for quotation for specific vendor
@router.get('/vendor/{vendor_id}/{rfq_type}/{rfq_status}', status_code=status.HTTP_200_OK)
def get_vendor_rfq(vendor_id,rfq_type,rfq_status, db : Session = Depends(get_db), current_user: User = Depends(oauth2.get_current_user)):
    return request_quotation.get_vendor_rfq(vendor_id,rfq_type,rfq_status, db)

# get one request for quotation for specific vendor
@router.get('/vendor/{vendor_id}/{id}', status_code=status.HTTP_200_OK,response_model=ShowRequestQuotationToVendor)
def get_one_vendor_rfq(vendor_id, id, db : Session = Depends(get_db), current_user: User = Depends(oauth2.get_current_user)):
    return request_quotation.get_one_vendor_rfq(vendor_id,id, db)



# # get request for quotation code
# @router.get('/rfq_code/', status_code=status.HTTP_200_OK, response_model=List[ShowQuotationCode])
# def get_code( db : Session = Depends(get_db), current_user: User = Depends(oauth2.get_current_user)):
#     return request_quotation.get_code( db)


# get count of request for quotation
@router.get('/charts/count')
def get_count( db : Session = Depends(get_db), current_user: User = Depends(oauth2.get_current_user)):
    return request_quotation.get_count( db)

