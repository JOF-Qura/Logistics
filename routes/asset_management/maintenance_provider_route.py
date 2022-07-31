  
from fastapi import APIRouter, Depends, HTTPException, Cookie
from sqlalchemy.orm import Session
from schemas.asset_management.maintenance_provider_schema import CreateMaintenanceProvider
from models.asset_management.maintenance_provider_model import Maintenance_provider
from database import get_db
# from dependencies import get_token


router = APIRouter(
    prefix='/asset_management/api/Maintenance_Provider',
    tags=['Maintenance_Provider'],
    # dependencies=[Depends(get_token)]
)

@router.get('/')
def all(db: Session = Depends(get_db)):
    maintenance_provider = db.query(Maintenance_provider).filter(Maintenance_provider.active_status == "Active").all()
    return {'data': maintenance_provider}

@router.get('/{id}')
def read(id: str, db: Session = Depends(get_db)):
    maintenance_provider = db.query(Maintenance_provider).filter(Maintenance_provider.maintenance_provider_id == id).first()
    if not maintenance_provider:
        raise HTTPException(404, 'asset provider not found')
    return {'data': maintenance_provider}

@router.post('/')
def add(maintenance_provider: CreateMaintenanceProvider, db: Session = Depends(get_db)):
    try:
        maintenance_provider = Maintenance_provider(
            
            maintenance_provider_name = maintenance_provider.maintenance_provider_name,
            maintenance_provider_contact = maintenance_provider.maintenance_provider_contact,
            maintenance_provider_email = maintenance_provider.maintenance_provider_email,

        )
        db.add(maintenance_provider)
        db.commit()
        return {'message': 'asset provider created successfully.'}
    except Exception as e:
        print(e)

@router.put('/{id}')
def update(id: str, maintenance_provider: CreateMaintenanceProvider, db: Session = Depends(get_db)): 
    if not db.query(Maintenance_provider).filter(Maintenance_provider.maintenance_provider_id == id).update({
        'maintenance_provider_name': maintenance_provider.maintenance_provider_name,
        'maintenance_provider_contact': maintenance_provider.maintenance_provider_contact,
        'maintenance_provider_email': maintenance_provider.maintenance_provider_email,
    }):
        raise HTTPException(404, 'asset provider to update is not found')
    db.commit()
    return {'message': 'asset provider updated successfully.'}

@router.delete('/{id}')
def remove(id: str, db: Session = Depends(get_db)): 
    if not db.query(Maintenance_provider).filter(Maintenance_provider.maintenance_provider_id == id).update({
        'active_status': 'Inactive',
    }):
        raise HTTPException(404, 'asset provider to delete is not found')
    db.commit()
    return {'message': 'asset provider removed successfully.'}