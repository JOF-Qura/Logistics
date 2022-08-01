from fastapi import status, HTTPException
from sqlalchemy.orm import Session
from models import procurement as models
from fastapi import HTTPException, status

from schemas.procurement.vendor_audit_trail import VendorAuditTrail,ShowVendorAuditTrail
# from schemas.user import User
from datetime import datetime


# create
def create(request: VendorAuditTrail, db : Session):#
    new_audit_trail = models.VendorAuditTrail(
        crud=request.crud,
        table=request.table,
        payload=request.payload,
        client_ip=request.client_ip,
        vendor_id=request.vendor_id,
        )
    db.add(new_audit_trail)
    db.commit()
    db.refresh(new_audit_trail)
    return new_audit_trail


# get all
def get(start_date,end_date, vendor_id, db : Session ):#
    # audit_trail = db.query(models.VendorAuditTrail).all()
    if(start_date != "none" and vendor_id != "none"):
        print("date, status not null")
        audit_trail = db.query(models.VendorAuditTrail).filter(models.VendorAuditTrail.created_at >= start_date +'T00:00:00').filter(models.VendorAuditTrail.created_at <= end_date+'T23:59:59').filter(models.VendorAuditTrail.vendor_id == vendor_id).order_by(models.VendorAuditTrail.created_at.desc()).all()
            
    elif(start_date != "none" and vendor_id == "none"):
        print("date not null, status null")
        audit_trail = db.query(models.VendorAuditTrail).filter(models.VendorAuditTrail.created_at >= start_date+'T00:00:00').filter(models.VendorAuditTrail.created_at <= end_date+'T23:59:59').order_by(models.VendorAuditTrail.created_at.desc()).all()

    elif(start_date == "none" and vendor_id != "none"):
        print("status not null, date null")
        audit_trail = db.query(models.VendorAuditTrail).filter(models.VendorAuditTrail.vendor_id == vendor_id).order_by(models.VendorAuditTrail.created_at.desc()).all()

    else:
        audit_trail = db.query(models.VendorAuditTrail).order_by(models.VendorAuditTrail.created_at.desc()).all()

    return audit_trail
    

# get one
def get_one(id, db : Session):#
    audit_trail = db.query(models.VendorAuditTrail).filter(models.VendorAuditTrail.id == id).first()
    if not audit_trail:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f'Vendor Audit Trail with the id of {id} is not found')
    return audit_trail




# delete
def delete(id,db : Session ):#
    audit_trail = db.query(models.VendorAuditTrail).filter(models.VendorAuditTrail.id == id)
    if not audit_trail.first():
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
        detail=f'Vendor Audit Trail with the {id} is not found')
    audit_trail.delete(synchronize_session=False)
    db.commit()
    return audit_trail
