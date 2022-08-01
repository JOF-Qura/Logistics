from os import name
from fastapi import APIRouter, Request, Depends, HTTPException, Form, status
from sqlalchemy.orm import Session
from sqlalchemy import or_
from schemas.project_management.department_schema import ShowDepartment
from models.project_management.department_model import Departments
from database import get_db
from datatables import DataTable
from datetime import datetime as dt
from typing import List
from controllers.token_controller import get_token

router = APIRouter(
    prefix='/departments',
    tags=['departments']
)

# DEPARTMENT DATATABLE
@router.get('/datatable')
async def datatable(request: Request, db: Session = Depends(get_db)):
    try:
        def perform_search(queryset, user_input):
            return queryset.filter(
                or_(
                    Departments.name.like('%' + user_input + '%'),
                    Departments.location.like('%' + user_input + '%'),
                    Departments.description.like('%' + user_input + '%')
                )
            )

        table = DataTable(dict(request.query_params), Departments, db.query(Departments), [
            'name',
            'location',
            'description'
        ])

        table.searchable(lambda queryset, user_input: perform_search(queryset, user_input))
    
        return table.json()
    except Exception as e:
        print(e)

# GET ALL DEPARTMENTS
@router.get('/', status_code=status.HTTP_200_OK)
async def all_departments(db: Session = Depends(get_db)):
    data = db.query(Departments).filter(Departments.active_status == "Active").all()
    return {"data": data}

# GET ONE DEPARTMENT
@router.get('/{id}', status_code=status.HTTP_200_OK, response_model=ShowDepartment)
async def get_one_department(id: str, db: Session = Depends(get_db)):
    data = db.query(Departments).filter(Departments.id == id).first()
    if not data:
        raise HTTPException(404, 'Department not found')
    return data

# CREATE DEPARTMENT
@router.post('/', status_code=status.HTTP_201_CREATED)
async def create_department(name: str = Form(...), description: str = Form(...), location: str = Form(...), db: Session = Depends(get_db)):
    to_store = Departments(
        name = name,
        description = description,
        location = location,
        active_status = "Active"
    )
    db.add(to_store)
    db.commit()
    return {'message': 'Department stored successfully.'}

# UPDATE DEPARTMENT
@router.put('/{id}', status_code=status.HTTP_202_ACCEPTED)
async def update_department(id: str, name: str = Form(...), description: str = Form(...), location: str = Form(...), db: Session = Depends(get_db)): 
    if not db.query(Departments).filter(Departments.id == id).update({
        'name': name,
        'description': description,
        'location': location,
        'updated_at' : dt.utcnow()
    }):
        raise HTTPException(404, 'Department to update is not found')
    db.commit()
    return {'message': 'Department updated successfully.'}

# DELETE DEPARTMENT
@router.delete('/{id}', status_code=status.HTTP_204_NO_CONTENT)
async def delete_department(id: str, db: Session = Depends(get_db)):
    if not db.query(Departments).filter(Departments.id == id).update({
        'active_status': "Inactive"
    }):
        raise HTTPException(404, 'Department to delete is not found')
    db.commit()
    return {'message': 'Department deleted successfully.'}
