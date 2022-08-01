from datetime import date
from fastapi import UploadFile, status, HTTPException
from sqlalchemy.orm import Session
from models import procurement as models

from fastapi import HTTPException, status
from schemas.procurement.utility import Utilities
import shutil, os
from os.path import exists
from fastapi.responses import FileResponse

dirname = os.getcwd()
# get one
def get_one(id,db : Session):
    utility = db.query(models.Utilities).filter(models.Utilities.id == id).first()
    if not utility:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f'Utility with the id of {id} is not found')

    return utility

#  get related file
def get_one_file(file, db : Session ):
    dirname = os.getcwd()
    if os.path.exists(f"{dirname}/media/utilities/{file}") != False:
        print(f"{dirname}/media/utilities/{file}")
        return FileResponse(f"{dirname}/media/utilities/{file}")

# get all
def get( db : Session):
    utility = db.query(models.Utilities).all()
    return utility

# create
def create(utility_type:str,utility_amount:float,due_date:date,vendor_id:str,notes:str,attachment:UploadFile,db : Session):
    new_utility = models.Utilities(
        utility_type=utility_type,
        attachment=attachment.filename,
        utility_amount =utility_amount,
        due_date =due_date,
        notes =notes,
        vendor_id =vendor_id,




        )
    db.add(new_utility)
    db.commit()
    db.refresh(new_utility)
    
    with open(f"{dirname}/media/utilities/"+attachment.filename, "wb+") as image:
        # shutil.copyfileobj(file.file, image)
        image.write(attachment.file.read())
    return new_utility


# delete
def delete(id,db : Session):
    utility = db.query(models.Utilities).filter(models.Utilities.id == id)
    if not utility.first():
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
        detail=f'Utility with the {id} is not found')
    # utility.delete(synchronize_session=False)
    utility.update({'status': "Inactive"})

    db.commit()
    return "Deactivated Successfully"

# update
def update(id, utility_type:str,utility_amount:float,due_date:date,vendor_id:str,notes:str,attachment:UploadFile,db : Session):
    utility = db.query(models.Utilities).filter(models.Utilities.id == id)
    if not utility.first():
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
        detail=f'Utility with the {id} is not found')
    utility.update(
       {
        'utility_type' : utility_type,
        'utility_amount': utility_amount,
        'due_date': due_date,
        'notes': notes,
        'vendor_id': vendor_id

        

       }
        )
    # utility.update(request)
    db.commit()
    if(attachment.filename != ""):
        utility.update(
        {
            'attachment':attachment.filename,
        }
            )
        db.commit()

        with open(f"{dirname}/media/utilities/"+attachment.filename, "wb+") as image:
            # shutil.copyfileobj(file.file, image)
            image.write(attachment.file.read())
        
    return 'Updated Succesfully'



