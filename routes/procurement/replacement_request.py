from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from typing import List
from repository.procurement import replacement_request
from .. import database
from security import oauth2

from schemas.procurement.replacement_request import ReplacementRequest, ReplacementRequestStatus,ShowReplacementRequest
from schemas.user import User


router = APIRouter(
    prefix="/api/v1/replacement-request",
    tags=['Replacement Request']
)
get_db = database.get_db


# get all
@router.get('/', response_model=List[ShowReplacementRequest])
def get( db : Session = Depends(get_db),current_user: User = Depends(oauth2.get_current_user)):#, current_user: User = Depends(oauth2.get_current_user)
    return replacement_request.get(db)

@router.get('/vendor/{vendor_id}', response_model=List[ShowReplacementRequest])
def get_replacement_vendor(vendor_id, db : Session = Depends(get_db),current_user: User = Depends(oauth2.get_current_user)):#, current_user: User = Depends(oauth2.get_current_user)
    return replacement_request.get_replacement_vendor(vendor_id,db)


# create
@router.post('/', status_code=status.HTTP_201_CREATED)
def create(request: ReplacementRequest, db : Session = Depends(get_db)):#, current_user: User = Depends(oauth2.get_current_user)
    return replacement_request.create(request, db)


# delete
@router.delete('/{id}', status_code=status.HTTP_204_NO_CONTENT)
def delete(id,db : Session = Depends(get_db),current_user: User = Depends(oauth2.get_current_user)):#, current_user: User = Depends(oauth2.get_current_user)
    return replacement_request.delete(id, db)


# update
@router.put('/{id}',status_code=status.HTTP_202_ACCEPTED)
def update(id, request: ReplacementRequestStatus, db : Session = Depends(get_db),current_user: User = Depends(oauth2.get_current_user)):#, current_user: User = Depends(oauth2.get_current_user)
    return replacement_request.update(id, request, db)


# get one
@router.get('/{id}', status_code=status.HTTP_200_OK, response_model=ShowReplacementRequest)
def get_one(id, db : Session = Depends(get_db), current_user: User = Depends(oauth2.get_current_user)):
    return replacement_request.get_one(id, db)
    