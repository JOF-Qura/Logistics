from fastapi import APIRouter, Depends, status, HTTPException, Response
from fastapi import status, HTTPException
from sqlalchemy.orm import Session
from .. import database, models
from app.security import oauth2

from fastapi import HTTPException, status
from app.schemas.user import UserType





# create
def create(request: UserType, db : Session):#
    user_type = models.UserType(
        name=request.name,
        description=request.description,
        )
    db.add(user_type)
    db.commit()
    db.refresh(user_type)
    return user_type

# get all
def get( db : Session):
    user_type = db.query(models.UserType).all()
    return user_type


# delete
def delete(id,db : Session):
    user_type = db.query(models.UserType).filter(models.UserType.id == id)
    if not user_type.first():
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
        detail=f'User Type with the {id} is not found')
    user_type.delete(synchronize_session=False)
    db.commit()
    return 'Successfully Delete'



# update
def update(id, request: UserType, db : Session):
    user_type = db.query(models.UserType).filter(models.UserType.id == id)
    if not user_type.first():
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
        detail=f'User Type with the {id} is not found')
    user_type.update(
       {
        'name' : request.name,
        'description' : request.description,
       }
        )
    # user.update(request)
    db.commit()
    return 'Updated Succesfully'


#get one 
def get_one(id, db : Session):
    user_type = db.query(models.UserType).filter(models.UserType.id == id).first()
    if not user_type:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f'User Type with the id of {id} is not found')
    return user_type