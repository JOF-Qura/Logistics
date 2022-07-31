  
from fastapi import APIRouter, Depends, HTTPException, Cookie
from sqlalchemy.orm import Session
from schemas.asset_management.check_out_schema import CreateCheckOut
from models.asset_management.check_out_model import Asset_check_out
from database import get_db
# from dependencies import get_token


router = APIRouter(
    prefix='/asset_management/api/Check_out',
    tags=['Check_out'],
    # dependencies=[Depends(get_token)]
)

@router.get('/')
def all(db: Session = Depends(get_db)):
    check_out = db.query(Asset_check_out).filter(Asset_check_out.active_status == "Active").all()
    return {'data': check_out}

@router.get('/dashboard/all_checkout')
def all(db: Session = Depends(get_db)):
    check_out = db.query(Asset_check_out).filter(Asset_check_out.active_status == "Active").count()
    return {'data': check_out}

@router.get('/get_all_by_users/{id}')
def read(id: str, db: Session = Depends(get_db)):
    check_out = db.query(Asset_check_out).filter(Asset_check_out.active_status == "Active", Asset_check_out.user_id == id).all()
    return {'data': check_out}

@router.get('/{id}')
def read(id: str, db: Session = Depends(get_db)):
    check_out = db.query(Asset_check_out).filter(Asset_check_out.asset_id == id, Asset_check_out.active_status == "Active").first()
    return {'data': check_out}

@router.post('/')
def add(check_out_schema: CreateCheckOut, db: Session = Depends(get_db)):
    try:
        check_out_schema = Asset_check_out(
            
            asset_id = check_out_schema.asset_id,
            user_id = check_out_schema.user_id,
            department_id = check_out_schema.department_id,
            location = check_out_schema.location,
            check_out_date = check_out_schema.check_out_date,
            check_out_due = check_out_schema.check_out_due,
            remarks = check_out_schema.remarks

        )
        db.add(check_out_schema)
        db.commit()
        return {'message': 'check out created successfully.'}
    except Exception as e:
        print(e)

@router.delete('/{id}')
def remove(id: str, db: Session = Depends(get_db)): 
    if not db.query(Asset_check_out).filter(Asset_check_out.asset_id == id).update({
        'active_status': 'Inactive',
    }):
        raise HTTPException(404, 'check out to delete is not found')
    db.commit()
    return {'message': 'check out removed successfully.'}
# def remove(id: str, db: Session = Depends(get_db)):
#     if not db.query(Asset_Type).filter(Asset_Type.asset_type_id == id).delete():
#         raise HTTPException(404, 'asset to delete is not found')
#     db.commit()
#     return {'message': 'asset type removed successfully.'}