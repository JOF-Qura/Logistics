from fastapi import status, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime
from models import procurement as models
from fastapi import HTTPException, status
from schemas.procurement.terms_of_reference import TermsOfReference, TermsOfReferenceUpdateStatus
from random import randint

# generate random terms of reference number
def random_integer( db : Session):
    min_ = 100
    max_ = 10000
    rand = randint(min_, max_)
    while db.query(models.TermsOfReferenceProcurement).filter(models.TermsOfReferenceProcurement.tor_number == rand).limit(1).first() is not None:
        rand = randint(min_, max_)
    return rand



# get all 
def get( db : Session):
    terms_of_reference = db.query(models.TermsOfReferenceProcurement).all()
    return terms_of_reference



# get all to vendor 
def get_vendor_tor(vendor_id, db : Session):
    terms_of_reference = db.query(models.TermsOfReferenceProcurement).filter(models.TermsOfReferenceProcurement.vendor_id == vendor_id).all()
    return terms_of_reference


# get one
def get_one(id, db : Session):#
    terms_of_reference = db.query(models.TermsOfReferenceProcurement).filter(models.TermsOfReferenceProcurement.id == id).first()
    if not terms_of_reference:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f'Terms of Reference with the id of {id} is not found')
    return terms_of_reference

# delete
def delete(id,db : Session):
    purchase_request = db.query(models.TermsOfReferenceProcurement).filter(models.TermsOfReferenceProcurement.id == id)
    if not purchase_request.first():
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
        detail=f'Terms of reference with the {id} is not found')
    purchase_request.delete(synchronize_session=False)
    db.commit()
    return purchase_request

# create 
def create(request: TermsOfReference, db : Session ):#
    try:
        new_tor = models.TermsOfReferenceProcurement(
            tor_number=random_integer(db),
            background=request.background,
            objective=request.objective,
            scope_of_service=request.scope_of_service,
            qualifications=request.qualifications,
            reporting_and_working_arrangements=request.reporting_and_working_arrangements,
            tor_deliverables=request.tor_deliverables,
            tor_annex_technical_specifications=request.tor_annex_technical_specifications,
            tor_annex_key_experts=request.tor_annex_key_experts,
            tor_annex_deliverables=request.tor_annex_deliverables,
            tor_annex_terms_conditions=request.tor_annex_terms_conditions,
            status=request.status,
            project_request_id=request.project_request_id,
            vendor_id=request.vendor_id,
            prepared_by=request.prepared_by

            )  
        db.add(new_tor)
        db.commit()    
        db.refresh(new_tor)

        return new_tor
    except Exception as e:
        print(e)



# update status of terms of reference
def update_status(id, request:TermsOfReferenceUpdateStatus, db : Session ):
    request_quotation = db.query(models.TermsOfReferenceProcurement).filter(models.TermsOfReferenceProcurement.id == id)
    if not request_quotation:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
        detail=f'Terms of reference with the {id} is not found')
    request_quotation.update (
       {
        'status' : request.status,
        'approver_name' : request.approver_name,
        'approval_date' : datetime.now(),
        'reject_reason' : request.reject_reason,
       }
    )
    db.commit()
   
    return request_quotation.first()