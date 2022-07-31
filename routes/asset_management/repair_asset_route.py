  
from fastapi import APIRouter, Depends, HTTPException, Cookie
from sqlalchemy.orm import Session
from schemas.asset_management.repair_asset_schema import CreateRepair
from schemas.asset_management.asset_schema import UpdateStatus
from models.asset_management.repair_asset_model import Repair_Asset
from models.asset_management.asset_model import Asset
from database import get_db
# from dependencies import get_token


router = APIRouter(
    prefix='/asset_management/api/repair_asset',
    tags=['Repair_asset'],
    # dependencies=[Depends(get_token)]
)

# @router.get('/{id}')
# def read(id: str, db: Session = Depends(get_db)):
#     event = db.query(Events).filter(Events.asset_id == id).order_by(Events.created_at.desc()).all()
#     if not event:
#         raise HTTPException(404, 'events not found')
#     return {'data': event}

@router.post('/')
def add(repair_asset_schema: CreateRepair, db: Session = Depends(get_db)):
    try:
        repair_asset_schema = Repair_Asset(
            
            asset_id = repair_asset_schema.asset_id,
            assigned_to = repair_asset_schema.assigned_to,
            repair_date = repair_asset_schema.repair_date,
            repair_price = repair_asset_schema.repair_price,
            remarks = repair_asset_schema.remarks,
            created_by = repair_asset_schema.created_by,

        )

        db.query(Asset).filter(Asset.asset_id == repair_asset_schema.asset_id).update({
        "asset_remarks" : repair_asset_schema.remarks,
        "asset_status" : "Repair",
        })

        db.add(repair_asset_schema)
        db.commit()
        return {'message': 'Status created successfully.'}
    except Exception as e:
        print(e)

@router.delete('/undo/{id}')
def remove(id: str, db: Session = Depends(get_db)): 
    db.query(Repair_Asset).filter(Repair_Asset.asset_id == id).update({
        'active_status': 'Inactive',
    })
    db.query(Asset).filter(Asset.asset_id == id).update({
        'asset_status': 'Available',
    })
    db.commit()
    return {'message': 'asset status removed successfully.'}

@router.delete('/{id}')
def remove(id: str, db: Session = Depends(get_db)): 
    db.query(Repair_Asset).filter(Repair_Asset.asset_id == id).update({
        'active_status': 'Inactive',
    })
    db.commit()
    return {'message': 'asset status removed successfully.'}