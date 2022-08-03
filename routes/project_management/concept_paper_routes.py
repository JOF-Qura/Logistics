from os import stat
from fastapi import APIRouter, Depends, Request, HTTPException, UploadFile, Form, File, status
from sqlalchemy.orm import Session
from sqlalchemy import or_
from sqlalchemy.sql.expression import desc
from schemas.project_management.concept_paper_schema import ShowConceptPaper
from models.project_management.concept_paper_model import ConceptPaper
from models.asset_management.user_model import User
from models.Admin.employeeModel import Employees
from database import get_db
from typing import List
from controllers.encryption import Hash
from datetime import datetime as dt
from dependencies import get_token

router = APIRouter(
    prefix='/concept_paper',
    tags=['concept_paper'],
    # dependencies=[Depends(get_token)]
)

# GET ALL CONCEPT PAPER
@router.get('/', status_code=status.HTTP_200_OK, response_model=List[ShowConceptPaper])
async def all_concept_paper(db: Session = Depends(get_db)):
    concept_paper = db.query(ConceptPaper).filter(ConceptPaper.active_status == "Active").all()
    return concept_paper

# GET ALL PROJECT CONCEPT PAPER
@router.get('/project/{paper_id}', status_code=status.HTTP_200_OK, response_model=List[ShowConceptPaper])
async def all_project_concept_paper(paper_id: str, db: Session = Depends(get_db)):
    concept_paper = db.query(ConceptPaper).filter(ConceptPaper.active_status == "Active", ConceptPaper.id == paper_id).all()
    return concept_paper

# GET ALL SPECIFIC APPROVAL STATUS CONCEPT PAPER
@router.get('/approval_status/{approval_status}', status_code=status.HTTP_200_OK, response_model=List[ShowConceptPaper])
async def all_specific_approval_status_projects(approval_status: str, db: Session = Depends(get_db)):
    data = db.query(ConceptPaper).filter(ConceptPaper.active_status == "Active", ConceptPaper.approval_status == approval_status).all()
    return data

# GET ALL DEPARTMENT SPECIFIC APPROVAL STATUS CONCEPT PAPERS
@router.get('/department/approval_status/{approval_status}/{id}', status_code=status.HTTP_200_OK, response_model=List[ShowConceptPaper])
async def all_department_specific_approval_status_projects(id: str, approval_status: str, db: Session = Depends(get_db)):
    employee = db.query(Employees).filter(Employees.user_id == id).first()
    data = db.query(ConceptPaper).filter(ConceptPaper.department_id == employee.department_id, ConceptPaper.active_status == "Active", ConceptPaper.approval_status == approval_status).all()
    return data

# GET ALL DEPARTMENT PROJECT OFFICER SPECIFIC APPROVAL STATUS CONCEPT PAPERS
@router.get('/department/approval_status/project_officer/{approval_status}/{id}', status_code=status.HTTP_200_OK, response_model=List[ShowConceptPaper])
async def all_department_project_officer_specific_approval_status_projects(id: str, approval_status: str, db: Session = Depends(get_db)):
    employee = db.query(Employees).filter(Employees.user_id == id).first()
    data = db.query(ConceptPaper).filter(ConceptPaper.manager_id == employee.employee_id, ConceptPaper.active_status == "Active", ConceptPaper.approval_status == approval_status).all()
    return data

# GET ALL DEPARTMENT CONCEPT PAPERS
@router.get('/department/{id}', status_code=status.HTTP_200_OK, response_model=List[ShowConceptPaper])
async def all_department_project(id: str, db: Session = Depends(get_db)):
    employee = db.query(Employees).filter(Employees.user_id == id).first()
    data = db.query(ConceptPaper).filter(ConceptPaper.department_id == employee.department_id, ConceptPaper.active_status == "Active").all()
    return data

# GET ALL DEPARTMENT PROJECT OFFICER CONCEPT PAPERS
@router.get('/department/project_officer/{id}', status_code=status.HTTP_200_OK, response_model=List[ShowConceptPaper])
async def all_department_project_officer_project(id: str, db: Session = Depends(get_db)):
    employee = db.query(Employees).filter(Employees.user_id == id).first()
    data = db.query(ConceptPaper).filter(ConceptPaper.manager_id == employee.employee_id, ConceptPaper.active_status == "Active").all()
    return data

# GET ALL NOTIFICATION
@router.get('/notification/{notification}', status_code=status.HTTP_200_OK, response_model=List[ShowConceptPaper])
async def all_notification_projects(notification: str, db: Session = Depends(get_db)):
    data = db.query(ConceptPaper).filter(ConceptPaper.active_status == "Active", ConceptPaper.notification == notification).all()
    return data

# GET ALL DEPARTMENT NOTIFICATION
@router.get('/department/notification/{notification}', status_code=status.HTTP_200_OK, response_model=List[ShowConceptPaper])
async def all_department_notification_projects(notification: str, db: Session = Depends(get_db), current_user: User = Depends(get_token)):
    users = db.query(User).filter(User.user_email == current_user).first()
    employee = db.query(Employees).filter(Employees.user_id == users.user_id).first()
    data = db.query(ConceptPaper).filter(ConceptPaper.active_status == "Active", ConceptPaper.department_id == employee.department_id, ConceptPaper.notification == notification).all()
    return data

