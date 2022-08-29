from fastapi import status, HTTPException
from sqlalchemy.orm import Session
from models import procurement as models

from fastapi import HTTPException, status
from schemas.procurement.returns import ReturnDetails


# get one
def get_one(id,db : Session):
    return_details = db.query(models.ReturnProcurement).filter(models.ReturnProcurement.id == id).first()
    if not return_details:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f'Returns with the id of {id} is not found')

    return return_details

# get all
def get( db : Session):
    return_details = db.query(models.ReturnProcurement).all()
    return return_details

# create
def create(request: ReturnDetails, db : Session):
    new_returns = models.ReturnDetailProcurement(
        quantity=request.quantity,
        purchase_order_detail_id=request.purchase_order_detail_id,
        return_id=request.return_id,


        )
    db.add(new_returns)
    db.commit()
    db.refresh(new_returns)
    return new_returns


# delete
def delete(id,db : Session):
    return_details = db.query(models.ReturnDetailProcurement).filter(models.ReturnDetailProcurement.id == id)
    if not return_details.first():
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
        detail=f'Returns with the {id} is not found')
    return_details.delete(synchronize_session=False)
    db.commit()
    return return_details

# update
def update(id, request: ReturnDetails, db : Session):
    returns = db.query(models.ReturnDetailProcurement).filter(models.ReturnDetailProcurement.id == id)
    if not returns.first():
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
        detail=f'Returns with the {id} is not found')
    returns.update(
       {
        'return_date' : request.return_date,
        'returner' : request.returner,
        'return_status' : request.return_status,
        'return_type' : request.return_type,


       }
        )
    # returns.update(request)
    db.commit()
    return 'Updated Succesfully'



