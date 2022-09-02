from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from typing import List
from repository.procurement import terms_of_reference
from database import get_db

from schemas.procurement.terms_of_reference import ShowTermsOfReference, TermsOfReference, TermsOfReferenceUpdateStatus
from models.procurement.terms_of_reference import TermsOfReferenceProcurement
from models.Admin.employeeModel import Employees
from models.project_management.project_model import Project


router = APIRouter(
    prefix="/api/v1/terms-of-reference",
    tags=['Terms of Reference']
)



    
# get all
@router.get('/', response_model=List[ShowTermsOfReference])
def get( db : Session = Depends(get_db)):
    return terms_of_reference.get(db)


@router.get('/vendor/{vendor_id}', response_model=List[ShowTermsOfReference])
def get_vendor_tor(vendor_id, db : Session = Depends(get_db)):
    return terms_of_reference.get_vendor_tor(vendor_id,db)

# get one
@router.get('/{id}', response_model=ShowTermsOfReference)
def get_one(id, db : Session = Depends(get_db)):
    return terms_of_reference.get_one(id,db)

# PROJECT MANAGEMENT ROUTES START
# # GET ALL TERM OF REFERENCE
@router.get('/approved/', status_code=status.HTTP_200_OK, response_model=List[ShowTermsOfReference])
def all_approved_tor(db: Session = Depends(get_db)):
    tor = db.query(TermsOfReferenceProcurement).filter(TermsOfReferenceProcurement.status == "Approved").all()
    return tor

# GET ALL DEPARTMENT APPROVED TOR
@router.get('/department/{id}', status_code=status.HTTP_200_OK, response_model=List[ShowTermsOfReference])
def all_department_approved_tor(id: str, db: Session = Depends(get_db)):
    employee = db.query(Employees).filter(Employees.user_id == id).first()
    projects = db.query(Project).filter(Project.department_id == employee.department_id, Project.active_status == "Active").all()
    tor = []
    for i in range(len(projects)):
        data = db.query(TermsOfReferenceProcurement).filter(TermsOfReferenceProcurement.status == "Approved", TermsOfReferenceProcurement.project_request_id == projects[i].id).all()
        tor.extend(data)
    return tor
# PROJECT MANAGEMENT ROUTES END

# create
@router.post('/', status_code=status.HTTP_201_CREATED)
def create(request: TermsOfReference,db : Session = Depends(get_db)):#
    return terms_of_reference.create(request, db)


# delete
@router.delete('/{id}', status_code=status.HTTP_204_NO_CONTENT)
def delete(id,db : Session = Depends(get_db)):
    return terms_of_reference.delete(id, db)


# update status of terms of reference
@router.put('/{id}', status_code=status.HTTP_202_ACCEPTED)
def update_status(id,request: TermsOfReferenceUpdateStatus,db : Session = Depends(get_db)):
    return terms_of_reference.update_status(id,request, db)

