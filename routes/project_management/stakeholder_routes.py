from os import stat
from fastapi import APIRouter, Depends, Request, HTTPException, UploadFile, Form, File, status
from sqlalchemy.orm import Session
from sqlalchemy import or_
from sqlalchemy.sql.expression import desc
from schemas.project_management.stakeholder_schema import ShowStakeholder
from models.project_management.stakeholders_model import Stakeholder
from database import get_db
from typing import List
from controllers.encryption import Hash
from datetime import datetime as dt
from controllers.token_controller import get_token

router = APIRouter(
    prefix='/stakeholder',
    tags=['stakeholder'],
    # dependencies=[Depends(get_token)]
)

# GET ALL STAKE HOLDER
@router.get('/', status_code=status.HTTP_200_OK, response_model=List[ShowStakeholder])
async def all_stakeholder(db: Session = Depends(get_db)):
    stakeholder = db.query(Stakeholder).filter(Stakeholder.active_status == "Active").all()
    return stakeholder

# GET ALL PROJECT STAKE HOLDER
@router.get('/project/{project_id}', status_code=status.HTTP_200_OK, response_model=List[ShowStakeholder])
async def all_project_stakeholder(project_id: str, db: Session = Depends(get_db)):
    stakeholder = db.query(Stakeholder).filter(Stakeholder.active_status == "Active", Stakeholder.project_id == project_id).all()
    return stakeholder

# GET ONE STAKE HOLDER
@router.get('/{id}', status_code=status.HTTP_200_OK, response_model=ShowStakeholder)
async def get_one_stakeholder(id: str, db: Session = Depends(get_db)):
    stakeholder = db.query(Stakeholder).filter(Stakeholder.id == id).first()
    if not stakeholder:
        raise HTTPException(404, 'Stake Holder not found')
    return stakeholder

# CREATE STAKE HOLDER
@router.post('/', status_code=status.HTTP_201_CREATED)
async def create_stakeholder(name: str = Form(...), role: str = Form(...), expectation: str = Form(...), project_id: str = Form(...), db: Session = Depends(get_db)):
    
    to_store = Stakeholder(
        name = name,
        role = role,
        expectation = expectation,
        project_id = project_id,
    )

    db.add(to_store)
    db.commit()
    return {'message': 'Stake Holder stored successfully.'}

# UPDATE STAKE HOLDER
@router.put('/{id}', status_code=status.HTTP_202_ACCEPTED)
async def update_stakeholder(id: str, name: str = Form(...), role: str = Form(...), expectation: str = Form(...), db: Session = Depends(get_db)): 
    if not db.query(Stakeholder).filter(Stakeholder.id == id).update({
        'name': name,
        'role': role,
        'expectation': expectation,
        'updated_at' : dt.utcnow()
    }):
        raise HTTPException(404, 'Stake Holder to update is not found')
    db.commit()
    return {'message': 'Stake Holder updated successfully.'}

# DELETE STAKE HOLDER
@router.delete('/{id}', status_code=status.HTTP_204_NO_CONTENT)
async def delete_stakeholder(id: str, db: Session = Depends(get_db)):
    if not db.query(Stakeholder).filter(Stakeholder.id == id).update({
        'active_status': "Inactive"
    }):
        raise HTTPException(404, 'Stake Holder to delete is not found')
    db.commit()
    return {'message': 'Stake Holder deleted successfully.'}

