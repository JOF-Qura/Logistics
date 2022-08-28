from fastapi import APIRouter, Depends, Response, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models.asset_management.user_model import User
from schemas.asset_management.auth_schema import TokenData, AuthForm
from schemas.asset_management.user_schema import CreateUser
from schemas.Admin.employeeSchema import ShowEmployee
from models.Admin.employeeModel import Employees
from jose import jwt
from passlib.context import CryptContext
from typing import List

secret = 'a very shady secret'
pwd_context = CryptContext(schemes=['bcrypt'], deprecated='auto')

def password_verify(plain, hashed):
    return pwd_context.verify(plain, hashed)

def password_hash(password):
    return pwd_context.hash(password)

router = APIRouter(
    prefix='/auth',
    tags=['Auth']
)

@router.get('/')
def all(db: Session = Depends(get_db)):
    users = db.query(User).filter(User.active_status == "Active").all()
    return {'data': users}

@router.get('/{id}')
def read(id: str, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.user_id == id).first()
    if not user:
        raise HTTPException(404, 'user not found')
    return {'data': user}

# PROJECT MANAGEMENT NEEDED ROUTE
# GET ALL DEPARTMENT USER
@router.get('/department/{department_id}', response_model = List[ShowEmployee])
async def get_all_user_department(department_id: str, db: Session = Depends(get_db)):
    user = db.query(Employees).filter(Employees.job.has(title="Project Officer"), Employees.department_id == department_id).all()
    if not user:
        raise HTTPException(404, 'No Project Officer')
    return user
# PROJECT MANAGEMENT NEEDED ROUTE

@router.post('/register')
def register(request: CreateUser, db: Session = Depends(get_db)):
    try:
        request.user_password = password_hash(request.user_password)
        user = User(
            user_name = request.user_name,
            user_email = request.user_email,
            user_password = request.user_password,
            user_type = request.user_type,
            department_id = request.department_id,
        )
        db.add(user)
        db.commit()
        return {'message': 'Registered Successfully!'}
    except Exception as e:
        print(e)

@router.post('/verify')
def verify(form: AuthForm, response: Response, db: Session = Depends(get_db)):
    try:
        user = db.query(User).filter(User.user_email == form.user_email).first()
        if not user:
            return 404
        elif user:
            match = password_verify(form.user_password, user.user_password)
            if not match:
                return 4041
            if match:
                data = TokenData(user_name = user.user_name,
                                user_email = user.user_email,
                                user_id = user.user_id,
                                user_type = user.user_type)
                token = jwt.encode(dict(data), secret)
                access_token = jwt.encode(dict(data), secret)
                response.set_cookie('token', token, httponly=True)
                return {'user':user, 'token': token, 'access_token': access_token, 'message': 'Log In Success!'}
        
        return {'message': 'User not found.'}
    except Exception as e:
        print(e)

@router.post('/logout')
def logout(response: Response):
    response.delete_cookie('token')
    response.delete_cookie('id')
    response.delete_cookie('email')
    response.delete_cookie('type')
    return {'message': 'Logout Success!'}

@router.put('/{id}')
def update(id: str, user: CreateUser, db: Session = Depends(get_db)):
    hashed_pass = password_hash(user.user_name)
    if not db.query(User).filter(User.user_id == id).update({
        'user_name': user.user_name,
        'user_email': user.user_email,
        'user_password': hashed_pass,
        'user_type': user.user_type,
        'department_id': user.department_id,
    }):
        raise HTTPException(404, 'user to update is not found')
    db.commit()
    return {'message': 'user updated successfully.'}

@router.delete('/{id}')
def remove(id: str, db: Session = Depends(get_db)): 
    if not db.query(User).filter(User.user_id == id).update({
        'active_status': 'Inactive',
    }):
        raise HTTPException(404, 'User to delete is not found')
    db.commit()
    return {'message': 'user removed successfully.'}