from datetime import datetime
from typing import Optional
from aiohttp import request
from fastapi import status, HTTPException,UploadFile

from sqlalchemy.orm import Session
from .. import  database, models
from fastapi import HTTPException, status
from app.schemas.vendor import Vendor,BlacklistVendor, VendorStatus
from app.security.hashing import Hash
import shutil, os
from os.path import exists
from fastapi.responses import FileResponse





# get all vendor
def get( db : Session ):
    vendor = db.query(models.Vendor).all()
    for i in range(len(vendor)):
        if db.query(models.User).filter_by(vendor_id = vendor[i].id).count() > 0:
            vendor[i].has_user = True
        else:
            vendor[i].has_user = False
    return vendor

# get all pending applications
def get_pending( db : Session ):
    vendor = db.query(models.Vendor).filter(models.Vendor.status == "Pending").all()
    return vendor


# get number of vendors
def get_count( db : Session ):
    vendor = db.query(models.Vendor).count()
    return vendor


# get vendor logo
def get_vendor_pic(pic, db : Session ):
    dirname = os.getcwd()
    if os.path.exists(f"{dirname}/media/vendor_logo/{pic}") != False:
        return FileResponse(f"{dirname}/media/vendor_logo/{pic}")

# create vendor
def create( vendor_name:str, vendor_website:str, region:str,
            province:str,
            municipality:Optional[str],
            barangay:Optional[str],
            street:str,
            organization_type:str,
            category_id:str,
            contact_person:str,
            contact_no:str,
            email:str,
            # password:str,
            vendor_logo: UploadFile,
            db : Session,current_user):#

    # print(dirname)
    new_vendor = models.Vendor(
        vendor_logo = vendor_logo.filename,
        vendor_name=vendor_name,
        vendor_website=vendor_website,
        region=region,
        province=province,
        municipality=municipality,
        barangay=barangay,
        street=street,
        organization_type=organization_type,
        category_id=category_id,
        contact_person=contact_person,
        contact_no=contact_no,
        email=email,
        # password=Hash.bycrypt(password),
        # created_by =current_user

        )
    db.add(new_vendor)
    db.commit()
    db.refresh(new_vendor)
    dirname = os.getcwd()
    with open(f"{dirname}/media/vendor_logo/"+vendor_logo.filename, "wb+") as image:
        # shutil.copyfileobj(file.file, image)
        image.write(vendor_logo.file.read())
    return new_vendor

# blacklist vendor
def blacklist(request: BlacklistVendor,db : Session,current_user ):
    # vendor.delete(synchronize_session=False)
    blacklist_vendor = models.VendorBlacklist(
        vendor_name=request.vendor_name,
        email=request.vendor_email,
        remarks=request.remarks,
        vendor_id=request.vendor_id,
        created_by =current_user
        )
    db.add(blacklist_vendor)
    db.commit()
    db.refresh(blacklist_vendor)
    vendor = db.query(models.Vendor).filter(models.Vendor.id == blacklist_vendor.vendor_id)
    if not vendor.first():
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
        detail=f'Vendor with the {blacklist_vendor.vendor_id} is not found')
    vendor.update({'status':"Blacklisted"})
    db.commit()
    return 'Blacklisted Succesfully'


# update vendor
def update(id, vendor_name:str, vendor_website:str, region:str,
            province:str,
            municipality:Optional[str],
            barangay:Optional[str],
            street:str,
            organization_type:str,
            category_id:str,
            contact_person:str,
            contact_no:str,
            email:str,
            # password:str,
            vendor_logo: UploadFile,
            db : Session,current_user):
    vendor = db.query(models.Vendor).filter(models.Vendor.id == id)
    if not vendor.first():
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
        detail=f'Vendor with the {id} is not found')
    vendor.update(
       {
        # 'vendor_logo':vendor_logo.filename,

        'vendor_name':vendor_name,
        'vendor_website':vendor_website,
        'region':region,
        'province':province,
        'municipality':municipality,
        'barangay':barangay,
        'street':street,
        'organization_type':organization_type,
        'category_id':category_id,
        'contact_person':contact_person,
        'contact_no':contact_no,
        'email':email,
        # 'password':Hash.bycrypt(password),
       }
        )
    db.commit()
    dirname = os.getcwd()
    if(vendor_logo.filename != ""):
        vendor.update(
        {
            'vendor_logo':vendor_logo.filename,
        }
            )
        db.commit()

        with open(f"{dirname}/media/vendor_logo/"+vendor_logo.filename, "wb+") as image:
            # shutil.copyfileobj(vendor_logo.filename, image)
            image.write(vendor_logo.file.read())
    return 'Updated Succesfully'


# update vendor status
def update_vendor_status(id, request: VendorStatus, db : Session):
    vendor = db.query(models.Vendor).filter(models.Vendor.id == id)

    if not vendor.first():
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
        detail=f'Vendor with the {id} is not found')
    vendor.update(
       {
        'status' : request.status,

       }
    )
    return 'Updated Succesfully'

# get one vendor
def get_one(id, db : Session ):
    vendor = db.query(models.Vendor).filter(models.Vendor.id == id).first()
    if not vendor:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f'Vendor with the id of {id} is not found')
    return vendor

# get filitered vendors by region,city, municipality
def get_filtered_vendor_reports(region,province,municipality, vendor_status, db : Session):
    # purchase_request = db.query(models.Vendor).filter(models.Vendor.created_at <= start_date or models.Vendor.created_at >= end_date).order_by(models.Vendor.date_requested.desc()).all()
    # print('2021-09-29T11:56:01' < '2021-09-28T')
    # print('2021-09-29'>start_date)
    if(region != "none" and vendor_status != "none"):
        # print("date, status not null")
        vendor = db.query(models.Vendor).filter(models.Vendor.region == region).filter(models.Vendor.status == vendor_status).order_by(models.Vendor.created_at.desc()).all()
        
        if(province != "none"):
            # print("date not null, status null")
            vendor = db.query(models.Vendor).filter(models.Vendor.region == region).filter(models.Vendor.province == province).filter(models.Vendor.status == vendor_status).order_by(models.Vendor.created_at.desc()).all()

            if(municipality != "none"):
                # print("status not null, date null")
                vendor = db.query(models.Vendor).filter(models.Vendor.region == region).filter(models.Vendor.province == province).filter(models.Vendor.municipality == municipality).filter(models.Vendor.status == vendor_status).order_by(models.Vendor.created_at.desc()).all()

    else:
        vendor = db.query(models.Vendor).filter(models.Vendor.status == vendor_status).order_by(models.Vendor.created_at.desc()).all()

    return vendor



# get all blacklisted vendors
def get_all_blacklisted(start_date,end_date, db : Session ):
    if(start_date != "none"):
        bl_vendor = db.query(models.VendorBlacklist).filter(models.VendorBlacklist.created_at >= start_date +'T00:00:00').filter(models.VendorBlacklist.created_at <= end_date+'T23:59:59').all()
    else:
        bl_vendor = db.query(models.VendorBlacklist).all()
    return bl_vendor

