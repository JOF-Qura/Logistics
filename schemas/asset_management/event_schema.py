from typing import Optional
from datetime import datetime as dt
from pydantic import BaseModel

class EventBase(BaseModel):
    asset_id: str
    event_title: str
    event_message: str


# Schema for request body
class CreateEvent(EventBase):
    pass



    