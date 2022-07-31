  
from fastapi import APIRouter, Depends, HTTPException, Cookie
from sqlalchemy.orm import Session
from schemas.asset_management.event_schema import CreateEvent
from models.asset_management.event_model import Events
from database import get_db
# from dependencies import get_token


router = APIRouter(
    prefix='/asset_management/api/Event',
    tags=['Event'],
    # dependencies=[Depends(get_token)]
)

@router.get('/{id}')
def read(id: str, db: Session = Depends(get_db)):
    event = db.query(Events).filter(Events.asset_id == id).order_by(Events.created_at.desc()).all()
    if not event:
        raise HTTPException(404, 'events not found')
    return {'data': event}

@router.post('/')
def add(event: CreateEvent, db: Session = Depends(get_db)):
    try:
        asset_type = Events(
            
            asset_id = event.asset_id,
            event_title = event.event_title,
            event_message = event.event_message,

        )
        db.add(asset_type)
        db.commit()
        return {'message': 'event created successfully.'}
    except Exception as e:
        print(e)