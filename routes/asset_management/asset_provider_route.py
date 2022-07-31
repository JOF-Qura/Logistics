  
from fastapi import APIRouter, Depends, HTTPException, Cookie
from sqlalchemy.orm import Session
from schemas.asset_management.asset_provider_schema import CreateAssetProvider
from models.asset_management.asset_provider_model import Asset_provider
from database import get_db
# from dependencies import get_token


router = APIRouter(
    prefix='/asset_management/api/Asset_Provider',
    tags=['Asset_Provider'],
    # dependencies=[Depends(get_token)]
)

@router.get('/')
def all(db: Session = Depends(get_db)):
    asset_provider = db.query(Asset_provider).filter(Asset_provider.active_status == "Active").all()
    return {'data': asset_provider}

@router.get('/{id}')
def read(id: str, db: Session = Depends(get_db)):
    asset_provider = db.query(Asset_provider).filter(Asset_provider.asset_provider_id == id).first()
    if not asset_provider:
        raise HTTPException(404, 'asset provider not found')
    return {'data': asset_provider}

@router.post('/')
def add(asset_provider: CreateAssetProvider, db: Session = Depends(get_db)):
    try:
        asset_provider = Asset_provider(
            
            asset_provider_name = asset_provider.asset_provider_name,
            asset_provider_contact = asset_provider.asset_provider_contact,
            asset_provider_email = asset_provider.asset_provider_email,

        )
        db.add(asset_provider)
        db.commit()
        return {'message': 'asset provider created successfully.'}
    except Exception as e:
        print(e)

@router.put('/{id}')
def update(id: str, asset_provider: CreateAssetProvider, db: Session = Depends(get_db)): 
    if not db.query(Asset_provider).filter(Asset_provider.asset_provider_id == id).update({
        'asset_provider_name': asset_provider.asset_provider_name,
        'asset_provider_contact': asset_provider.asset_provider_contact,
        'asset_provider_email': asset_provider.asset_provider_email,
    }):
        raise HTTPException(404, 'asset provider to update is not found')
    db.commit()
    return {'message': 'asset provider updated successfully.'}

@router.delete('/{id}')
def remove(id: str, db: Session = Depends(get_db)): 
    if not db.query(Asset_provider).filter(Asset_provider.asset_provider_id == id).update({
        'active_status': 'Inactive',
    }):
        raise HTTPException(404, 'asset provider to delete is not found')
    db.commit()
    return {'message': 'asset provider removed successfully.'}