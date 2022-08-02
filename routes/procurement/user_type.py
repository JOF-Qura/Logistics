from fastapi import APIRouter, Depends, status, HTTPException, Response
from typing import List
from sqlalchemy.orm import Session
from .. import database, models
from app.security import oauth2
from app.repository import user_type
from app.schemas.user import UserType,ShowUserType,User



router = APIRouter(
    prefix="/api/v1/user-type",
    tags=['User_Type']
)

get_db = database.get_db


# create
@router.post('/', response_model=ShowUserType)
def create(request: UserType, db : Session = Depends(get_db)):#, current_user: User = Depends(oauth2.get_current_user)
    return user_type.create(request, db)


# get all
@router.get('/', response_model=List[ShowUserType])
def get( db : Session = Depends(get_db)):
    return user_type.get(db)


# delete
@router.delete('/{id}', status_code=status.HTTP_204_NO_CONTENT)
def delete(id,db : Session = Depends(get_db), current_user: User = Depends(oauth2.get_current_user)):
    return user_type.delete(id, db)
    

# update
@router.put('/{id}',status_code=status.HTTP_202_ACCEPTED)
def update(id, request: UserType, db : Session = Depends(get_db)):
    return user_type.update(id,request, db)
    
# get one
@router.get('/{id}', status_code=status.HTTP_200_OK, response_model=ShowUserType)
def get_one(id, response: Response, db : Session = Depends(get_db), current_user: User = Depends(oauth2.get_current_user)):
    return user_type.get_one(id, db)
