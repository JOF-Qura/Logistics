from datetime import date, datetime, timedelta
from typing import List, Optional
from pydantic import BaseModel

class Login(BaseModel):
    email: str
    password: str


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    email: Optional[str] = None