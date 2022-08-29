from fastapi import status, HTTPException
from sqlalchemy.orm import Session
from models import procurement as models

from fastapi import HTTPException, status
from schemas.procurement.project_request import ProjectRequest


# get one
def get_one(id,db : Session):
    project_request = db.query(models.ProjectRequestProcurement).filter(models.ProjectRequestProcurement.id == id).first()
    if not project_request:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f'Project Request with the id of {id} is not found')

    return project_request

# get all
def get( status,db : Session):
    project_request = db.query(models.ProjectRequestProcurement).filter(models.ProjectRequestProcurement.approval_status == status).all()
    return project_request

# create
def create(request: ProjectRequest, db : Session):
    new_project_request = models.ProjectRequestProcurement(
        name=request.name,
        background=request.background,
        coverage=request.coverage,
        type=request.type,
        target_beneficiaries=request.target_beneficiaries,
        objectives=request.objectives,
        expected_output=request.expected_output,
        assumptions=request.assumptions,
        constraints=request.constraints,
        cost=request.cost,
        start_date=request.start_date,
        end_date=request.end_date,

        )
    db.add(new_project_request)
    db.commit()
    db.refresh(new_project_request)
    return new_project_request


# delete
def delete(id,db : Session):
    project_request = db.query(models.ProjectRequestProcurement).filter(models.ProjectRequestProcurement.id == id)
    if not project_request.first():
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
        detail=f'Project Request with the {id} is not found')
    project_request.delete(synchronize_session=False)
    db.commit()
    return project_request

# update
def update(id, request: ProjectRequest, db : Session):
    project_request = db.query(models.ProjectRequestProcurement).filter(models.ProjectRequestProcurement.id == id)
    if not project_request.first():
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
        detail=f'Project Request with the {id} is not found')
    project_request.update(
       {
        'name': request.name,
        'background': request.background,
        'coverage':request.coverage,
        'type':request.type,
        'target_beneficiaries':request.target_beneficiaries,
        'objectives':request.objectives,
        'expected_output':request.expected_output,
        'assumptions':request.assumptions,
        'constraints':request.constraints,
        'cost':request.cost,
        'start_date':request.start_date,
        'end_date':request.end_date,

       }
        )
    # project_request.update(request)
    db.commit()
    return 'Updated Succesfully'



