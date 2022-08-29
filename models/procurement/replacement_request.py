from sqlalchemy import Boolean, Column, ForeignKey, Integer, String,DateTime,text
from sqlalchemy.orm import relationship
from sqlalchemy.sql.functions import func
from sqlalchemy.sql.sqltypes import BLOB, DATE, DATETIME, DECIMAL, TEXT, Float,CHAR
from database import Base
import uuid

class ReplacementRequest(Base):
    __tablename__ = "replacement_request"

    id = Column(String(36), primary_key=True, default=text('UUID()'))
    message = Column(TEXT, nullable=False)
    replacement_request_date = Column(DATETIME, nullable=False)
    request_type = Column(String(255), nullable=False)
    prepared_by = Column(String(255), nullable=False)
    status = Column(String(255), nullable=False,default="Pending")

    expected_arrival_date = Column(DATETIME, nullable=True)
    confirmed_by = Column(String(255), nullable=True)#vendor
    reason = Column(String(255), nullable=True)# if rejected

    # return_id = Column(CHAR(36), ForeignKey("returns.id"), nullable=True)
    created_by = Column(CHAR(36), ForeignKey("users.user_id"), nullable=True)
    updated_by = Column(CHAR(36), ForeignKey("users.user_id"), nullable=True)  
    created_at = Column(DateTime, server_default=text('NOW()'))
    updated_at = Column(DateTime, server_onupdate=text('NOW()'))

  
    # relation with returns
    # returns = relationship("Return", back_populates="replacement_request")

    # relation with replacement items
    # replacement_items = relationship("ReplacementItems", back_populates="replacement_request")

    # relation with user
    # u_created_by = relationship("User",foreign_keys=[created_by])
    # u_updated_by = relationship("User",foreign_keys=[updated_by])
    