from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from typing import List
from repository.procurement import payment_terms
from .. import database
from security import oauth2

from schemas.procurement.payment_terms import PaymentTerms,ShowPaymentTerms
from schemas.procurement.user import User


router = APIRouter(
    prefix="/api/v1/payment-terms",
    tags=['Payment Terms']
)
get_db = database.get_db


# get all
@router.get('/', response_model=List[ShowPaymentTerms])
def get( db : Session = Depends(get_db),current_user: User = Depends(oauth2.get_current_user)):#, current_user: User = Depends(oauth2.get_current_user)
    return payment_terms.get(db)


# create
@router.post('/', status_code=status.HTTP_201_CREATED)
def create(request: PaymentTerms, db : Session = Depends(get_db)):#, current_user: User = Depends(oauth2.get_current_user)
    return payment_terms.create(request, db)


# delete
@router.delete('/{id}', status_code=status.HTTP_204_NO_CONTENT)
def delete(id,db : Session = Depends(get_db),current_user: User = Depends(oauth2.get_current_user)):#, current_user: User = Depends(oauth2.get_current_user)
    return payment_terms.delete(id, db)


# update
@router.put('/{id}',status_code=status.HTTP_202_ACCEPTED)
def update(id, request: PaymentTerms, db : Session = Depends(get_db),current_user: User = Depends(oauth2.get_current_user)):#, current_user: User = Depends(oauth2.get_current_user)
    return payment_terms.update(id, request, db)


# get one
@router.get('/{id}', status_code=status.HTTP_200_OK, response_model=ShowPaymentTerms)
def get_one(id, db : Session = Depends(get_db), current_user: User = Depends(oauth2.get_current_user)):
    return payment_terms.get_one(id, db)
    