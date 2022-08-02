from fastapi import status, HTTPException
from sqlalchemy.orm import Session
from .. import database, models
from app.security import oauth2

from fastapi import HTTPException, status
from app.schemas.payment_terms import PaymentTerms


# get one
def get_one(id,db : Session):
    payment_terms = db.query(models.PaymentTerms).filter(models.PaymentTerms.id == id).first()
    if not payment_terms:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f'Payment Terms with the id of {id} is not found')

    return payment_terms

# get all
def get( db : Session):
    payment_terms = db.query(models.PaymentTerms).all()
    return payment_terms

# create
def create(request: PaymentTerms, db : Session):
    new_payment_terms = models.PaymentTerms(
        method_name=request.method_name,
        description=request.description,

        )
    db.add(new_payment_terms)
    db.commit()
    db.refresh(new_payment_terms)
    return new_payment_terms


# delete
def delete(id,db : Session):
    payment_terms = db.query(models.PaymentTerms).filter(models.PaymentTerms.id == id)
    if not payment_terms.first():
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
        detail=f'Payment Terms with the {id} is not found')
    payment_terms.delete(synchronize_session=False)
    db.commit()
    return payment_terms

# update
def update(id, request: PaymentTerms, db : Session):
    payment_terms = db.query(models.PaymentTerms).filter(models.PaymentTerms.id == id)
    if not payment_terms.first():
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
        detail=f'Payment Terms with the {id} is not found')
    payment_terms.update(
       {
        'method_name' : request.method_name,
        'description' : request.description,

       }
        )
    # payment_terms.update(request)
    db.commit()
    return 'Updated Succesfully'



