  
from fastapi import APIRouter, Depends, HTTPException, Cookie
from sqlalchemy.orm import Session
from schemas.asset_management.request_asset_schema import RequestBase, CreateRequest, UpdateStatusRequest
from models.asset_management.request_asset_model import Request_Asset
from database import get_db
# from dependencies import get_token


router = APIRouter(
    prefix='/asset_management/api/Request_asset',
    tags=['Request_Asset'],
    # dependencies=[Depends(get_token)]
)

@router.get('/')
def all(db: Session = Depends(get_db)):
    requests = db.query(Request_Asset).filter(Request_Asset.active_status == "Active").all()
    return {'data': requests}

@router.get('/requests_by_employee/{id}')
def all(id: str, db: Session = Depends(get_db)):
    requests = db.query(Request_Asset).filter(Request_Asset.active_status == "Active", 
                                                Request_Asset.created_by == id).all()
    return {'data': requests}

@router.get('/{id}')
def read(id: str, db: Session = Depends(get_db)):
    requests = db.query(Request_Asset).filter(Request_Asset.request_id == id).first()
    if not requests:
        raise HTTPException(404, 'request not found')
    return {'data': requests}

@router.post('/')
def add(request_schema: CreateRequest, db: Session = Depends(get_db)):
    try:
        request_schema = Request_Asset(

            asset_type_id = request_schema.asset_type_id,
            request_brand = request_schema.request_brand,
            request_model = request_schema.request_model,
            request_description = request_schema.request_description,
            request_status = "Pending",
            created_by = request_schema.created_by,

        )
        db.add(request_schema)
        db.commit()
        return {'message': 'request created successfully.'}
    except Exception as e:
        print(e)

@router.put('/update_status/{id}')
def update_status(id: str, request_schema: UpdateStatusRequest, db: Session = Depends(get_db)): 
    if not db.query(Request_Asset).filter(Request_Asset.request_id == id).update({
        'request_status': request_schema.request_status,
        'request_remark': request_schema.request_remark,
        'updated_by': request_schema.updated_by,
    }):
        raise HTTPException(404, 'request to update is not found')
    db.commit()
    return {'message': 'request updated successfully.'}

@router.put('/{id}')
def update_status(id: str, request_schema: RequestBase, db: Session = Depends(get_db)): 
    if not db.query(Request_Asset).filter(Request_Asset.request_id == id).update({
        'asset_type_id': request_schema.asset_type_id,
        'request_brand': request_schema.request_brand,
        'request_model': request_schema.request_model,
        'request_description': request_schema.request_description,
        'request_status': request_schema.request_status,
    }):
        raise HTTPException(404, 'request to update is not found')
    db.commit()
    return {'message': 'request updated successfully.'}

@router.delete('/{id}')
def remove(id: str, db: Session = Depends(get_db)): 
    if not db.query(Request_Asset).filter(Request_Asset.request_id == id).update({
        'active_status': 'Inactive',
    }):
        raise HTTPException(404, 'request to delete is not found')
    db.commit()
    return {'message': 'request removed successfully.'}