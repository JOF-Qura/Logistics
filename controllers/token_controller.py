from datetime import datetime, timedelta
from jose import JWTError, jwt
from schemas.project_management import token_schema
from fastapi import Cookie, HTTPException, Depends
from database import get_db

SECRET_KEY = "09d25e094faa6ca2556c818166b7a9563b93f7099f6f0f4caa6cf63b88e8d3e7"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 59


def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


def verify_token(token: str, credentials_exception):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
        token_data = token_schema.TokenData(email=email)
    except JWTError:
        raise credentials_exception
    user = token_data.email
    if user is None:
        raise credentials_exception
    return user

def get_token(token: str = Cookie('token')):
    try:
        user = jwt.decode(token, SECRET_KEY)
        email: str = user.get("sub")
        token_data = token_schema.TokenData(email=email)
        data = token_data.email
        if data:
            return data
    except JWTError:
        raise HTTPException(401, 'Please Log In first')
