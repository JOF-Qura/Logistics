
from fastapi import APIRouter, Depends, status, Response, File, UploadFile, Form
import shutil, os
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from repository.procurement import product

# from repository import user 
from .. import database
from security import oauth2

from schemas.procurement.product import Product, ProductStatus, ShowProduct
# from schemas.procurement.user import User



from typing import List
router = APIRouter(
    prefix="/api/v1/product",
    tags=['Product']
)
get_db = database.get_db



# get picture of product
# @router.get('/product-pic/{pic}')#, response_model=List[ShowProduct]
# def get_product(pic, db : Session = Depends(get_db)):
#     return product.get_product_pic(pic,db)


# get all
@router.get('/active-products', response_model=List[ShowProduct])#
def get_active( db : Session = Depends(get_db), current_user: User = Depends(oauth2.get_current_user)):
    return product.get_active(db)


# get all
@router.get('/', response_model=List[ShowProduct])#
def get( db : Session = Depends(get_db), current_user: User = Depends(oauth2.get_current_user)):
    return product.get(db)



# create
# @router.post('/', status_code=status.HTTP_201_CREATED)
# def create(product_name: str = Form(...),category_id: str = Form(...), product_pic:UploadFile = File(...), description:str = Form(...),estimated_price:str = Form(...), db : Session = Depends(get_db), current_user: User = Depends(oauth2.get_current_user)):
#     return product.create(product_name,category_id,product_pic,description,estimated_price,db) 
@router.post('/', status_code=status.HTTP_201_CREATED)
def create(product_name: str = Form(...),category_id: str = Form(...), description:str = Form(...),estimated_price:str = Form(...), db : Session = Depends(get_db), current_user: User = Depends(oauth2.get_current_user)):
    return product.create(product_name,category_id,description,estimated_price,db)

# delete
@router.delete('/{id}', status_code=status.HTTP_204_NO_CONTENT)
def delete(id,request: ProductStatus,db : Session = Depends(get_db), current_user: User = Depends(oauth2.get_current_user)):
    return product.delete(id,request,db)


# update
@router.put('/{id}',status_code=status.HTTP_202_ACCEPTED)
def update(id, request: Product, db : Session = Depends(get_db), current_user: User = Depends(oauth2.get_current_user)):
    return product.update(id,request, db)


# get one
@router.get('/{id}', status_code=status.HTTP_200_OK, response_model=ShowProduct)
def get_one(id, db : Session = Depends(get_db), current_user: User = Depends(oauth2.get_current_user)):
    return product.get_one(id, db)
