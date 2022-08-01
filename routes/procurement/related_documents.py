from fastapi import APIRouter, Depends, status,File, UploadFile,Form
from sqlalchemy.orm import Session
from typing import List, Optional
from repository.procurement import related_documents
from database import get_db

from schemas.procurement.related_documents import RelatedDocuments,ShowRelatedDocuments
# from schemas.procurement.user import User


router = APIRouter(
    prefix="/api/v1/related-documents",
    tags=['Related Documents']
)


# get all
@router.get('/', response_model=List[ShowRelatedDocuments])
def get( db : Session = Depends(get_db)):#
    return related_documents.get(db)


@router.get('/related-file/{file}')#, response_model=List[ShowProduct]
def get_one_file(file, db : Session = Depends(get_db)):
    return related_documents.get_one_file(file,db)

# create
@router.post('/', status_code=status.HTTP_201_CREATED)
def create(attachment:UploadFile = File(...),request_quotation_id:Optional[str] = Form(None),vendor_proposal_id:Optional[str] = Form(None),terms_of_reference_id:Optional[str] = Form(None), db : Session = Depends(get_db)):#
    return related_documents.create(attachment,request_quotation_id,vendor_proposal_id,terms_of_reference_id,db)


# delete
@router.delete('/{id}', status_code=status.HTTP_204_NO_CONTENT)
def delete(id,db : Session = Depends(get_db)):#
    return related_documents.delete(id, db)


# update
@router.put('/{id}',status_code=status.HTTP_202_ACCEPTED)
def update(id, request: RelatedDocuments, db : Session = Depends(get_db)):#
    return related_documents.update(id, request, db)


# get one
@router.get('/{id}', status_code=status.HTTP_200_OK, response_model=ShowRelatedDocuments)
def get_one(id, db : Session = Depends(get_db)):
    return related_documents.get_one(id, db)
    