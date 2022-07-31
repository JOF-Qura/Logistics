from os import stat
from fastapi import APIRouter, Depends, Request, HTTPException, UploadFile, Form, File, status
from sqlalchemy.orm import Session
from sqlalchemy import or_
from sqlalchemy.sql.expression import desc
from schemas.project_management.tor_schema import ShowToR
from models.project_management.tor_model import TermsOfReference
from models.Admin.employeeModel import Employees
from models.project_management.project_model import Project
from database import get_db
from typing import List
from controllers.encryption import Hash
from datetime import datetime as dt
from controllers.token_controller import get_token

router = APIRouter(
    prefix='/tor',
    tags=['tor'],
    # dependencies=[Depends(get_token)]
)

# GET ALL TERM OF REFERENCE
@router.get('/', status_code=status.HTTP_200_OK, response_model=List[ShowToR])
async def all_tor(db: Session = Depends(get_db)):
    tor = db.query(TermsOfReference).filter(TermsOfReference.status == "Approved").all()
    return tor

# GET ALL APPROVED TOR
@router.get('/department/{id}', status_code=status.HTTP_200_OK, response_model=List[ShowToR])
async def all_department_tor(id: str, db: Session = Depends(get_db)):
    employee = db.query(Employees).filter(Employees.user_id == id).first()
    projects = db.query(Project).filter(Project.department_id == employee.department_id, Project.active_status == "Active").all()
    tor = []
    for i in range(len(projects)):
        data = db.query(TermsOfReference).filter(TermsOfReference.status == "Approved", TermsOfReference.project_id == projects[i].id).all()
        tor.extend(data)
    return tor

# GET ONE TERM OF REFERENCE
@router.get('/{id}', status_code=status.HTTP_200_OK, response_model=ShowToR)
async def get_one_tor(id: str, db: Session = Depends(get_db)):
    tor = db.query(TermsOfReference).filter(TermsOfReference.id == id).first()
    if not tor:
        raise HTTPException(404, 'Term of Reference not found')
    return tor

# CREATE TERM OF REFERENCE
@router.post('/', status_code=status.HTTP_201_CREATED)
async def create_tor(
                    # title: str = Form(...), 
                    background: str = Form(...), 
                    objective: str = Form(...), 
                    scope_of_service: str = Form(...), 
                    tor_deliverables: str = Form(...), 
                    qualifications: str = Form(...), 
                    reporting_and_working_arrangements: str = Form(...), 
                    tor_annex_technical_specifications: str = Form(...), 
                    tor_annex_key_experts: str = Form(...), 
                    # source_of_funds: str = Form(...), 
                    tor_annex_deliverables: str = Form(...), 
                    tor_annex_terms_conditions: str = Form(...),
                    prepared_by: str = Form(...),  
                    status: str = Form(...), 
                    project_id: str = Form(...), 
                    vendor_id: str = Form(...), 
                    db: Session = Depends(get_db)):
    
    to_store = TermsOfReference(
        # title = title,
        background = background,
        objective = objective,
        scope_of_service = scope_of_service,
        tor_deliverables = tor_deliverables,
        qualifications = qualifications,
        reporting_and_working_arrangements = reporting_and_working_arrangements,
        tor_annex_technical_specifications = tor_annex_technical_specifications,
        tor_annex_key_experts = tor_annex_key_experts,
        # source_of_funds = source_of_funds,
        tor_annex_deliverables = tor_annex_deliverables,
        tor_annex_terms_conditions = tor_annex_terms_conditions,
        prepared_by = prepared_by,
        status = status,
        project_id = project_id,
        vendor_id = vendor_id,
    )

    db.add(to_store)
    db.commit()

    tor = db.query(TermsOfReference).filter(TermsOfReference.id == to_store.id).first()
    
    return {"data": tor,
    'message': 'Term of Reference stored successfully.'}

# UPDATE TERM OF REFERENCE
@router.put('/{id}', status_code=status.HTTP_202_ACCEPTED)
async def update_tor(id: str, 
                    title: str = Form(...), 
                    background: str = Form(...), 
                    objective: str = Form(...), 
                    scope_of_service: str = Form(...), 
                    tor_deliverables: str = Form(...), 
                    qualifications: str = Form(...), 
                    reporting_and_working_arrangements: str = Form(...), 
                    tor_annex_technical_specifications: str = Form(...), 
                    tor_annex_key_experts: str = Form(...), 
                    source_of_funds: str = Form(...), 
                    tor_annex_deliverables: str = Form(...), 
                    tor_annex_terms_conditions: str = Form(...), 
                    status: str = Form(...), 
                    project_id: str = Form(...), 
                    vendor_id: str = Form(...), 
                    db: Session = Depends(get_db)): 
    if not db.query(TermsOfReference).filter(TermsOfReference.id == id).update({
        'title': title,
        'background': background,
        'objective': objective,
        'scope_of_service': scope_of_service,
        'tor_deliverables': tor_deliverables,
        'qualifications': qualifications,
        'reporting_and_working_arrangements': reporting_and_working_arrangements,
        'tor_annex_technical_specifications': tor_annex_technical_specifications,
        'tor_annex_key_experts': tor_annex_key_experts,
        'source_of_funds': source_of_funds,
        'tor_annex_deliverables': tor_annex_deliverables,
        'tor_annex_terms_conditions': tor_annex_terms_conditions,
        'status': status,
        'project_id': project_id,
        'vendor_id': vendor_id,
        'updated_at' : dt.utcnow()
    }):
        raise HTTPException(404, 'Term of Reference to update is not found')
    db.commit()
    return {'message': 'Term of Reference updated successfully.'}

# DELETE TERM OF REFERENCE
@router.delete('/{id}', status_code=status.HTTP_204_NO_CONTENT)
async def delete_tor(id: str, db: Session = Depends(get_db)):
    if not db.query(TermsOfReference).filter(TermsOfReference.id == id).update({
        'active_status': "Inactive"
    }):
        raise HTTPException(404, 'Term of Reference to delete is not found')
    db.commit()
    return {'message': 'Term of Reference deleted successfully.'}

