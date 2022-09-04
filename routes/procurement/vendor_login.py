from fastapi import APIRouter, Depends, status, HTTPException
from sqlalchemy.orm.session import Session
from fastapi.security import OAuth2PasswordRequestForm
from security_procurement.hashing import Hash
from security_procurement import token

from models import procurement as models
from database import get_db

router = APIRouter(
    tags=['Authentication']
)



@router.post('/homies/vendor-login')
def login(request:OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    # vendor = db.query(models.Vendor).filter(models.Vendor.email == request.username).first()
    vendor = db.query(models.VendorProcurement).filter(models.VendorProcurement.email == request.username).first()


    if not vendor:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f'Vendor does not exist')
    if not Hash.verify(vendor.password, request.password):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f'Invalid Password')
    #generate  jwt token
    access_token = token.create_access_token(data={"sub": vendor.email, "id": vendor.id})
    return { "data":vendor, "access_token": access_token, "token_type": "bearer"}
 
    