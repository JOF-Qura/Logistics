from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from typing import List
from app.repository import employee
from .. import database
from app.security import oauth2

from app.schemas.employee import Employee,ShowEmployee
from app.schemas.user import User


router = APIRouter(
    prefix="/api/v1/employee",
    tags=['Employee']
)
get_db = database.get_db


# get all
@router.get('/', response_model=List[ShowEmployee])
def get( db : Session = Depends(get_db),current_user: User = Depends(oauth2.get_current_user)):#, current_user: User = Depends(oauth2.get_current_user)
    return employee.get(db)


# create
@router.post('/', status_code=status.HTTP_201_CREATED)
def create(request: Employee, db : Session = Depends(get_db)):#, current_user: User = Depends(oauth2.get_current_user)
    return employee.create(request, db)


# delete
@router.delete('/{id}', status_code=status.HTTP_204_NO_CONTENT)
def delete(id,db : Session = Depends(get_db),current_user: User = Depends(oauth2.get_current_user)):#, current_user: User = Depends(oauth2.get_current_user)
    return employee.delete(id, db)


# update
@router.put('/{id}',status_code=status.HTTP_202_ACCEPTED)
def update(id, request: Employee, db : Session = Depends(get_db),current_user: User = Depends(oauth2.get_current_user)):#, current_user: User = Depends(oauth2.get_current_user)
    return employee.update(id, request, db)


# get one
@router.get('/{id}', status_code=status.HTTP_200_OK, response_model=ShowEmployee)
def get_one(id, db : Session = Depends(get_db), current_user: User = Depends(oauth2.get_current_user)):
    return employee.get_one(id, db)
    