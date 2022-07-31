from pydantic import BaseModel

class TokenData(BaseModel):
    user_email: str
    user_name: str
    user_type: str

class AuthForm(BaseModel):
    user_email: str
    user_password: str