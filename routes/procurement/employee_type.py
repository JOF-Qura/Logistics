from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from typing import List
from app.repository import employee_type
from .. import database
from app.security import oauth2

from app.schemas.employee_type import EmployeeType,ShowEmployeeType
from app.schemas.user import User


router = APIRouter(
    prefix="/api/v1/employee-type",
    tags=['Employee Type']
)
get_db = database.get_db


# get all
@router.get('/', response_model=List[ShowEmployeeType])
def get( db : Session = Depends(get_db),current_user: User = Depends(oauth2.get_current_user)):#, current_user: User = Depends(oauth2.get_current_user)
    return employee_type.get(db)


# create
@router.post('/', status_code=status.HTTP_201_CREATED)
def create(request: EmployeeType, db : Session = Depends(get_db)):#, current_user: User = Depends(oauth2.get_current_user)
    return employee_type.create(request, db)


# delete
@router.delete('/{id}', status_code=status.HTTP_204_NO_CONTENT)
def delete(id,db : Session = Depends(get_db),current_user: User = Depends(oauth2.get_current_user)):#, current_user: User = Depends(oauth2.get_current_user)
    return employee_type.delete(id, db)


# update
@router.put('/{id}',status_code=status.HTTP_202_ACCEPTED)
def update(id, request: EmployeeType, db : Session = Depends(get_db),current_user: User = Depends(oauth2.get_current_user)):#, current_user: User = Depends(oauth2.get_current_user)
    return employee_type.update(id, request, db)


# get one
@router.get('/{id}', status_code=status.HTTP_200_OK, response_model=ShowEmployeeType)
def get_one(id, db : Session = Depends(get_db), current_user: User = Depends(oauth2.get_current_user)):
    return employee_type.get_one(id, db)
    