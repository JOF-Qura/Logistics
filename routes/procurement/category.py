from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
# from repository import user 

from typing import List
from repository.procurement import category
from database import get_db

from schemas.procurement.category import Category, CategoryStatus,ShowCategory,ShowCategoryOnly



router = APIRouter(
    prefix="/api/v1/category",
    tags=['Category']
)




# get all
@router.get('/', response_model=List[ShowCategory])
def get( db : Session = Depends(get_db)):#
    return category.get(db)

# get all
# @router.get('/category_only', response_model=List[ShowCategoryOnly])
# def get( db : Session = Depends(get_db)):#
#     return category.get(db)


# create
@router.post('/', status_code=status.HTTP_201_CREATED)
def create(request: Category, db : Session = Depends(get_db)):
    return category.create(request, db)
    

# delete
@router.delete('/{id}', status_code=status.HTTP_204_NO_CONTENT)
def delete(id,request:CategoryStatus,db : Session = Depends(get_db)):
    return category.delete(id,request, db)


# update
@router.put('/{id}',status_code=status.HTTP_202_ACCEPTED)
def update(id, request: Category, db : Session = Depends(get_db)):
    return category.update(id, request, db)
 

# get one
@router.get('/{id}', status_code=status.HTTP_200_OK, response_model=ShowCategory)
def get_one(id, db : Session = Depends(get_db)):
    return category.get_one(id, db)

