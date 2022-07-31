  
from fastapi import APIRouter, Depends, HTTPException, Cookie
from sqlalchemy.orm import Session
from schemas.asset_management.asset_type_schema import CreateAssetType
from models.asset_management.asset_type_model import Asset_Type
from database import get_db
# from dependencies import get_token


router = APIRouter(
    prefix='/asset_management/api/Asset_Type',
    tags=['Asset_Type'],
    # dependencies=[Depends(get_token)]
)

@router.get('/')
def all(db: Session = Depends(get_db)):
    asset_type = db.query(Asset_Type).filter(Asset_Type.active_status == "Active").all()
    return {'data': asset_type}

@router.get('/{id}')
def read(id: str, db: Session = Depends(get_db)):
    asset_type = db.query(Asset_Type).filter(Asset_Type.asset_type_id == id).first()
    if not asset_type:
        raise HTTPException(404, 'asset type not found')
    return {'data': asset_type}

@router.post('/')
def add(asset_type: CreateAssetType, db: Session = Depends(get_db)):
    try:
        asset_type = Asset_Type(
            
            asset_type_title = asset_type.asset_type_title,
            description = asset_type.description

        )
        db.add(asset_type)
        db.commit()
        return {'message': 'asset type created successfully.'}
    except Exception as e:
        print(e)

@router.put('/{id}')
def update(id: str, asset_type: CreateAssetType, db: Session = Depends(get_db)): 
    if not db.query(Asset_Type).filter(Asset_Type.asset_type_id == id).update({
        'asset_type_title': asset_type.asset_type_title,
        'description': asset_type.description,
    }):
        raise HTTPException(404, 'asset to update is not found')
    db.commit()
    return {'message': 'asset updated successfully.'}

@router.delete('/{id}')
def remove(id: str, db: Session = Depends(get_db)): 
    if not db.query(Asset_Type).filter(Asset_Type.asset_type_id == id).update({
        'active_status': 'Inactive',
    }):
        raise HTTPException(404, 'asset type to delete is not found')
    db.commit()
    return {'message': 'asset type removed successfully.'}
# def remove(id: str, db: Session = Depends(get_db)):
#     if not db.query(Asset_Type).filter(Asset_Type.asset_type_id == id).delete():
#         raise HTTPException(404, 'asset to delete is not found')
#     db.commit()
#     return {'message': 'asset type removed successfully.'}