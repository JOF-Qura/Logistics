
from fastapi import status, HTTPException
from sqlalchemy.orm import Session
from .. import database, models
from app.security import oauth2

from datetime import datetime
from fastapi import HTTPException, status
from app.schemas.rfq_vendor import RFQVendor, RFQVendorStatus


# get one rfq - all vendor
def get_one(rfq_id,vendor_id,db : Session):
    rfq = db.query(models.RequestQuotation).join(models.RequestQuotationVendor).filter(models.RequestQuotation.id == rfq_id).first()
    vendor = db.query(models.Vendor).filter(models.Vendor.id == vendor_id).all()
    # if not rfq_vendor:
    #     raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f'RFQVendor with the id of {vendor_id} is not found')

    return {'request_quotation':rfq,'vendor':vendor}

# get all
def get(vendor_id,pr_id, db : Session):
    rfq_vendor = db.query(models.RequestQuotationVendor).filter(models.RequestQuotationVendor.vendor_id == vendor_id).filter(models.RequestQuotationVendor.rfq_pr_id == pr_id).all()
    return rfq_vendor

# create
def create(request: RFQVendor, db : Session):
    # if db.query(models.RequestQuotationVendor).filter_by(rfq_pr_id = request.request_quotation_id).count()>0:
    #     raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f'You have already sent this prop')

    new_rfq_vendor = models.RequestQuotationVendor(
        vendor_id=request.vendor_id,
        request_quotation_id=request.request_quotation_id,
        rfq_pr_id=request.rfq_pr_id,
    )
    db.add(new_rfq_vendor)
    db.commit()
    db.refresh(new_rfq_vendor)

    # create notification
    new_notif = models.Notification(
    vendor_id=request.vendor_id,
    notif_to="vendor",
    title="Request For Quotation",
    description="You have new request for quotation",

    status="unread",

        )
    db.add(new_notif)
    db.commit()
    db.refresh(new_notif)

    return new_rfq_vendor


# delete
def delete(rfq_id,vendor_id,db : Session):
    rfq_vendor = db.query(models.RequestQuotationVendor).filter(models.RequestQuotationVendor.request_quotation_id == rfq_id).filter(models.RequestQuotationVendor.vendor_id == vendor_id)
    if not rfq_vendor.first():
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
        detail=f'RFQVendor with the {vendor_id} is not found')
    rfq_vendor.delete(synchronize_session=False)
    db.commit()
    return rfq_vendor

# update
def update(rfq_id,vendor_id, request: RFQVendorStatus, db : Session):
    rfq_vendor = db.query(models.RequestQuotationVendor).filter(models.RequestQuotationVendor.request_quotation_id == rfq_id).filter(models.RequestQuotationVendor.vendor_id == vendor_id)
    if not rfq_vendor.first():
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
        detail=f'RFQVendor with the {vendor_id} is not found')
    rfq_vendor.update(
       {
        'rfq_status' : request.rfq_status,
        'approver_name' : request.approver_name,
        'approval_date' : datetime.now(),
        'reject_reason' : request.reject_reason,
       }
        )
    # rfq_vendor.update(request)
    db.commit()
    return rfq_vendor.first()


# get number of request quotations
def get_request_quotations_count(vendor_id, db : Session ):
    rfq_vendor = db.query(models.RequestQuotationVendor).\
        filter(models.RequestQuotationVendor.vendor_id  == vendor_id).\
        count()
    return rfq_vendor
