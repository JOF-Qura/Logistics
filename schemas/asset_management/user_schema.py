from typing import Optional
from datetime import datetime as dt
from pydantic import BaseModel

class UserBase(BaseModel):
    user_name: str
    user_email: str

# Schema for request body
class CreateUser(UserBase):
    department_id: Optional [str] = None
    user_name: str
    user_email: str
    user_type: str 
    user_password: str

# Schema for response body
class User(UserBase):
    created_at: dt
    updated_at: dt