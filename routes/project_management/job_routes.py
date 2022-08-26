from os import stat
from fastapi import APIRouter, Depends, Request, HTTPException, UploadFile, Form, File, status
from sqlalchemy.orm import Session
from sqlalchemy import or_
from sqlalchemy.sql.expression import desc
from sqlalchemy.sql.functions import user
from schemas.project_management.job_schema import ShowJob
from models.project_management.job_model import Job
from database import get_db
from typing import List
from controllers.encryption import Hash
from datetime import datetime as dt
from controllers.token_controller import get_token

router = APIRouter(
    prefix='/jobs',
    tags=['jobs']
)

# GET ALL JOBS
@router.get('/', status_code=status.HTTP_200_OK, response_model=List[ShowJob])
async def all_jobs(db: Session = Depends(get_db)):
    jobs = db.query(Job).filter(Job.active_status == "Active").all()
    return jobs

# GET ONE JOB
@router.get('/{id}', status_code=status.HTTP_200_OK, response_model=ShowJob)
async def get_one_job(id: str, db: Session = Depends(get_db)):
    job = db.query(Job).filter(Job.id == id).first()
    if not job:
        raise HTTPException(404, 'Job not found')
    return job

# CREATE JOB
@router.post('/', status_code=status.HTTP_201_CREATED)
async def create_job(title: str = Form(...), description: str = Form(...), db: Session = Depends(get_db)):
    
    to_store = Job(
        title = title,
        description = description
    )

    db.add(to_store)
    db.commit()
    return {'message': 'Job stored successfully.'}

# UPDATE JOB
@router.put('/{id}', status_code=status.HTTP_202_ACCEPTED)
async def update_job(id: str, title: str = Form(...), description: str = Form(...), db: Session = Depends(get_db)): 
    if not db.query(Job).filter(Job.id == id).update({
        'title': title,
        'description': description,
        'updated_at' : dt.utcnow()
    }):
        raise HTTPException(404, 'Job to update is not found')
    db.commit()
    return {'message': 'Job updated successfully.'}

# DELETE JOB
@router.delete('/{id}', status_code=status.HTTP_204_NO_CONTENT)
async def delete_user(id: str, db: Session = Depends(get_db)):
    if not db.query(Job).filter(Job.id == id).update({
        'active_status': "Inactive"
    }):
        raise HTTPException(404, 'Job to delete is not found')
    db.commit()
    return {'message': 'Job deleted successfully.'}

