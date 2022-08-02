from sqlalchemy import Boolean, Column, ForeignKey, Integer, String
from sqlalchemy.orm import relationship
from sqlalchemy.sql.functions import func
from sqlalchemy.sql.sqltypes import BLOB, DATE, DATETIME, DECIMAL, TEXT, Float,CHAR
from database import Base
import uuid
    
class Utilities(Base):
    __tablename__ = "utilities"

    id = Column(CHAR(36), primary_key=True, default=uuid.uuid4)
    utility_type = Column(String(255), nullable=False)
    attachment = Column(String(255), nullable=False)
    utility_amount = Column(String(255), nullable=False)
    due_date = Column(String(255), nullable=False)
    notes = Column(TEXT, nullable=True)
    vendor_id = Column(CHAR(36), ForeignKey("vendor.id"), nullable=True)
    status = Column(String(255), nullable=False,default="pending")
    created_by = Column(CHAR(36), ForeignKey("users.user_id"), nullable=True)
    updated_by = Column(CHAR(36), ForeignKey("users.user_id"), nullable=True)
    created_at = Column(DATETIME, default=func.current_timestamp())
    updated_at = Column(DATETIME,
                    default=func.current_timestamp(),
                    onupdate=func.current_timestamp())

    # relation with vendor
    vendor = relationship("Vendor", back_populates="utilities")

    # relation with user
    u_created_by = relationship("User",foreign_keys=[created_by])
    u_updated_by = relationship("User",foreign_keys=[updated_by])






	