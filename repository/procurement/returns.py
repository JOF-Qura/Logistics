from fastapi import status, HTTPException
from sqlalchemy.orm import Session
# from models import procurement as models
from models.Admin.returnModel import Return as ReturnsModel

from fastapi import HTTPException, status
from schemas.procurement.returns import Returns


# get one
def get_one(id,db : Session):
    returns = db.query(ReturnsModel).filter(ReturnsModel.id == id).first()
    if not returns:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f'Returns with the id of {id} is not found')

    return returns

# get all
def get( db : Session):
    returns = db.query(ReturnsModel).all()
    return returns

# create
def create(request: Returns, db : Session):
    new_returns = ReturnsModel(
        return_date=request.return_date,
        returner=request.returner,
        return_type=request.return_type,
        return_status=request.return_status,


        )
    db.add(new_returns)
    db.commit()
    db.refresh(new_returns)
    return new_returns


# delete
def delete(id,db : Session):
    returns = db.query(ReturnsModel).filter(ReturnsModel.id == id)
    if not returns.first():
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
        detail=f'Returns with the {id} is not found')
    returns.delete(synchronize_session=False)
    db.commit()
    return returns

# update
def update(id, request: Returns, db : Session):
    returns = db.query(ReturnsModel).filter(ReturnsModel.id == id)
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



