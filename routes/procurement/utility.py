from datetime import date
from fastapi import APIRouter, Depends, UploadFile, status,File,Form
from sqlalchemy.orm import Session
from typing import List
from app.repository import utility
from .. import database
from app.security import oauth2

from app.schemas.utility import Utilities,ShowUtilities
from app.schemas.user import User


router = APIRouter(
    prefix="/api/v1/utilities",
    tags=['Utilities']
)
get_db = database.get_db

# get related file
@router.get('/related-file/{file}')#, response_model=List[ShowProduct]
def get_one_file(file, db : Session = Depends(get_db)):
    return utility.get_one_file(file,db)

# get all
@router.get('/', response_model=List[ShowUtilities])
def get( db : Session = Depends(get_db),current_user: User = Depends(oauth2.get_current_user)):#, current_user: User = Depends(oauth2.get_current_user)
    return utility.get(db)


# create
@router.post('/', status_code=status.HTTP_201_CREATED)
def create(utility_type:str= Form(...),utility_amount:float= Form(...),due_date:date= Form(...),vendor_id:str= Form(...),notes:str = Form(...),attachment:UploadFile= File(...), db : Session = Depends(get_db)):#, current_user: User = Depends(oauth2.get_current_user)
    return utility.create(utility_type,utility_amount,due_date,vendor_id,notes,attachment,db)


# delete
@router.delete('/{id}', status_code=status.HTTP_204_NO_CONTENT)
def delete(id,db : Session = Depends(get_db),current_user: User = Depends(oauth2.get_current_user)):#, current_user: User = Depends(oauth2.get_current_user)
    return utility.delete(id, db)


# update
@router.put('/{id}',status_code=status.HTTP_202_ACCEPTED)
def update(id, utility_type:str= Form(...),utility_amount:float= Form(...),due_date:date= Form(...),vendor_id:str= Form(...),notes:str = Form(...),attachment:UploadFile= File(...), db : Session = Depends(get_db)):#, current_user: User = Depends(oauth2.get_current_user)
    return utility.update(id,utility_type,utility_amount,due_date,vendor_id,notes,attachment,db)


# get one
@router.get('/{id}', status_code=status.HTTP_200_OK, response_model=ShowUtilities)
def get_one(id, db : Session = Depends(get_db), current_user: User = Depends(oauth2.get_current_user)):
    return utility.get_one(id, db)
    