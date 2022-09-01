from os import name
from fastapi import APIRouter, Depends, Response, HTTPException, Request, Form, status
from sqlalchemy.orm import Session
from database import get_db
from sqlalchemy import or_
from models.asset_management.department_model import Department
from schemas.asset_management.department_schema import CreateDepartment
from datatables import DataTable

router = APIRouter(
    prefix='/asset_management/api/Department',
    tags=['Department']
)

# DEPARTMENT DATATABLE
@router.get('/datatable')
async def datatable(request: Request, db: Session = Depends(get_db)):
    try:
        def perform_search(queryset, user_input):
            return queryset.filter(
                or_(
                    Department.department_id.like('%' + user_input + '%'),
                    Department.department_name.like('%' + user_input + '%'),
                    Department.department_location.like('%' + user_input + '%'),
                    Department.department_description.like('%' + user_input + '%'),
                    Department.department_head.like('%' + user_input + '%'),
                    Department.contact_no.like('%' + user_input + '%'),
                )
            )

        table = DataTable(dict(request.query_params), Department, db.query(Department), [
            'department_id',
            'department_name',
            'department_location',
            'department_description',
            'department_head',
            'contact_no',
        ])

        table.searchable(lambda queryset, user_input: perform_search(queryset, user_input))
    
        return table.json()
    except Exception as e:
        print(e)

@router.get('/')
def all(db: Session = Depends(get_db)):
    department = db.query(Department).filter(Department.active_status == "Active").all()
    return {'data': department}

@router.get('/{id}')
def read(id: str, db: Session = Depends(get_db)):
    department = db.query(Department).filter(Department.department_id == id).first()
    if not department:
        raise HTTPException(404, 'department not found')
    return {'data': department}

@router.post('/')
def add(department: CreateDepartment, db: Session = Depends(get_db)):
    try:
        department_schema = Department(
            
            department_name = department.department_name,
            department_description = department.department_description,
            department_location = department.department_location,
            department_head = department.department_head,
            contact_no = department.contact_no
        )

        db.add(department_schema)
        db.commit()
        return {'message': 'department created successfully.'}
    except Exception as e:
        print(e)
        
@router.put('/{id}')
def update(id: str, department: CreateDepartment, db: Session = Depends(get_db)): 
    if not db.query(Department).filter(Department.department_id == id).update({
        'department_name': department.department_name,
        'department_description': department.department_description,
        'department_location': department.department_location,
        'contact_no': department.contact_no,
        'department_head': department.department_head,
    }):
        raise HTTPException(404, 'department to update is not found')
    db.commit()
    return {'message': 'department updated successfully.'}

@router.delete('/{id}')
def remove(id: str, db: Session = Depends(get_db)): 
    if not db.query(Department).filter(Department.department_id == id).update({
        'active_status': 'Inactive',
    }):
        raise HTTPException(404, 'Department to delete is not found')
    db.commit()
    return {'message': 'Department removed successfully.'}