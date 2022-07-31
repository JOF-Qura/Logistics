  
from fastapi import APIRouter, Depends, HTTPException, Cookie
from sqlalchemy.orm import Session
from schemas.asset_management.check_in_schema import CreateCheckIn
from models.asset_management.check_in_model import Asset_check_in
from models.asset_management.check_out_model import Asset_check_out
from database import get_db
# from dependencies import get_token


router = APIRouter(
    prefix='/asset_management/api/Check_in',
    tags=['Check_in'],
    # dependencies=[Depends(get_token)]
)

@router.get('/')
def all(db: Session = Depends(get_db)):
    check_in = db.query(Asset_check_in).filter(Asset_check_in.active_status == "Active").all()
    return {'data': check_in}

@router.get('/{id}')
def read(id: str, db: Session = Depends(get_db)):
    check_in = db.query(Asset_check_in).filter(Asset_check_in.check_in_id == id, Asset_check_in.active_status == "Active").first()
    return {'data': check_in}

@router.post('/')
def add(check_in_schema: CreateCheckIn, db: Session = Depends(get_db)):
    try:
        check_in_schema = Asset_check_in(
            
            check_out_id = check_in_schema.check_out_id,
            return_date = check_in_schema.return_date,
            return_location = check_in_schema.return_location,
            remarks = check_in_schema.remarks

        )
        
        db.query(Asset_check_out).filter(Asset_check_out.check_out_id == check_in_schema.check_out_id, Asset_check_out.active_status == "Active").update({
        "active_status" : "Inactive",
        })
        
        db.add(check_in_schema)
        db.commit()
        return {'message': 'check in created successfully.'}
    except Exception as e:
        print(e)

# def remove(id: str, db: Session = Depends(get_db)):
#     if not db.query(Asset_Type).filter(Asset_Type.asset_type_id == id).delete():
#         raise HTTPException(404, 'asset to delete is not found')
#     db.commit()
#     return {'message': 'asset type removed successfully.'}