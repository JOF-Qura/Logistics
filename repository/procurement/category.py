from fastapi import status, HTTPException
from sqlalchemy.orm import Session
from models import procurement as models


from fastapi import HTTPException, status
from schemas.procurement.category import Category, CategoryStatus,ShowCategory


# get all
def get( db : Session):
    category = db.query(models.Category).all()
    return category

# create
def create(request: Category, db : Session):

    try:
        category = models.Category(
        category_name=request.category_name,
        description=request.description,
        )
        db.add(category)
        db.commit()
        db.refresh(category)
        return {'message': 'category created successfully.'}
    except Exception as e:
        print(e)
  



# delete
def delete(id,request:CategoryStatus,db : Session ):
    category = db.query(models.Category).filter(models.Category.id == id)
    if not category.first():
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
        detail=f'Category with the {id} is not found')
    # product.delete(synchronize_session=False)
    category.update({'status':request.status})

    db.commit()
    return 'Delete Successfully'

# update
def update(id, request: Category, db : Session):
    category = db.query(models.Category).filter(models.Category.id == id)
    if not category.first():
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
        detail=f'Category with the {id} is not found')
    category.update(
       {
        'category_name' : request.category_name,
        'description' : request.description,
       }
        )
    # user.update(request)
    db.commit()
    return 'Updated Succesfully'

# get one
def get_one(id, db : Session):
    category = db.query(models.Category).filter(models.Category.id == id).first()
    if not category:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f'Category with the id of {id} is not found')
    return category