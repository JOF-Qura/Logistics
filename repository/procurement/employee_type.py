from fastapi import status, HTTPException
from sqlalchemy.orm import Session
from .. import database, models
from app.security import oauth2

from fastapi import HTTPException, status
from app.schemas.employee_type import EmployeeType


# get one
def get_one(id,db : Session):
    employee_type = db.query(models.EmployeeType).filter(models.EmployeeType.id == id).first()
    if not employee_type:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f'Employee Type with the id of {id} is not found')

    return employee_type

# get all
def get( db : Session):
    employee_type = db.query(models.EmployeeType).all()
    return employee_type

# create
def create(request: EmployeeType, db : Session):
    new_employee_type = models.EmployeeType(
        name=request.name,
        description=request.description,

        )
    db.add(new_employee_type)
    db.commit()
    db.refresh(new_employee_type)
    return new_employee_type


# delete
def delete(id,db : Session):
    employee_type = db.query(models.EmployeeType).filter(models.EmployeeType.id == id)
    if not employee_type.first():
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
        detail=f'Employee Type with the {id} is not found')
    employee_type.delete(synchronize_session=False)
    db.commit()
    return employee_type

# update
def update(id, request: EmployeeType, db : Session):
    employee_type = db.query(models.EmployeeType).filter(models.EmployeeType.id == id)
    if not employee_type.first():
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
        detail=f'Employee Type with the {id} is not found')
    employee_type.update(
       {
        'name' : request.name,
        'description' : request.description,

       }
        )
    # employee_type.update(request)
    db.commit()
    return 'Updated Succesfully'



