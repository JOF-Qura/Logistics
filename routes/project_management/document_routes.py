from os import stat
from fastapi import APIRouter, Depends, Request, HTTPException, UploadFile, Form, File, status
from sqlalchemy.orm import Session
from sqlalchemy import or_
from sqlalchemy.sql.functions import user
from schemas.project_management.document_schema import ShowDocument
from models.project_management.document_model import Document
from database import get_db
import shutil
from typing import List
from controllers.encryption import Hash
from controllers.token_controller import get_token

router = APIRouter(
    prefix='/document',
    tags=['document'],
    dependencies=[Depends(get_token)]
)

# GET ALL DOCUMENT
@router.get('/', status_code=status.HTTP_200_OK)
async def all_documents(db: Session = Depends(get_db)):
    documents = db.query(Document).filter(Document.active_status == "Active").all()
    return documents

# GET ONE DOCUMENT
@router.get('/{id}', status_code=status.HTTP_200_OK, response_model=ShowDocument)
async def get_one_document(id: str, db: Session = Depends(get_db)):
    document = db.query(Document).filter(Document.id == id).first()
    if not document:
        raise HTTPException(404, 'Document not found')
    return document

# CREATE DOCUMENT
@router.post('/', status_code=status.HTTP_201_CREATED)
async def create_document(project_id: str = Form(...), file: UploadFile = File(...), db: Session = Depends(get_db)):
    file_location = f"documents/{file.filename}"
    with open(file_location, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    file = file.filename

    to_store = Document(
        project_id = project_id,
        file = file
    )

    db.add(to_store)
    db.commit()
    return {'message': 'Document stored successfully.'}

# DELETE DOCUMENT
@router.delete('/{id}', status_code=status.HTTP_204_NO_CONTENT)
async def delete_document(id: str, db: Session = Depends(get_db)):
    if not db.query(Document).filter(Document.id == id).update({
        'active_status': "Inactive"
    }):
        raise HTTPException(404, 'Document to delete is not found')
    db.commit()
    return {'message': 'Document deleted successfully.'}

