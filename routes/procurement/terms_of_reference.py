from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from typing import List
from repository.procurement import terms_of_reference
from database import get_db

from schemas.procurement.terms_of_reference import ShowTermsOfReference, TermsOfReference, TermsOfReferenceUpdateStatus



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

