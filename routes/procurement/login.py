from fastapi import APIRouter, Depends, status, HTTPException,Response
from sqlalchemy.orm.session import Session
from fastapi.security import OAuth2PasswordRequestForm
from app.security.hashing import Hash
from .. import database
from app.models import user as models
from app.security import token

router = APIRouter(
    tags=['Authentication']
)



@router.post('/login')
def login(response: Response,request:OAuth2PasswordRequestForm = Depends(),db: Session = Depends(database.get_db)):
    user = db.query(models.User).filter(models.User.email == request.username).filter(models.User.employee_id != "").first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f'User does not exist')
    if not Hash.verify(user.password, request.password):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f'Invalid Password')
    #generate  jwt token
    access_token = token.create_access_token(data={"sub": user.email, "id": user.id})
    # response.set_cookie('token', access_token, httponly=True)
    return { "data": user, "employee_type": user.employees.employee_types, "department":user.employees.department, "access_token": access_token, "token_type": "bearer"}
 
    