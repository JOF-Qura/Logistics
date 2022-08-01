from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from typing import List
from repository.procurement import payment_method
from database import get_db

from schemas.procurement.payment_method import PaymentMethod,ShowPaymentMethod


router = APIRouter(
    prefix="/api/v1/payment-method",
    tags=['Payment Method']
)


# get all
@router.get('/', response_model=List[ShowPaymentMethod])
def get( db : Session = Depends(get_db)):#
    return payment_method.get(db)


# create
@router.post('/', status_code=status.HTTP_201_CREATED)
def create(request: PaymentMethod, db : Session = Depends(get_db)):#
    return payment_method.create(request, db)


# delete
@router.delete('/{id}', status_code=status.HTTP_204_NO_CONTENT)
def delete(id,db : Session = Depends(get_db)):#
    return payment_method.delete(id, db)


# update
@router.put('/{id}',status_code=status.HTTP_202_ACCEPTED)
def update(id, request: PaymentMethod, db : Session = Depends(get_db)):#
    return payment_method.update(id, request, db)


# get one
@router.get('/{id}', status_code=status.HTTP_200_OK, response_model=ShowPaymentMethod)
def get_one(id, db : Session = Depends(get_db)):
    return payment_method.get_one(id, db)
    