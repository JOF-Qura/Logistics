  
from fastapi import APIRouter, Depends, HTTPException, Cookie
from sqlalchemy.orm import Session
from schemas.asset_management.asset_schema import CreateAsset, UpdateAsset
from models.asset_management.asset_model import Asset
from database import get_db
# from dependencies import get_token


router = APIRouter(
    prefix='/asset_management/api/Asset',
    tags=['Asset'],
    # dependencies=[Depends(get_token)]
)

@router.get('/')
def all(db: Session = Depends(get_db)):
    asset = db.query(Asset).filter(Asset.active_status == "Active").all()
    return {'data': asset}

@router.get('/dashboard/all_status')
def all(db: Session = Depends(get_db)):
    asset = db.query(Asset.asset_status).filter(Asset.active_status == "Active").all()
    return {'data': asset}

@router.get('/dashboard/value_all_asset')
def all(db: Session = Depends(get_db)):
    asset = db.query(Asset.asset_cost).filter(Asset.active_status == "Active", Asset.asset_status != "Sold").all()
    return {'data': asset}

@router.get('/dashboard/all_asset')
def all(db: Session = Depends(get_db)):
    asset = db.query(Asset).filter(Asset.active_status == "Active", Asset.asset_status != "Sold").count()
    return {'data': asset}

@router.get('/dashboard/avail')
def all(db: Session = Depends(get_db)):
    asset = db.query(Asset).filter(Asset.asset_status == "Available", Asset.active_status == "Active").count()
    return {'data': asset}

@router.get('/creation')
def creation(db: Session = Depends(get_db)):
    asset = db.query(Asset).order_by(Asset.created_at.desc()).first()
    return {'data': asset}


@router.get('/{id}')
def read(id: str, db: Session = Depends(get_db)):
    asset = db.query(Asset).filter(Asset.asset_id == id).first()
    if not asset:
        raise HTTPException(404, 'asset not found')
    return {'data': asset}

@router.post('/')
def add(asset: CreateAsset, db: Session = Depends(get_db)):
    try:
        asset_schema = Asset(
            
            asset_provider_id = asset.asset_provider_id,
            asset_type_id = asset.asset_type_id,
            # user_id = asset.user_id,
            # department_id = asset.department_id,
            asset_cost = asset.asset_cost,
            # asset_number = asset.asset_number,
            asset_title = asset.asset_title,
            asset_description = asset.asset_description,
            asset_brand = asset.asset_brand,
            asset_model = asset.asset_model,
            asset_serial = asset.asset_serial,
            asset_acquisition = asset.asset_acquisition,
            acquisition_date = asset.acquisition_date,
            # asset_status = asset.asset_status,
            created_by = asset.created_by,

        )

        db.add(asset_schema)
        db.commit()
        return {'message': 'asset created successfully.'}
    except Exception as e:
        print(e)

@router.put('/{id}')
def update(id: str, asset: UpdateAsset, db: Session = Depends(get_db)): 
    if not db.query(Asset).filter(Asset.asset_id == id).update({
        'asset_provider_id': asset.asset_provider_id,
        'asset_type_id': asset.asset_type_id,
        # 'user_id': asset.user_id,
        # 'department_id': asset.department_id,
        # 'asset_number': asset.asset_number,
        'asset_cost': asset.asset_cost,
        'asset_title': asset.asset_title,
        'asset_brand': asset.asset_brand,
        'asset_model': asset.asset_model,
        'asset_serial': asset.asset_serial,
        'asset_acquisition': asset.asset_acquisition,
        'acquisition_date': asset.acquisition_date,
    }):
        raise HTTPException(404, 'asset to update is not found')
    db.commit()
    return {'message': 'asset updated successfully.'}

@router.delete('/{id}')
def remove(id: str, db: Session = Depends(get_db)): 
    if not db.query(Asset).filter(Asset.asset_id == id).update({
        'active_status': 'Inactive',
    }):
        raise HTTPException(404, 'asset to delete is not found')
    db.commit()
    return {'message': 'asset removed successfully.'}



