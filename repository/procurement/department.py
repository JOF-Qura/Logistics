from fastapi import status, HTTPException
from sqlalchemy.orm import Session
from .. import database, models
from app.security import oauth2

from fastapi import HTTPException, status
from app.schemas.department import Department


# get one
def get_one(id,db : Session):
    department = db.query(models.Department).filter(models.Department.id == id).first()
    if not department:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f'Department with the id of {id} is not found')

    return department

# get all
def get( db : Session):
    department = db.query(models.Department).all()
    return department

# create
def create(request: Department, db : Session):
    new_department = models.Department(
        department_name=request.department_name,
        contact_no=request.contact_no,
        department_head =request.department_head

        )
    db.add(new_department)
    db.commit()
    db.refresh(new_department)
    return new_department


# delete
def delete(id,db : Session):
    department = db.query(models.Department).filter(models.Department.id == id)
    if not department.first():
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
        detail=f'Department with the {id} is not found')
    department.delete(synchronize_session=False)
    db.commit()
    return department

# update
def update(id, request: Department, db : Session):
    department = db.query(models.Department).filter(models.Department.id == id)
    if not department.first():
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
        detail=f'Department with the {id} is not found')
    department.update(
       {
        'department_name' : request.department_name,
        'contact_no' : request.contact_no,
        'department_head': request.department_head

       }
        )
    # department.update(request)
    db.commit()
    return 'Updated Succesfully'



