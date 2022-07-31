  
from fastapi import APIRouter, Depends, HTTPException, Cookie
from sqlalchemy.orm import Session
from schemas.asset_management.dispose_asset_schema import CreateDispose
from models.asset_management.dispose_asset_model import Dispose_Asset
from models.asset_management.asset_model import Asset
from database import get_db
# from dependencies import get_token


router = APIRouter(
    prefix='/asset_management/api/dispose_asset',
    tags=['Dispose_Asset'],
    # dependencies=[Depends(get_token)]
)

# @router.get('/{id}')
# def read(id: str, db: Session = Depends(get_db)):
#     event = db.query(Events).filter(Events.asset_id == id).order_by(Events.created_at.desc()).all()
#     if not event:
#         raise HTTPException(404, 'events not found')
#     return {'data': event}

@router.post('/')
def add(dispose_asset: CreateDispose, db: Session = Depends(get_db)):
    try:
        dispose_asset_schema = Dispose_Asset(
            
            asset_id = dispose_asset.asset_id,
            remarks = dispose_asset.remarks,
            dispose_to = dispose_asset.dispose_to,
            dispose_date = dispose_asset.dispose_date,
            created_by = dispose_asset.created_by,

        )

        db.query(Asset).filter(Asset.asset_id == dispose_asset_schema.asset_id).update({
        "asset_remarks" : dispose_asset_schema.remarks,
        "asset_status" : "Disposed",
        })

        db.add(dispose_asset_schema)
        db.commit()
        return {'message': 'Status created successfully.'}
    except Exception as e:
        print(e)

@router.delete('/undo/{id}')
def remove(id: str, db: Session = Depends(get_db)): 
    db.query(Dispose_Asset).filter(Dispose_Asset.asset_id == id).update({
        'active_status': 'Inactive',
    })
    db.query(Asset).filter(Asset.asset_id == id).update({
        'asset_status': 'Available',
    })
    db.commit()
    return {'message': 'asset status removed successfully.'}

@router.delete('/{id}')
def remove(id: str, db: Session = Depends(get_db)): 
    db.query(Dispose_Asset).filter(Dispose_Asset.asset_id == id).update({
        'active_status': 'Inactive',
    })
    db.commit()
    return {'message': 'asset status removed successfully.'}