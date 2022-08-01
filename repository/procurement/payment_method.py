from fastapi import status, HTTPException
from sqlalchemy.orm import Session
from models import procurement as models
from fastapi import HTTPException, status
from schemas.procurement.payment_method import PaymentMethod


# get one
def get_one(id,db : Session):
    payment_method = db.query(models.PaymentMethod).filter(models.PaymentMethod.id == id).first()
    if not payment_method:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f'Payment Method with the id of {id} is not found')

    return payment_method

# get all
def get( db : Session):
    payment_method = db.query(models.PaymentMethod).all()
    return payment_method

# create
def create(request: PaymentMethod, db : Session):
    new_payment_method = models.PaymentMethod(
        method_name=request.method_name,
        description=request.description,

        )
    db.add(new_payment_method)
    db.commit()
    db.refresh(new_payment_method)
    return new_payment_method


# delete
def delete(id,db : Session):
    payment_method = db.query(models.PaymentMethod).filter(models.PaymentMethod.id == id)
    if not payment_method.first():
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
        detail=f'Payment Method with the {id} is not found')
    payment_method.delete(synchronize_session=False)
    db.commit()
    return payment_method

# update
def update(id, request: PaymentMethod, db : Session):
    payment_method = db.query(models.PaymentMethod).filter(models.PaymentMethod.id == id)
    if not payment_method.first():
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
        detail=f'Payment Method with the {id} is not found')
    payment_method.update(
       {
        'method_name' : request.method_name,
        'description' : request.description,

       }
        )
    # payment_method.update(request)
    db.commit()
    return 'Updated Succesfully'



