from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from typing import List
from repository.procurement import return_details
from database import get_db

from schemas.procurement.returns import ReturnDetails,ShowReturnDetails


router = APIRouter(
    prefix="/api/v1/return-details",
    tags=['Return Details']
)


# get all
@router.get('/', response_model=List[ShowReturnDetails])
def get( db : Session = Depends(get_db)):#,
    return return_details.get(db)


# create
@router.post('/', status_code=status.HTTP_201_CREATED)
def create(request: ReturnDetails, db : Session = Depends(get_db)):#,
    return return_details.create(request, db)


# delete
@router.delete('/{id}', status_code=status.HTTP_204_NO_CONTENT)
def delete(id,db : Session = Depends(get_db)):#,
    return return_details.delete(id, db)


# update
@router.put('/{id}',status_code=status.HTTP_202_ACCEPTED)
def update(id, request: ReturnDetails, db : Session = Depends(get_db)):#,
    return return_details.update(id, request, db)


# get one
@router.get('/{id}', status_code=status.HTTP_200_OK, response_model=ShowReturnDetails)
def get_one(id, db : Session = Depends(get_db)):
    return return_details.get_one(id, db)
    