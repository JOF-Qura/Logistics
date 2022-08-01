from fastapi import status, HTTPException
from sqlalchemy.orm import Session
from models import procurement as models
from fastapi import HTTPException, status
from schemas.procurement.vendor_log_time import VendorLogTime,ShowVendorLogTime
# from schemas.user import User
from datetime import datetime
import socket





# create
def create(request: VendorLogTime, db : Session):#
    new_time_log = models.VendorTimeLog(
        logged_date=datetime.today(),
        logged_type=request.logged_type,
        client_ip=request.client_ip,
        vendor_id=request.vendor_id,
        )
    db.add(new_time_log)
    db.commit()
    db.refresh(new_time_log)
    return new_time_log


# get all
def get(start_date,end_date, vendor_id, db : Session ):#
    if(start_date != "none" and vendor_id != "none"):
        # print("date, status not null")
        time_log = db.query(models.VendorTimeLog).filter(models.VendorTimeLog.logged_date >= start_date +'T00:00:00').filter(models.VendorTimeLog.logged_date <= end_date+'T23:59:59').filter(models.VendorTimeLog.vendor_id == vendor_id).order_by(models.VendorTimeLog.logged_date.desc()).all()
        
    elif(start_date != "none" and vendor_id == "none"):
        # print("date not null, status null")
        time_log = db.query(models.VendorTimeLog).filter(models.VendorTimeLog.logged_date >= start_date+'T00:00:00').filter(models.VendorTimeLog.logged_date <= end_date+'T23:59:59').order_by(models.VendorTimeLog.logged_date.desc()).all()

    elif(start_date == "none" and vendor_id != "none"):
        # print("status not null, date null")
        time_log = db.query(models.VendorTimeLog).filter(models.VendorTimeLog.vendor_id == vendor_id).order_by(models.VendorTimeLog.logged_date.desc()).all()

    else:
        time_log = db.query(models.VendorTimeLog).order_by(models.VendorTimeLog.logged_date.desc()).all()

    return time_log
    
# get one
def get_one(id, db : Session):#
    time_log = db.query(models.VendorTimeLog).filter(models.VendorTimeLog.id == id).first()
    if not time_log:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f'Vendor Log Time with the id of {id} is not found')
        # response.status_code = status.HTTP_404_NOT_FOUND
        # return {'detail': f'VendorLogTime with the id of {id} is not found'}
    return time_log




# delete
def delete(id,db : Session ):#
    time_log = db.query(models.VendorTimeLog).filter(models.VendorTimeLog.id == id)
    if not time_log.first():
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
        detail=f'Vendor Log Time with the {id} is not found')
    time_log.delete(synchronize_session=False)
    db.commit()
    return time_log