# GET ONE CONCEPT PAPER
@router.get('/{id}', status_code=status.HTTP_200_OK, response_model=ShowConceptPaper)
async def get_one_concept_paper(id: str, db: Session = Depends(get_db)):
    concept_paper = db.query(ConceptPaper).filter(ConceptPaper.id == id).first()
    if not concept_paper:
        raise HTTPException(404, 'Concept Paper not found')
    return concept_paper

# DEPARTMENT CONCEPT PAPER REQUEST
@router.post('/department/{department_id}/{manager_id}', status_code=status.HTTP_201_CREATED)
async def request_concept_paper(department_id: str, manager_id: str, name: str = Form(...), background: str = Form(...), coverage: str = Form(...), assumptions: str = Form(...), constraints: str = Form(...), target_beneficiaries: str = Form(...), objectives: str = Form(...), expected_output: str = Form(...), cost: int = Form(...), type: str = Form(...), start_date: str = Form(...), end_date: str = Form(...), db: Session = Depends(get_db)):
    try:
        to_store = ConceptPaper(
            department_id = department_id,
            manager_id = manager_id,
            name = name,
            background = background,
            coverage = coverage,
            assumptions = assumptions,
            constraints = constraints,
            target_beneficiaries = target_beneficiaries,
            objectives = objectives,
            expected_output = expected_output,
            type = type,
            cost = cost,
            start_date = start_date,
            end_date = end_date,
            notification = 'Request'
        )
        db.add(to_store)
        db.commit()

        paper = db.query(ConceptPaper).filter(ConceptPaper.id == to_store.id).first()

        return {"data": paper,
                'message': 'Concept Paper stored successfully.'}
    except Exception as e:
        print(e)

# UPDATE CONCEPT PAPER
@router.put('/{id}', status_code=status.HTTP_202_ACCEPTED)
async def update_concept_paper(id: str, name: str = Form(...), cost: str = Form(...), description: str = Form(...), db: Session = Depends(get_db)): 
    if not db.query(ConceptPaper).filter(ConceptPaper.id == id).update({
        'name': name,
        'cost': cost,
        'description': description,
        'updated_at' : dt.utcnow()
    }):
        raise HTTPException(404, 'Concept Paper to update is not found')
    db.commit()
    return {'message': 'Concept Paper updated successfully.'}

# CANCEL CONCEPT PAPER REQUEST
@router.put('/cancel_request/{id}', status_code=status.HTTP_202_ACCEPTED)
async def cancel_request(id: str, db: Session = Depends(get_db)): 
    if not db.query(ConceptPaper).filter(ConceptPaper.id == id).update({
        'approval_status' : "Cancelled",
        'updated_at' : dt.utcnow()
    }):
        raise HTTPException(404, 'Concept Paper to cancel is not found')
    db.commit()
    return {'message': 'Concept Paper cancelled successfully.'}

# APPROVE PROJECT
@router.put('/approve/{id}', status_code=status.HTTP_202_ACCEPTED)
async def approve_concept_paper(id: str, db: Session = Depends(get_db)): 
    try:
        if not db.query(ConceptPaper).filter(ConceptPaper.id == id).update({
            'approval_status' : "Approved",
            'notification' : "Approved",
            'updated_at' : dt.utcnow()
        }):
            raise HTTPException(404, 'Concept Paper to approve is not found')
        db.commit()

        return {'message': 'Concept Paper approved successfully.'}
    except Exception as e:
        print(e)

# REJECT PROJECT
@router.put('/reject/{id}', status_code=status.HTTP_202_ACCEPTED)
async def reject_concept_paper(id: str, remarks: str = Form(...), db: Session = Depends(get_db)): 
    try:
        if not db.query(ConceptPaper).filter(ConceptPaper.id == id).update({
            'approval_status' : "Rejected",
            'remarks' : remarks,
            'notification' : "Rejected",
            'updated_at' : dt.utcnow()
        }):
            raise HTTPException(404, 'Concept Paper to reject is not found')
        db.commit()

        return {'message': 'Concept Paper rejected successfully.'}
    except Exception as e:
        print(e)

# REMOVE NOTIFICATION
@router.put('/notification/{id}', status_code=status.HTTP_202_ACCEPTED)
async def remove_notification(id:str, db: Session = Depends(get_db)): 
    if not db.query(ConceptPaper).filter(ConceptPaper.id == id).update({
        'notification' : "",
        'updated_at' : dt.utcnow()
    }):
        raise HTTPException(404, 'Concept Paper Notification to remove is not found')
    db.commit()
    return {'message': 'Concept Paper Notification removed successfully.'}

# DELETE CONCEPT PAPER
@router.delete('/{id}', status_code=status.HTTP_204_NO_CONTENT)
async def delete_concept_paper(id: str, db: Session = Depends(get_db)):
    if not db.query(ConceptPaper).filter(ConceptPaper.id == id).update({
        'active_status': "Inactive"
    }):
        raise HTTPException(404, 'Concept Paper to delete is not found')
    db.commit()
    return {'message': 'Concept Paper deleted successfully.'}

