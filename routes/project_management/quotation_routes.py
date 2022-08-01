from os import stat
from fastapi import APIRouter, Depends, Request, HTTPException, UploadFile, Form, File, status
from sqlalchemy.orm import Session
from sqlalchemy import or_
from sqlalchemy.sql.expression import desc
from sqlalchemy.sql.functions import user
from schemas.project_management.quotation_schema import ShowQuotation
from models.project_management.quotation_model import Quotation
from models.project_management.department_model import Departments
from database import get_db
from typing import List
from controllers.encryption import Hash
from datetime import datetime as dt
from controllers.token_controller import get_token

router = APIRouter(
    prefix='/quotation',
    tags=['quotation'],
    # dependencies=[Depends(get_token)]
)

# GET ALL QUOTATIONS
@router.get('/', status_code=status.HTTP_200_OK, response_model=List[ShowQuotation])
async def all_quotation(db: Session = Depends(get_db)):
    quotation = db.query(Quotation).filter(Quotation.active_status == "Active").all()
    return quotation

# GET ALL PROJECT QUOTATION
@router.get('/project/{project_id}', status_code=status.HTTP_200_OK, response_model=List[ShowQuotation])
async def get_one_project_quotation(project_id: str, db: Session = Depends(get_db)):
    quotation = db.query(Quotation).filter(Quotation.project_id == project_id, Quotation.active_status == "Active").all()
    return quotation

# GET ALL DELETED QUOTATION
@router.get('/deleted', status_code=status.HTTP_200_OK, response_model=List[ShowQuotation])
async def all_deleted_quotation(db: Session = Depends(get_db)):
    data = db.query(Quotation).filter(Quotation.active_status == "Inactive").all()
    return data

# GET ONE QUOTATION
@router.get('/{id}', status_code=status.HTTP_200_OK, response_model=ShowQuotation)
async def get_one_quotation(id: str, db: Session = Depends(get_db)):
    quotation = db.query(Quotation).filter(Quotation.id == id).first()
    if not quotation:
        raise HTTPException(404, 'Quotation not found')
    return quotation

# CREATE QUOTATION
@router.post('/', status_code=status.HTTP_201_CREATED)
async def create_quotation(project_id: str = Form(...), task_id: str = Form(...), name: str = Form(...), description: str = Form(...), quantity: str = Form(...), price: str = Form(...), total: str = Form(...), db: Session = Depends(get_db)):

    to_store = Quotation(
        project_id = project_id,
        task_id = task_id,
        name = name,
        description = description,
        quantity = quantity,
        price = price,
        total = total
    )

    db.add(to_store)
    db.commit()
    return {'message': 'Quotation stored successfully.'}

# UPDATE QUOTATION
@router.put('/{id}', status_code=status.HTTP_202_ACCEPTED)
async def update_quotation(id: str, project_id: str = Form(...), task_id: str = Form(...), name: str = Form(...), description: str = Form(...), quantity: str = Form(...), price: str = Form(...), total: str = Form(...), db: Session = Depends(get_db)): 
    if not db.query(Quotation).filter(Quotation.id == id).update({
        'project_id' : project_id,
        'task_id' : task_id,
        'name' : name,
        'description' : description,
        'quantity' : quantity,
        'price' : price,
        'total' : total,
        'updated_at' : dt.utcnow()
    }):
        raise HTTPException(404, 'Quotation to update is not found')
    db.commit()
    return {'message': 'Quotation updated successfully.'}

# RESTORE TASK
@router.put('/restore/{id}', status_code=status.HTTP_202_ACCEPTED)
async def restore_quotation(id: str, db: Session = Depends(get_db)): 
    if not db.query(Quotation).filter(Quotation.id == id).update({
        'active_status' : 'Active',
        'updated_at' : dt.utcnow()
    }):
        raise HTTPException(404, 'Quotation to restore is not found')
    db.commit()
    return {'message': 'Quotation restore successfully.'}

# DELETE QUOTATION
@router.delete('/{id}', status_code=status.HTTP_204_NO_CONTENT)
async def delete_quotation(id: str, db: Session = Depends(get_db)):
    if not db.query(Quotation).filter(Quotation.id == id).update({
        'active_status': "Inactive"
    }):
        raise HTTPException(404, 'Quotation to delete is not found')
    db.commit()
    return {'message': 'Quotation deleted successfully.'}

