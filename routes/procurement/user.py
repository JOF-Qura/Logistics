
from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
# from repository import user 

from typing import List
from app.repository import user
from .. import database, models
from app.security import oauth2

from app.schemas.user import User,ShowUser




router = APIRouter(
    prefix="/api/v1/user",
    tags=['Users'],
)


get_db = database.get_db



# get all
@router.get('/', response_model=List[ShowUser])#, response_model=List[ShowUser]
def get( db : Session = Depends(get_db), current_user: User = Depends(oauth2.get_current_user)):#, current_user: User = Depends(oauth2.get_current_user)
    return user.get(db)

# create
@router.post('/', status_code=status.HTTP_201_CREATED)
def create(request: User, db : Session = Depends(get_db)):#, current_user: User = Depends(oauth2.get_current_user)
    return user.create(request, db)

# delete
@router.delete('/{id}', status_code=status.HTTP_204_NO_CONTENT)
def delete(id,db : Session = Depends(get_db), current_user: User = Depends(oauth2.get_current_user)):#
    return user.delete(id, db)

# update
@router.put('/{id}',status_code=status.HTTP_202_ACCEPTED)
def update(id,request: User, db : Session = Depends(get_db)):#, current_user: User = Depends(oauth2.get_current_user)
    return user.update(id,request, db)

# get one
@router.get('/{id}', status_code=status.HTTP_200_OK, response_model=ShowUser)
def get_one(id, db : Session = Depends(get_db), current_user: User = Depends(oauth2.get_current_user)):#, current_user: User = Depends(oauth2.get_current_user)
    return user.get_one(id, db)

# get one that equal to vendor id
@router.get('/vendor/{vendor_id}', status_code=status.HTTP_200_OK, response_model=ShowUser)
def get_one_vendor_id(vendor_id, db : Session = Depends(get_db), current_user: User = Depends(oauth2.get_current_user)):#, current_user: User = Depends(oauth2.get_current_user)
    return user.get_one_vendor_id(vendor_id, db)


