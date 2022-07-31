from os import stat
from fastapi import APIRouter, Depends, Request, HTTPException, UploadFile, Form, File, status
from sqlalchemy.orm import Session
from sqlalchemy import or_
from sqlalchemy.sql.expression import desc
from sqlalchemy.sql.functions import user
from schemas.project_management.history_schema import ShowHistory
from models.project_management.history_model import ProjectHistory
from database import get_db
from typing import List
from controllers.encryption import Hash
from datetime import datetime as dt
from controllers.token_controller import get_token

router = APIRouter(
    prefix='/history',
    tags=['history'],
    dependencies=[Depends(get_token)]
)

# GET ALL HISTORY
@router.get('/', status_code=status.HTTP_200_OK, response_model=List[ShowHistory])
async def all_history(db: Session = Depends(get_db)):
    history = db.query(ProjectHistory).filter(ProjectHistory.active_status == "Active").all()
    return history

# GET ONE HISTORY
@router.get('/{id}', status_code=status.HTTP_200_OK, response_model=ShowHistory)
async def get_one_history(id: str, db: Session = Depends(get_db)):
    history = db.query(ProjectHistory).filter(ProjectHistory.id == id).first()
    if not history:
        raise HTTPException(404, 'History not found')
    return history

# GET ONE PROJECT HISTORY
@router.get('/project/{id}', status_code=status.HTTP_200_OK, response_model=List[ShowHistory])
async def get_one_history(id: str, db: Session = Depends(get_db)):
    history = db.query(ProjectHistory).filter(ProjectHistory.project_id == id).all()
    if not history:
        raise HTTPException(404, 'History not found')
    return history

# CREATE HISTORY
@router.post('/', status_code=status.HTTP_201_CREATED)
async def create_history(project_id: str = Form(...), employee_id: str = Form(...), subject: str = Form(...), date: str = Form(...), remarks: str = Form(...), db: Session = Depends(get_db)):
    
    to_store = ProjectHistory(
        project_id = project_id,
        employee_id = employee_id,
        subject = subject,
        remarks = remarks,
        date = date
    )

    db.add(to_store)
    db.commit()
    return {'message': 'History stored successfully.'}

# UPDATE HISTORY
@router.put('/{id}', status_code=status.HTTP_202_ACCEPTED)
async def update_history(id: str, project_id: str = Form(...), employee_id: str = Form(...), subject: str = Form(...), date: str = Form(...), remarks: str = Form(...), db: Session = Depends(get_db)): 
    if not db.query(ProjectHistory).filter(ProjectHistory.id == id).update({
        'project_id': project_id,
        'employee_id': employee_id,
        'subject': subject,
        'date': date,
        'remarks': remarks,
        'updated_at' : dt.utcnow()
    }):
        raise HTTPException(404, 'History to update is not found')
    db.commit()
    return {'message': 'History updated successfully.'}

# DELETE HISTORY
@router.delete('/{id}', status_code=status.HTTP_204_NO_CONTENT)
async def delete_user(id: str, db: Session = Depends(get_db)):
    if not db.query(ProjectHistory).filter(ProjectHistory.id == id).update({
        'active_status': "Inactive"
    }):
        raise HTTPException(404, 'History to delete is not found')
    db.commit()
    return {'message': 'History deleted successfully.'}

