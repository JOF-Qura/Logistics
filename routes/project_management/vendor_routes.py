# from os import stat
# from fastapi import APIRouter, Depends, Request, HTTPException, UploadFile, Form, File, status
# from sqlalchemy.orm import Session
# from sqlalchemy import or_
# from sqlalchemy.sql.expression import desc
# from schemas.project_management.vendor_schema import ShowVendor
# from models.project_management.vendor_model import Vendor
# from database import get_db
# from typing import List
# from controllers.encryption import Hash
# from datetime import datetime as dt
# from controllers.token_controller import get_token

# router = APIRouter(
#     prefix='/vendor',
#     tags=['vendor'],
#     # dependencies=[Depends(get_token)]
# )

# # GET ALL VENDOR
# @router.get('/', status_code=status.HTTP_200_OK, response_model=List[ShowVendor])
# async def all_vendor(db: Session = Depends(get_db)):
#     vendor = db.query(Vendor).all()
#     return vendor

# # GET ONE VENDOR
# @router.get('/{id}', status_code=status.HTTP_200_OK, response_model=ShowVendor)
# async def get_one_vendor(id: str, db: Session = Depends(get_db)):
#     vendor = db.query(Vendor).filter(Vendor.id == id).first()
#     if not vendor:
#         raise HTTPException(404, 'Vendor not found')
#     return vendor

# # CREATE VENDOR
# @router.post('/', status_code=status.HTTP_201_CREATED)
# async def create_vendor(vendor_name: str = Form(...), 
#                     contact_person: str = Form(...), 
#                     contact_no: str = Form(...), 
#                     vendor_website: str = Form(...), 
#                     email: str = Form(...), 
#                     organization_type: str = Form(...),
#                     db: Session = Depends(get_db)):
    
#     to_store = Vendor(
#         vendor_name = vendor_name,
#         contact_person = contact_person,
#         contact_no = contact_no,
#         vendor_website = vendor_website,
#         email = email,
#         organization_type = organization_type,
#     )

#     db.add(to_store)
#     db.commit()

#     vendor = db.query(Vendor).filter(Vendor.id == to_store.id).first()
    
#     return {"data": vendor,
#     'message': 'Vendor svendored successfully.'}

# # UPDATE VENDOR
# @router.put('/{id}', status_code=status.HTTP_202_ACCEPTED)
# async def update_vendor(id: str, 
#                     vendor_name: str = Form(...), 
#                     contact_person: str = Form(...), 
#                     contact_no: str = Form(...), 
#                     vendor_website: str = Form(...), 
#                     email: str = Form(...), 
#                     organization_type: str = Form(...),
#                     db: Session = Depends(get_db)): 
#     if not db.query(Vendor).filter(Vendor.id == id).update({
#         'vendor_name': vendor_name,
#         'contact_person': contact_person,
#         'contact_no': contact_no,
#         'vendor_website': vendor_website,
#         'email': email,
#         'organization_type': organization_type,
#         'updated_at' : dt.utcnow()
#     }):
#         raise HTTPException(404, 'Vendor to update is not found')
#     db.commit()
#     return {'message': 'Vendor updated successfully.'}

# # DELETE VENDOR
# @router.delete('/{id}', status_code=status.HTTP_204_NO_CONTENT)
# async def delete_vendor(id: str, db: Session = Depends(get_db)):
#     if not db.query(Vendor).filter(Vendor.id == id).update({
#         'active_status': "Inactive"
#     }):
#         raise HTTPException(404, 'Vendor to delete is not found')
#     db.commit()
#     return {'message': 'Vendor deleted successfully.'}

