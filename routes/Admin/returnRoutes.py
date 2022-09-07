from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from typing import List
from repository.procurement import returns
from database import get_db

from schemas.procurement.returns import Returns,ShowReturns


router = APIRouter(
    prefix="/api/v1/returns",
    tags=['Returns']
)


# get all
@router.get('/', response_model=List[ShowReturns])
def get( db : Session = Depends(get_db)):#, current_user: User = Depends(oauth2.get_current_user)
    return returns.get(db)


# create
@router.post('/', status_code=status.HTTP_201_CREATED)
def create(request: Returns, db : Session = Depends(get_db)):#, current_user: User = Depends(oauth2.get_current_user)
    return returns.create(request, db)


# delete
@router.delete('/{id}', status_code=status.HTTP_204_NO_CONTENT)
def delete(id,db : Session = Depends(get_db)):#, current_user: User = Depends(oauth2.get_current_user)
    return returns.delete(id, db)


# update
@router.put('/{id}',status_code=status.HTTP_202_ACCEPTED)
def update(id, request: Returns, db : Session = Depends(get_db)):#, current_user: User = Depends(oauth2.get_current_user)
    return returns.update(id, request, db)


# get one
@router.get('/{id}', status_code=status.HTTP_200_OK, response_model=ShowReturns)
def get_one(id, db : Session = Depends(get_db)):
    return returns.get_one(id, db)
    