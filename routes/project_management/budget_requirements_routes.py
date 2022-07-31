from os import stat
from fastapi import APIRouter, Depends, Request, HTTPException, UploadFile, Form, File, status
from sqlalchemy.orm import Session
from sqlalchemy import or_
from sqlalchemy.sql.expression import desc
from schemas.project_management.budget_requirements_schema import ShowBudgetRequirements
from models.project_management.budget_requirements_model import BudgetRequirements
from database import get_db
from typing import List, Optional
from controllers.encryption import Hash
from datetime import datetime as dt
from controllers.token_controller import get_token

router = APIRouter(
    prefix='/budget_requirements',
    tags=['budget_requirements'],
    dependencies=[Depends(get_token)]
)

# GET ALL BUDGET REQUIREMENTS
@router.get('/', status_code=status.HTTP_200_OK, response_model=List[ShowBudgetRequirements])
async def all_budget_requirements(db: Session = Depends(get_db)):
    budget_requirements = db.query(BudgetRequirements).filter(BudgetRequirements.active_status == "Active").all()
    return budget_requirements

# GET ALL PROJECT BUDGET REQUIREMENTS
@router.get('/project/{project_id}', status_code=status.HTTP_200_OK, response_model=List[ShowBudgetRequirements])
async def all_project_budget_requirements(project_id: str, db: Session = Depends(get_db)):
    budget_requirements = db.query(BudgetRequirements).filter(BudgetRequirements.active_status == "Active", BudgetRequirements.project_id == project_id).all()
    return budget_requirements

# GET ONE BUDGET REQUIREMENTS
@router.get('/{id}', status_code=status.HTTP_200_OK, response_model=ShowBudgetRequirements)
async def get_one_budget_requirements(id: str, db: Session = Depends(get_db)):
    budget_requirements = db.query(BudgetRequirements).filter(BudgetRequirements.id == id).first()
    if not budget_requirements:
        raise HTTPException(404, 'Budget Requirements not found')
    return budget_requirements

# CREATE BUDGET REQUIREMENTS
@router.post('/', status_code=status.HTTP_201_CREATED)
async def create_budget_requirements(name: str = Form(...), cost: str = Form(...), description: str = Form(...), project_id: Optional[str] = Form(None), concept_paper_id: Optional[str] = Form(None), db: Session = Depends(get_db)):
    
    to_store = BudgetRequirements(
        name = name,
        cost = cost,
        description = description,
        project_id = project_id,
        concept_paper_id = concept_paper_id
    )

    db.add(to_store)
    db.commit()
    return {'message': 'Budget Requirements stored successfully.'}

# UPDATE BUDGET REQUIREMENTS
@router.put('/{id}', status_code=status.HTTP_202_ACCEPTED)
async def update_budget_requirements(id: str, name: str = Form(...), cost: str = Form(...), description: str = Form(...), db: Session = Depends(get_db)): 
    if not db.query(BudgetRequirements).filter(BudgetRequirements.id == id).update({
        'name': name,
        'cost': cost,
        'description': description,
        'updated_at' : dt.utcnow()
    }):
        raise HTTPException(404, 'Budget Requirements to update is not found')
    db.commit()
    return {'message': 'Budget Requirements updated successfully.'}

# DELETE BUDGET REQUIREMENTS
@router.delete('/{id}', status_code=status.HTTP_204_NO_CONTENT)
async def delete_budget_requirements(id: str, db: Session = Depends(get_db)):
    if not db.query(BudgetRequirements).filter(BudgetRequirements.id == id).update({
        'active_status': "Inactive"
    }):
        raise HTTPException(404, 'Budget Requirements to delete is not found')
    db.commit()
    return {'message': 'Budget Requirements deleted successfully.'}

