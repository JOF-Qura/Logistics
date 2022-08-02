from os import name
from fastapi import APIRouter, Request, Depends, HTTPException, Form, status
from sqlalchemy.orm import Session
from sqlalchemy import or_
from schemas.project_management.activity_schema import ShowActivity
from models.project_management.activity_model import Activity
from database import get_db
from typing import List
from controllers.token_controller import get_token
from datetime import datetime as dt

router = APIRouter(
    prefix='/activity',
    tags=['activity'],
    # dependencies=[Depends(get_token)]
)

# GET ALL ACTIVITY
@router.get('/', status_code=status.HTTP_200_OK, response_model=List[ShowActivity])
async def all_activity(db: Session = Depends(get_db)):
    data = db.query(Activity).filter(Activity.active_status == "Active").all()
    return data

# GET ALL TASK ACTIVITY
@router.get('/task/{task_id}', status_code=status.HTTP_200_OK, response_model=List[ShowActivity])
async def all_activity(task_id: str,db: Session = Depends(get_db)):
    data = db.query(Activity).filter(Activity.active_status == "Active", Activity.task_id == task_id).all()
    return data

# GET ALL DELETED ACTIVITY
@router.get('/deleted', status_code=status.HTTP_200_OK, response_model=List[ShowActivity])
async def all_deleted_activity(db: Session = Depends(get_db)):
    data = db.query(Activity).filter(Activity.active_status == "Inactive").all()
    return data

# GET ONE ACTIVITY
@router.get('/{id}', status_code=status.HTTP_200_OK, response_model=ShowActivity)
async def get_one_activity(id: str, db: Session = Depends(get_db)):
    data = db.query(Activity).filter(Activity.id == id).first()
    if not data:
        raise HTTPException(404, 'Activity not found')
    return data

# CREATE ACTIVITY
@router.post('/', status_code=status.HTTP_201_CREATED)
async def create_activity(subject: str = Form(...), remarks: str = Form(...), date: str = Form(...), project_id: str = Form(...), task_id: str = Form(...), employee_id: str = Form(...), db: Session = Depends(get_db)):
    to_store = Activity(
        subject = subject,
        remarks = remarks,
        date = date,
        project_id = project_id,
        task_id = task_id,
        employee_id = employee_id
    )
    db.add(to_store)
    db.commit()
    return {'message': 'Activity stored successfully.'}

# UPDATE ACTIVITY
@router.put('/{id}', status_code=status.HTTP_202_ACCEPTED)
async def update_activity(id: str, employee_id: str = Form(...), subject: str = Form(...), remarks: str = Form(...), date: str = Form(...), db: Session = Depends(get_db)): 
    if not db.query(Activity).filter(Activity.id == id).update({
        'subject': subject,
        'remarks': remarks,
        'date': date,
        'employee_id': employee_id,
        'updated_at' : dt.utcnow()
    }):
        raise HTTPException(404, 'Activity to update is not found')
    db.commit()
    return {'message': 'Activity updated successfully.'}

# RESTORE ACTIVITY
@router.put('/restore/{id}', status_code=status.HTTP_202_ACCEPTED)
async def restore_activity(id: str, db: Session = Depends(get_db)): 
    if not db.query(Activity).filter(Activity.id == id).update({
        'active_status': 'Active',
        'updated_at' : dt.utcnow()
    }):
        raise HTTPException(404, 'Activity to restore is not found')
    db.commit()
    return {'message': 'Activity restore successfully.'}

# DELETE ACTIVITY
@router.delete('/{id}', status_code=status.HTTP_204_NO_CONTENT)
async def delete_activity(id: str, db: Session = Depends(get_db)):
    if not db.query(Activity).filter(Activity.id == id).update({
        'active_status': "Inactive"
    }):
        raise HTTPException(404, 'Activity to delete is not found')
    db.commit()
    return {'message': 'Activity deleted successfully.'}
