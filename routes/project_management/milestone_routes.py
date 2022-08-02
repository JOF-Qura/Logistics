from os import stat
from fastapi import APIRouter, Depends, Request, HTTPException, UploadFile, Form, File, status
from sqlalchemy.orm import Session
from sqlalchemy import or_
from sqlalchemy.sql.expression import desc
from schemas.project_management.milestone_schema import ShowMilestone
from models.project_management.milestone_model import Milestones
from models.project_management.project_model import Project
from models.project_management.history_model import ProjectHistory
from database import get_db
from typing import List
from controllers.encryption import Hash
from datetime import datetime as dt
from controllers.token_controller import get_token

router = APIRouter(
    prefix='/milestone',
    tags=['milestone'],
    # dependencies=[Depends(get_token)]
)

# GET ALL MILESTONE
@router.get('/', status_code=status.HTTP_200_OK, response_model=List[ShowMilestone])
async def all_milestone(db: Session = Depends(get_db)):
    milestone = db.query(Milestones).filter(Milestones.active_status == "Active").all()
    return milestone

# GET ONE MILESTONE
@router.get('/{id}', status_code=status.HTTP_200_OK, response_model=ShowMilestone)
async def get_one_milestone(id: str, db: Session = Depends(get_db)):
    milestone = db.query(Milestones).filter(Milestones.id == id).first()
    if not milestone:
        raise HTTPException(404, 'Milestone not found')
    return milestone

# CREATE MILESTONE
@router.post('/', status_code=status.HTTP_201_CREATED)
async def create_milestone(project_id: str = Form(...), name: str = Form(...), description: str = Form(...), date: str = Form(...), db: Session = Depends(get_db)):
    
    milestone = Milestones(
        project_id = project_id,
        name = name,
        description = description,
        date = date
    )

    db.add(milestone)
    db.commit()

    project = db.query(Project).filter(Project.id == project_id).first()
    history = ProjectHistory(
        project_id = project.id,
        employee_id = project.manager_id,
        date = milestone.date,
        subject = 'Milestone',
        remarks = 'Milestone: '+milestone.name+' has been achieved',
    )
    db.add(history)
    db.commit()
    return {'message': 'Milestone stored successfully.'}

# UPDATE MILESTONE
@router.put('/{id}', status_code=status.HTTP_202_ACCEPTED)
async def update_milestone(id: str, project_id: str = Form(...), name: str = Form(...), description: str = Form(...), date: str = Form(...), db: Session = Depends(get_db)): 
    if not db.query(Milestones).filter(Milestones.id == id).update({
        'project_id': project_id,
        'name': name,
        'description': description,
        'date': date,
        'updated_at' : dt.utcnow()
    }):
        raise HTTPException(404, 'Milestone to update is not found')
    db.commit()

    project = db.query(Project).filter(Project.id == project_id).first()
    history = ProjectHistory(
        project_id = project.id,
        employee_id = project.manager_id,
        date = date,
        subject = 'Milestone',
        remarks = 'Milestone: '+name+' has been updated',
    )
    db.add(history)
    db.commit()
    return {'message': 'Milestone updated successfully.'}

# DELETE MILESTONE
@router.delete('/{id}', status_code=status.HTTP_204_NO_CONTENT)
async def delete_milestone(id: str, db: Session = Depends(get_db)):
    if not db.query(Milestones).filter(Milestones.id == id).update({
        'active_status': "Inactive"
    }):
        raise HTTPException(404, 'Milestone to delete is not found')
    db.commit()

    milestone = db.query(Milestones).filter(Milestones.id == id).first()
    project = db.query(Project).filter(Project.id == milestone.project_id).first()
    history = ProjectHistory(
        project_id = project.id,
        employee_id = project.manager_id,
        date = milestone.created_at,
        subject = 'Milestone',
        remarks = 'Milestone: '+milestone.name+' has been removed',
    )
    db.add(history)
    db.commit()
    return {'message': 'Milestone deleted successfully.'}

