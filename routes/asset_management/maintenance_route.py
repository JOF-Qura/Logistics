  
from fastapi import APIRouter, Depends, HTTPException, Cookie
from sqlalchemy.orm import Session
from schemas.asset_management.maintenance_schema import CreateMaintenance, UpdateMaintenance, CompleteMaintenance
from models.asset_management.maintenance_model import Maintenance
from database import get_db
from datetime import date
from dateutil.relativedelta import *
# from dependencies import get_token


router = APIRouter(
    prefix='/asset_management/api/Maintenance',
    tags=['Maintenance'],
    # dependencies=[Depends(get_token)]
)

@router.get('/')
def all(db: Session = Depends(get_db)):
    maintenance = db.query(Maintenance).filter(Maintenance.active_status == "Active").all()
    return {'data': maintenance}

@router.get('/dashboard/due_today')
def all(db: Session = Depends(get_db)):
    maintenance = db.query(Maintenance).filter(Maintenance.maintenance_due == date.today(),
                                               Maintenance.active_status == "Active",
                                               Maintenance.maintenance_status == "Pending").count()
    return {'data': maintenance}

@router.get('/dashboard/due_this_month')
def all(db: Session = Depends(get_db)):
    maintenance = db.query(Maintenance).filter(Maintenance.maintenance_due.between(date.today(), date.today()+relativedelta(months=+1) ),
                                               Maintenance.active_status == "Active",
                                               Maintenance.maintenance_status == "Pending").count()
    return {'data': maintenance}

@router.get('/dashboard/pastdue_this_month')
def all(db: Session = Depends(get_db)):
    maintenance = db.query(Maintenance).filter(Maintenance.maintenance_due.between(date.today()+relativedelta(months=-1), date.today()+relativedelta(days=-1) ),
                                               Maintenance.active_status == "Active",
                                               Maintenance.maintenance_status == "Pending").count()
    return {'data': maintenance}

@router.get('/view/{id}')
def find_one(id: str, db: Session = Depends(get_db)):
    maintenance = db.query(Maintenance).filter(Maintenance.maintenance_id == id).first()
    return {'data': maintenance}

@router.get('/{id}')
def read(id: str, db: Session = Depends(get_db)):
    maintenance = db.query(Maintenance).filter(Maintenance.asset_id == id, Maintenance.active_status == "Active" ).all()
    return {'data': maintenance}


@router.post('/')
def add(maintenance: CreateMaintenance, db: Session = Depends(get_db)):
    try:
        maintenance = Maintenance(

            maintenance_provider_id = maintenance.maintenance_provider_id,
            asset_id = maintenance.asset_id,
            maintenance_name = maintenance.maintenance_name,
            maintenance_details = maintenance.maintenance_details,
            maintenance_cost = maintenance.maintenance_cost,
            maintenance_day = maintenance.maintenance_day,
            maintenance_due = maintenance.maintenance_due,
            maintenance_completed = maintenance.maintenance_completed,
            maintenance_repeatable = maintenance.maintenance_repeatable,
            maintenance_status = maintenance.maintenance_status,


        )
        db.add(maintenance)
        db.commit()
        return {'message': 'asset maintenance created successfully.'}
    except Exception as e:
        print(e)

@router.put('/complete/{id}')
def update(id: str, maintenance: CompleteMaintenance, db: Session = Depends(get_db)):
    if not db.query(Maintenance).filter(Maintenance.maintenance_id == id).update({
        'maintenance_cost': maintenance.maintenance_cost,
        'maintenance_due': maintenance.maintenance_due,
        'maintenance_completed': maintenance.maintenance_completed,
        'maintenance_status': maintenance.maintenance_status,
    }):
        raise HTTPException(404, 'asset provider to update is not found')
    db.commit()
    return {'message': 'asset provider updated successfully.'}

@router.put('/{id}')
def update(id: str, maintenance: UpdateMaintenance, db: Session = Depends(get_db)): 
    if not db.query(Maintenance).filter(Maintenance.maintenance_id == id).update({
        'maintenance_name': maintenance.maintenance_name,
        'maintenance_details': maintenance.maintenance_details,
        'maintenance_cost': maintenance.maintenance_cost,
        'maintenance_day': maintenance.maintenance_day,
        'maintenance_due': maintenance.maintenance_due,
        'maintenance_completed': maintenance.maintenance_completed,
        'maintenance_repeatable': maintenance.maintenance_repeatable,
        'maintenance_status': maintenance.maintenance_status,
        'remarks': maintenance.remarks,
    }):
        raise HTTPException(404, 'asset provider to update is not found')
    db.commit()
    return {'message': 'asset provider updated successfully.'}

@router.delete('/{id}')
def remove(id: str, db: Session = Depends(get_db)): 
    if not db.query(Maintenance).filter(Maintenance.maintenance_id == id).update({
        'active_status': 'Inactive',
    }):
        raise HTTPException(404, 'asset provider to delete is not found')
    db.commit()
    return {'message': 'asset provider removed successfully.'}