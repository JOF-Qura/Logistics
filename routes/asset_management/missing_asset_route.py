  
from fastapi import APIRouter, Depends, HTTPException, Cookie
from sqlalchemy.orm import Session
from schemas.asset_management.missing_asset_schema import CreateMissing
from schemas.asset_management.asset_schema import UpdateStatus
from models.asset_management.missing_asset_model import Missing_Asset
from models.asset_management.asset_model import Asset
from database import get_db
# from dependencies import get_token


router = APIRouter(
    prefix='/asset_management/api/missing_asset',
    tags=['Missing_Asset'],
    # dependencies=[Depends(get_token)]
)

# @router.get('/{id}')
# def read(id: str, db: Session = Depends(get_db)):
#     event = db.query(Events).filter(Events.asset_id == id).order_by(Events.created_at.desc()).all()
#     if not event:
#         raise HTTPException(404, 'events not found')
#     return {'data': event}

@router.post('/')
def add(missing_asset: CreateMissing, db: Session = Depends(get_db)):
    try:
        missing_asset_schema = Missing_Asset(
            
            asset_id = missing_asset.asset_id,
            remarks = missing_asset.remarks,
            missing_date = missing_asset.missing_date,
            created_by = missing_asset.created_by,

        )

        db.query(Asset).filter(Asset.asset_id == missing_asset_schema.asset_id).update({
        "asset_remarks" : missing_asset_schema.remarks,
        "asset_status" : "Missing",
        })

        db.add(missing_asset_schema)
        db.commit()
        return {'message': 'Status created successfully.'}
    except Exception as e:
        print(e)

@router.delete('/undo/{id}')
def remove(id: str, db: Session = Depends(get_db)): 
    db.query(Missing_Asset).filter(Missing_Asset.asset_id == id).update({
        'active_status': 'Inactive',
    })
    db.query(Asset).filter(Asset.asset_id == id).update({
        'asset_status': 'Available',
    })
    db.commit()
    return {'message': 'asset status removed successfully.'}

@router.delete('/{id}')
def remove(id: str, db: Session = Depends(get_db)): 
    db.query(Missing_Asset).filter(Missing_Asset.asset_id == id).update({
        'active_status': 'Inactive',
    })
    db.commit()
    return {'message': 'asset status removed successfully.'}