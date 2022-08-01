from typing import Optional
from fastapi import status, HTTPException,File, UploadFile,Form
from sqlalchemy.orm import Session
from models import procurement as models

from fastapi import HTTPException, status
from schemas.procurement.related_documents import RelatedDocuments
import shutil, os

from os.path import exists
from fastapi.responses import FileResponse

# get one
def get_one(id,db : Session):
    related_documents = db.query(models.RelatedDocuments).filter(models.RelatedDocuments.id == id).first()
    if not related_documents:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f'Related Document with the id of {id} is not found')

    return related_documents

#  get related file
def get_one_file(file, db : Session ):
    dirname = os.getcwd()
    if os.path.exists(f"{dirname}/media/related_documents/{file}") != False:
        print(f"{dirname}/media/related_documents/{file}")
        return FileResponse(f"{dirname}/media/related_documents/{file}")

# get all
def get( db : Session):
    related_documents = db.query(models.RelatedDocuments).all()
    return related_documents

# create
def create(attachment:UploadFile, request_quotation_id:Optional[str],vendor_proposal_id:Optional[str],terms_of_reference_id:Optional[str], db:Session):
    new_related_documents = models.RelatedDocuments(
        attachment=attachment.filename,
        request_quotation_id=request_quotation_id,
        vendor_proposal_id =vendor_proposal_id,
        terms_of_reference_id =terms_of_reference_id


        )
    db.add(new_related_documents)
    db.commit()
    db.refresh(new_related_documents)
    dirname = os.getcwd()
    with open(f"{dirname}/media/related_documents/"+attachment.filename, "wb+") as image:
        # shutil.copyfileobj(file.file, image)
        image.write(attachment.file.read())
    return new_related_documents


# delete
def delete(id,db : Session):
    related_documents = db.query(models.RelatedDocuments).filter(models.RelatedDocuments.id == id)
    if not related_documents.first():
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
        detail=f'Related Document with the {id} is not found')
    related_documents.delete(synchronize_session=False)
    db.commit()
    return related_documents

# update
def update(id, request: RelatedDocuments, db : Session):
    related_documents = db.query(models.RelatedDocuments).filter(models.RelatedDocuments.id == id)
    if not related_documents.first():
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
        detail=f'Related Document with the {id} is not found')
    related_documents.update(
       {
        'attachment' : request.attachment,
      

       }
        )
    # related_documents.update(request)
    db.commit()
    return 'Updated Succesfully'



