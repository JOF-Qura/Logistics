from fastapi import APIRouter, Depends, Response, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models.asset_management.department_model import Department
from schemas.asset_management.department_schema import CreateDepartment

router = APIRouter(
    prefix='/asset_management/api/Department',
    tags=['Department']
)

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