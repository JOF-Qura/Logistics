from fastapi import APIRouter, Depends, status, HTTPException
from sqlalchemy.orm.session import Session
from fastapi.security import OAuth2PasswordRequestForm
from app.security.hashing import Hash
from app.security import token

from .. import database,models

router = APIRouter(
    tags=['Authentication']
)



@router.post('/homies/vendor-login')
def login(request:OAuth2PasswordRequestForm = Depends(), db: Session = Depends(database.get_db)):
    # vendor = db.query(models.Vendor).filter(models.Vendor.email == request.username).first()
    user = db.query(models.User).filter(models.User.email == request.username).filter(models.User.vendor_id != "").first()


    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f'Vendor does not exist')
    if not Hash.verify(user.password, request.password):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f'Invalid Password')
    #generate  jwt token
    vendor = db.query(models.Vendor).filter(models.Vendor.id == user.vendor_id).first()
    access_token = token.create_access_token(data={"sub": user.email, "id": user.id})
    return { "data": user,"vendor":vendor, "access_token": access_token, "token_type": "bearer"}
 
    