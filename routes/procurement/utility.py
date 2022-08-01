from datetime import date
from fastapi import APIRouter, Depends, UploadFile, status,File,Form
from sqlalchemy.orm import Session
from typing import List
from repository.procurement import utility
from database import get_db

from schemas.procurement.utility import Utilities,ShowUtilities
# from schemas.procurement.user import User


router = APIRouter(
    prefix="/api/v1/utilities",
    tags=['Utilities']
)


# get related file
@router.get('/related-file/{file}')#, response_model=List[ShowProduct]
def get_one_file(file, db : Session = Depends(get_db)):
    return utility.get_one_file(file,db)

# get all
@router.get('/', response_model=List[ShowUtilities])
def get( db : Session = Depends(get_db)):
    return utility.get(db)


# create
@router.post('/', status_code=status.HTTP_201_CREATED)
def create(utility_type:str= Form(...),utility_amount:float= Form(...),due_date:date= Form(...),vendor_id:str= Form(...),notes:str = Form(...),attachment:UploadFile= File(...), db : Session = Depends(get_db)):
    return utility.create(utility_type,utility_amount,due_date,vendor_id,notes,attachment,db)


# delete
@router.delete('/{id}', status_code=status.HTTP_204_NO_CONTENT)
def delete(id,db : Session = Depends(get_db)):
    return utility.delete(id, db)


# update
@router.put('/{id}',status_code=status.HTTP_202_ACCEPTED)
def update(id, utility_type:str= Form(...),utility_amount:float= Form(...),due_date:date= Form(...),vendor_id:str= Form(...),notes:str = Form(...),attachment:UploadFile= File(...), db : Session = Depends(get_db)):
    return utility.update(id,utility_type,utility_amount,due_date,vendor_id,notes,attachment,db)


# get one
@router.get('/{id}', status_code=status.HTTP_200_OK, response_model=ShowUtilities)
def get_one(id, db : Session = Depends(get_db)):
    return utility.get_one(id, db)
    