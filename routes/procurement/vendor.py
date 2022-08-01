from fastapi import status, HTTPException,APIRouter, Depends, BackgroundTasks,File, UploadFile,Form
from sqlalchemy.orm import Session

from starlette.responses import JSONResponse

from typing import List
from repository.procurement import vendor
from database import get_db

from schemas.procurement.vendor import Vendor,ShowVendor,BlacklistVendor,ShowBlacklistVendor, VendorStatus
import aiohttp
#dotenv
from dotenv import dotenv_values
# Email credentials 
credentials = dotenv_values(".env")

router = APIRouter(
    prefix="/api/v1/vendor",
    tags=['Vendor']
)







# get vendor logo
@router.get('/vendor-pic/{pic}')#, response_model=List[ShowProduct]
def get_vendor_pic(pic, db : Session = Depends(get_db)):
    return vendor.get_vendor_pic(pic,db)


# get all venors
@router.get('/', response_model=List[ShowVendor])
def get( db : Session = Depends(get_db)):
    return vendor.get(db)

# get all pending applications
@router.get('/pending', response_model=List[ShowVendor])
def get_pending( db : Session = Depends(get_db)):
    return vendor.get_pending(db)
    

# create vendor
@router.post('/', status_code=status.HTTP_201_CREATED)
def create( vendor_name:str = Form(...),
                vendor_website:str = Form(...),
                region:str = Form(...),
                province:str = Form(...),
                municipality:str = Form(None),
                barangay:str = Form(None),
                street:str = Form(...),
                organization_type:str = Form(...),
                category_id:str = Form(...),
                contact_person:str = Form(...),
                contact_no:str = Form(...),
                email:str = Form(...),
                # password:str = Form(...),
                vendor_logo:UploadFile = File(...),
                db : Session = Depends(get_db)):
    return vendor.create(vendor_name, vendor_website,
                        region, province, municipality, barangay, street, 
                        organization_type, category_id, contact_person, contact_no,
                        email, #password,
                        vendor_logo,
                        db)
    

# blacklist vendor
@router.post('/blacklist/', status_code=status.HTTP_202_ACCEPTED)#HTTP_204_NO_CONTENT
def blacklist(request: BlacklistVendor,db : Session = Depends(get_db)):
    return vendor.blacklist(request,db)
    

# update vendor
@router.put('/{id}',status_code=status.HTTP_202_ACCEPTED)
def update(id, vendor_name:str = Form(...),
                vendor_website:str = Form(...),
                region:str = Form(...),
                province:str = Form(...),
                municipality:str = Form(None),
                barangay:str = Form(None),
                street:str = Form(...),
                organization_type:str = Form(...),
                category_id:str = Form(...),
                contact_person:str = Form(...),
                contact_no:str = Form(...),
                email:str = Form(...),
                # password:str = Form(...),
                vendor_logo:UploadFile = File(...),
                db : Session = Depends(get_db)):
   return vendor.update(id,vendor_name, vendor_website,
                        region, province, municipality, barangay, street, 
                        organization_type, category_id, contact_person, contact_no,
                        email, #password,
                        vendor_logo,
                        db)

# update vendor status
@router.put('/status/{id}',status_code=status.HTTP_202_ACCEPTED)
def update_vendor_status(id, request: VendorStatus, db : Session = Depends(get_db)):
    return vendor.update_vendor_status(id, request, db)


# get one vendor
@router.get('/{id}', status_code=status.HTTP_200_OK, response_model=ShowVendor)
def get_one(id, db : Session = Depends(get_db)):
    return vendor.get_one(id, db)
    

# get one
@router.get('/charts/count')
def get_count(db : Session = Depends(get_db)):
    return vendor.get_count(db)
    


# get filitered vendors by region,city, municipality
@router.get('/filtered/vendor/reports/{region}/{province}/{municipality}/{vendor_status}', response_model=List[ShowVendor])
def get_filtered_vendor_reports( region,province,municipality,vendor_status,db : Session = Depends(get_db)):
    return vendor.get_filtered_vendor_reports(region,province,municipality,vendor_status,db)


# Get api psgc regions 
@router.get("/psgc/api/regions")
async def psgc_regions():
    async with aiohttp.ClientSession() as session:
        async with session.get("https://psgc.gitlab.io/api/regions") as resp:
            data = await resp.json(content_type=None)
            # do something with data
            return data


# Get api psgc provinces 
@router.get("/psgc/api/regions/{code}/provinces")
async def psgc_provinces(code):
    async with aiohttp.ClientSession() as session:
        if code != "130000000":
            async with session.get("https://psgc.gitlab.io/api/regions/"+code+"/provinces") as resp:
                data = await resp.json(content_type=None)
        else:
            async with session.get("https://psgc.gitlab.io/api/districts") as resp:
                data = await resp.json(content_type=None)
               
        return data 

# Get api psgc cities municipalities 
@router.get("/psgc/api/provinces/{code}/cities-municipalities")
async def psgc_municipalities(code):
    async with aiohttp.ClientSession() as session:
        if code != "130000000":
            async with session.get("https://psgc.gitlab.io/api/provinces/"+code+"/cities-municipalities") as resp:
                data = await resp.json(content_type=None)
        else:
            async with session.get("https://psgc.gitlab.io/api/districts/"+code+"/cities") as resp:
                data = await resp.json(content_type=None)
               
        return data 

# Get api psgc barangays 
@router.get("/psgc/api/cities-municipalities/{code}/barangays")
async def psgc_barangays(code):
    async with aiohttp.ClientSession() as session:
        async with session.get("https://psgc.gitlab.io/api/cities-municipalities/"+code+"/barangays") as resp:
            data = await resp.json(content_type=None)

               
        return data 

    

# get all blacklisted vendors
@router.get('/blacklist/reports/{start_date}/{end_date}')
def get_all_blacklisted(start_date,end_date, db : Session = Depends(get_db)):
    return vendor.get_all_blacklisted(start_date,end_date,db)


# send email
# @router.post('/send{name}/{recipiant}/{email}')
# def sendMails(name, recipient, email,db: Session = Depends(get_db)):
#     return vendor.send_mail(name, recipient, email,db)
