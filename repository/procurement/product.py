from fastapi import status, HTTPException, Response,UploadFile
from sqlalchemy.orm import Session
from sqlalchemy.sql.sqltypes import DECIMAL
from .. import database, models
from app.security import oauth2

from fastapi import HTTPException, status
import shutil, os
from fastapi.responses import FileResponse
from app.schemas.product import Product,ProductStatus


# # get product pic
# def get_product_pic(pic, db : Session ):
#     dirname = os.getcwd()
#     return FileResponse(f"{dirname}/media/products/{pic}")


# get all
def get_active( db : Session ):
    product = db.query(models.Product).filter(models.Product.status != "Inactive").all()
    return product


# get all
def get( db : Session ):
    # product = db.query(models.Product).all()
    product = db.query(models.Product).filter(models.Product.status != "Inactive").all()

    return product

# create
def create(product_name: str,category_id: int, description: str,estimated_price: DECIMAL, db : Session ):#product_pic: UploadFile,
    # dirname = os.getcwd()
    # with open(f"{dirname}/media/products/"+product_pic.filename, "wb+") as image:
    #     shutil.copyfileobj(product_pic.file, image)
    # url = str(product_pic.filename)
    new_product = models.Product(
        product_name=product_name,
        category_id=category_id,
        # product_pic = url,
        description = description,
        estimated_price = estimated_price
        )
    db.add(new_product)
    db.commit()
    db.refresh(new_product)
    return new_product

# delete
def delete(id,request:ProductStatus,db : Session ):
    product = db.query(models.Product).filter(models.Product.id == id)
    if not product.first():
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
        detail=f'Product with the {id} is not found')
    # product.delete(synchronize_session=False)
    product.update({'status':request.status})

    db.commit()
    return 'Delete Successfully'

# update
def update(id, request: Product, db : Session ):
    product = db.query(models.Product).filter(models.Product.id == id)
    if not product.first():
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
        detail=f'Product with the {id} is not found')
    product.update(
       {
        # 'product_pic' : request.product_pic,
        'product_name' : request.product_name,
        'category_id' : request.category_id,
        'description' : request.description,
        'estimated_price' : request.estimated_price
       }
        )
    db.commit()
    return 'Updated Succesfully'

# get one
def get_one(id, db : Session ):
    product = db.query(models.Product).filter(models.Product.id == id).first()
    if not product:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f'Product with the id of {id} is not found')
    return product