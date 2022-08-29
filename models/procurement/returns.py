from sqlalchemy import Boolean, Column, ForeignKey, Integer, String,text
from sqlalchemy.orm import relationship
from sqlalchemy.sql.functions import func
from sqlalchemy.sql.sqltypes import BLOB, DATE, DATETIME, DECIMAL, TEXT, Float,CHAR
from database import Base
import uuid

class ReturnProcurement(Base):
    __tablename__ = "returns_procurement"

    id = Column(String(36), primary_key=True, default=text('UUID()'))
    return_date = Column(DATE, nullable=False)
    return_status = Column(String(255), nullable=False)
    return_type = Column(String(255), nullable=False)
    returner = Column(String(255), nullable=False)
    # created_by = Column(CHAR(36), ForeignKey("users.id"), nullable=True)
    # updated_by = Column(CHAR(36), ForeignKey("users.id"), nullable=True)
    created_at = Column(DATETIME, default=func.current_timestamp())
    updated_at = Column(DATETIME,
                    default=func.current_timestamp(),
                    onupdate=func.current_timestamp())


    # relation with replacement request
    replacement_request = relationship("ReplacementRequest", back_populates="returns_procurement")

    # relationship with return details
    return_details_procurement = relationship("ReturnDetailProcurement", back_populates="returns_procurement")

    # relation with user
    # u_created_by = relationship("User",foreign_keys=[created_by])
    # u_updated_by = relationship("User",foreign_keys=[updated_by])


    