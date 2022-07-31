  
from fastapi import APIRouter, Depends, HTTPException, Cookie
from sqlalchemy.orm import Session
from schemas.asset_management.asset_warranty_schema import WarrantyBase, CreateWarranty
from models.asset_management.asset_warranty_model import Asset_Warranty
from database import get_db
# from dependencies import get_token


router = APIRouter(
    prefix='/asset_management/api/Asset_warranty',
    tags=['Asset_Warranty'],
    # dependencies=[Depends(get_token)]
)

@router.get('/asset_warranty/{id}')
def all(id: str, db: Session = Depends(get_db)):
    warranty = db.query(Asset_Warranty).filter(Asset_Warranty.active_status == "Active", 
                                                Asset_Warranty.asset_id == id).all()
    return {'data': warranty}

@router.get('/{id}')
def read(id: str, db: Session = Depends(get_db)):
    requests = db.query(Asset_Warranty).filter(Asset_Warranty.warranty_id == id).first()
    if not requests:
        raise HTTPException(404, 'request not found')
    return {'data': requests}

@router.post('/')
def add(request_schema: CreateWarranty, db: Session = Depends(get_db)):
    try:
        request_schema = Asset_Warranty(

            asset_id = request_schema.asset_id,
            warranty_length = request_schema.warranty_length,
            expiration_date = request_schema.expiration_date,
            warranty_contact = request_schema.warranty_contact,
            warranty_email = request_schema.warranty_email,
            warranty_note = request_schema.warranty_note,
            created_by = request_schema.created_by,

        )
        db.add(request_schema)
        db.commit()
        return {'message': 'warranty created successfully.'}
    except Exception as e:
        print(e)
        
@router.delete('/{id}')
def remove(id: str, db: Session = Depends(get_db)): 
    db.query(Asset_Warranty).filter(Asset_Warranty.warranty_id == id).update({
        'active_status': 'Inactive',
    })
    db.commit()
    return {'message': 'warranty removed successfully.'}