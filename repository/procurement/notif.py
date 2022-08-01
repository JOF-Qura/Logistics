from operator import or_
from fastapi import status, HTTPException
from sqlalchemy.orm import Session
from models import procurement as models
from fastapi import HTTPException, status
from schemas.procurement.notif import Notif, ShowNotif, UpdateNotif


# get one
def get_one(id,db : Session):
    notif = db.query(models.Notification).filter(models.Notification.id == id).first()
    if not notif:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f'Notif with the id of {id} is not found')

    return notif

# get all notif for vendor
def get_vendor_notif(vendor_id, notif_to,db : Session):
    notif = db.query(models.Notification).filter(models.Notification.vendor_id == vendor_id).filter(models.Notification.notif_to == notif_to).order_by(models.Notification.id.desc()).all()
    return notif
    
# get all notif for departments
def get_proc_notif(notif_to,department_id, db : Session):
    if notif_to != "procurement_officer":
        notif = db.query(models.Notification).filter(models.Notification.notif_to == notif_to).filter(models.Notification.department_id == department_id).order_by(models.Notification.id.desc()).all()
    else:
        notif = db.query(models.Notification).filter(models.Notification.notif_to == notif_to).order_by(models.Notification.id.desc()).all()

    return notif



# create
def create(request: Notif, db : Session):
    new_notif = models.Notification(
        request_quotation_id=request.request_quotation_id,
        vendor_id=request.vendor_id,
        status=request.status,
        description =request.description

        )
    db.add(new_notif)
    db.commit()
    db.refresh(new_notif)
    return new_notif


# delete
def delete(id,db : Session):
    notif = db.query(models.Notification).filter(models.Notification.id == id)
    if not notif.first():
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
        detail=f'Notif with the {id} is not found')
    notif.delete(synchronize_session=False)
    db.commit()
    return notif

# update vendor notif
def update_vendor_notif(vendor_id, request: UpdateNotif, db : Session):
    notif = db.query(models.Notification).filter(models.Notification.vendor_id == vendor_id)
    if not notif.first():
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
        detail=f'Notif with the {vendor_id} is not found')
    notif.update(
       {
        'status' : request.status,

       }
        )
    # notif.update(request)
    db.commit()
    return 'Updated Succesfully'

# update procurement notif
def update_proc_notif(notif_to,department_id, request: UpdateNotif, db : Session):
    try:
        if notif_to != "procurement_officer":
            notif = db.query(models.Notification).filter(models.Notification.notif_to == notif_to).filter(models.Notification.department_id == department_id)
        
        else:
            notif = db.query(models.Notification).filter(models.Notification.notif_to == notif_to)

        if not notif.first():
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
            detail=f'Notif with the {notif_to} is not found')
        notif.update(
        {
            'status' : request.status,

        }
            )

        db.commit()
    except Exception as e:
        print(e)
    return 'Updated Succesfully'
