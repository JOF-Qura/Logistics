from fastapi import status, HTTPException
from sqlalchemy.orm import Session
from .. import database, models
from app.security import oauth2

from fastapi import HTTPException, status
from app.schemas.employee import Employee


# get one
def get_one(id,db : Session):
    employee = db.query(models.Employee).filter(models.Employee.id == id).first()
    if not employee:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f'Employee with the id of {id} is not found')

    return employee

# get all
def get( db : Session):
    employee = db.query(models.Employee).all()
    return employee

# create
def create(request: Employee, db : Session):
    new_employee = models.Employee(
        first_name=request.first_name,
        middle_name=request.middle_name,
        last_name =request.last_name,
        birthdate =request.birthdate,
        contact_no =request.contact_no,
        address =request.address,
        department_id =request.department_id,
        employee_type_id =request.employee_type_id


        )
    db.add(new_employee)
    db.commit()
    db.refresh(new_employee)
    return new_employee


# delete
def delete(id,db : Session):
    employee = db.query(models.Employee).filter(models.Employee.id == id)
    if not employee.first():
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
        detail=f'Employee with the {id} is not found')
    employee.delete(synchronize_session=False)
    db.commit()
    return employee

# update
def update(id, request: Employee, db : Session):
    employee = db.query(models.Employee).filter(models.Employee.id == id)
    if not employee.first():
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
        detail=f'Employee with the {id} is not found')
    employee.update(
       {
        
        'first_name':request.first_name,
        'middle_name':request.middle_name,
        'last_name':request.last_name,
        'birthdate':request.birthdate,
        'contact_no':request.contact_no,
        'address':request.address,
        'department_id':request.department_id,
        'employee_type_id':request.employee_type_id

       }
        )
    # employee.update(request)
    db.commit()
    return 'Updated Succesfully'



