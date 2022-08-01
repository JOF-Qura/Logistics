from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from typing import List
from repository.procurement import payment_terms
from database import get_db

from schemas.procurement.payment_terms import PaymentTerms,ShowPaymentTerms


router = APIRouter(
    prefix="/api/v1/payment-terms",
    tags=['Payment Terms']
)


# get all
@router.get('/', response_model=List[ShowPaymentTerms])
def get( db : Session = Depends(get_db)):#
    return payment_terms.get(db)


# create
@router.post('/', status_code=status.HTTP_201_CREATED)
def create(request: PaymentTerms, db : Session = Depends(get_db)):#
    return payment_terms.create(request, db)


# delete
@router.delete('/{id}', status_code=status.HTTP_204_NO_CONTENT)
def delete(id,db : Session = Depends(get_db)):#
    return payment_terms.delete(id, db)


# update
@router.put('/{id}',status_code=status.HTTP_202_ACCEPTED)
def update(id, request: PaymentTerms, db : Session = Depends(get_db)):#
    return payment_terms.update(id, request, db)


# get one
@router.get('/{id}', status_code=status.HTTP_200_OK, response_model=ShowPaymentTerms)
def get_one(id, db : Session = Depends(get_db)):
    return payment_terms.get_one(id, db)
    