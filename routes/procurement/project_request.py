from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from typing import List
from repository.procurement import project_request
from database import get_db

from schemas.procurement.project_request import ProjectRequest,ShowProjectRequest


router = APIRouter(
    prefix="/api/v1/project-request",
    tags=['Project Request']
)


# get all
@router.get('/status/{status}')
def get( status,db : Session = Depends(get_db)):#
    return project_request.get(status,db)


# create
@router.post('/', status_code=status.HTTP_201_CREATED)
def create(request: ProjectRequest, db : Session = Depends(get_db)):#
    return project_request.create(request, db)


# delete
@router.delete('/{id}', status_code=status.HTTP_204_NO_CONTENT)
def delete(id,db : Session = Depends(get_db)):#
    return project_request.delete(id, db)


# update
@router.put('/{id}',status_code=status.HTTP_202_ACCEPTED)
def update(id, request: ProjectRequest, db : Session = Depends(get_db)):#
    return project_request.update(id, request, db)


# get one
@router.get('/{id}', status_code=status.HTTP_200_OK, response_model=ShowProjectRequest)
def get_one(id, db : Session = Depends(get_db)):
    return project_request.get_one(id, db)
    