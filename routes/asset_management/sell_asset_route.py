  
from fastapi import APIRouter, Depends, HTTPException, Cookie
from sqlalchemy.orm import Session
from schemas.asset_management.sell_asset_schema import CreateSell
from schemas.asset_management.asset_schema import UpdateStatus
from models.asset_management.sell_asset_model import Sell_Asset
from models.asset_management.asset_model import Asset
from database import get_db
# from dependencies import get_token


router = APIRouter(
    prefix='/asset_management/api/sell_asset',
    tags=['Sell_asset'],
    # dependencies=[Depends(get_token)]
)

# @router.get('/{id}')
# def read(id: str, db: Session = Depends(get_db)):
#     event = db.query(Events).filter(Events.asset_id == id).order_by(Events.created_at.desc()).all()
#     if not event:
#         raise HTTPException(404, 'events not found')
#     return {'data': event}

@router.post('/')
def add(sell_asset_schema: CreateSell, db: Session = Depends(get_db)):
    try:
        sell_asset_schema = Sell_Asset(
            
            asset_id = sell_asset_schema.asset_id,
            sell_to = sell_asset_schema.sell_to,
            sell_to_contact = sell_asset_schema.sell_to_contact,
            sell_to_email = sell_asset_schema.sell_to_email,
            sell_date = sell_asset_schema.sell_date,
            sell_price = sell_asset_schema.sell_price,
            remarks = sell_asset_schema.remarks,
            created_by = sell_asset_schema.created_by,

        )

        db.query(Asset).filter(Asset.asset_id == sell_asset_schema.asset_id).update({
        "asset_remarks" : sell_asset_schema.remarks,
        "asset_status" : "Sold",
        })

        db.add(sell_asset_schema)
        db.commit()
        return {'message': 'Status created successfully.'}
    except Exception as e:
        print(e)

@router.delete('/undo/{id}')
def remove(id: str, db: Session = Depends(get_db)): 
    db.query(Sell_Asset).filter(Sell_Asset.asset_id == id).update({
        'active_status': 'Inactive',
    })
    db.query(Asset).filter(Asset.asset_id == id).update({
        'asset_status': 'Available',
    })
    db.commit()
    return {'message': 'asset status removed successfully.'}

@router.delete('/{id}')
def remove(id: str, db: Session = Depends(get_db)): 
    db.query(Sell_Asset).filter(Sell_Asset.asset_id == id).update({
        'active_status': 'Inactive',
    })
    db.commit()
    return {'message': 'asset status removed successfully.'}