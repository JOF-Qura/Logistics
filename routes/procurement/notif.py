from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from typing import List
from repository.procurement import notif
from .. import database
from security import oauth2

from schemas.procurement.notif import Notif,ShowNotif, UpdateNotif
from schemas.procurement.user import User

router = APIRouter(
    prefix="/api/v1/notification",
    tags=['Notification']
)
get_db = database.get_db



# get all vendor notif
@router.get('/vendor/{vendor_id}/{notif_to}', response_model=List[ShowNotif])
def get_vendor_notif(vendor_id,notif_to, db : Session = Depends(get_db),current_user: User = Depends(oauth2.get_current_user)):#, current_user: User = Depends(oauth2.get_current_user)
    return notif.get_vendor_notif(vendor_id,notif_to,db)

# get all procurement notif
@router.get('/procurement/{notif_to}/{department_id}', response_model=List[ShowNotif])
def get_proc_notif(notif_to,department_id, db : Session = Depends(get_db),current_user: User = Depends(oauth2.get_current_user)):#, current_user: User = Depends(oauth2.get_current_user)
    return notif.get_proc_notif(notif_to,department_id,db)

# create
@router.post('/', status_code=status.HTTP_201_CREATED)
def create(request: Notif, db : Session = Depends(get_db)):#, current_user: User = Depends(oauth2.get_current_user)
    return notif.create(request, db)


# delete
@router.delete('/{id}', status_code=status.HTTP_204_NO_CONTENT)
def delete(id,db : Session = Depends(get_db),current_user: User = Depends(oauth2.get_current_user)):#, current_user: User = Depends(oauth2.get_current_user)
    return notif.delete(id, db)


# update vendor notif
@router.put('/{vendor_id}',status_code=status.HTTP_202_ACCEPTED)
def update_vendor_notif(vendor_id, request: UpdateNotif, db : Session = Depends(get_db),current_user: User = Depends(oauth2.get_current_user)):#, current_user: User = Depends(oauth2.get_current_user)
    return notif.update_vendor_notif(vendor_id, request, db)

# update procurement notif

@router.put('/procurement/{notif_to}/{department_id}',status_code=status.HTTP_202_ACCEPTED)
def update_proc_notif(notif_to,department_id, request: UpdateNotif, db : Session = Depends(get_db),current_user: User = Depends(oauth2.get_current_user)):#, current_user: User = Depends(oauth2.get_current_user)
    return notif.update_proc_notif(notif_to,department_id, request, db)


# get one
@router.get('/{vendor_id}/{id}', status_code=status.HTTP_200_OK, response_model=ShowNotif)
def get_one(id, db : Session = Depends(get_db), current_user: User = Depends(oauth2.get_current_user)):
    return notif.get_one(id, db)
    