from sqlalchemy import Boolean, Column, ForeignKey, Integer, String,text
from sqlalchemy.orm import relationship
from sqlalchemy.sql.functions import func
from sqlalchemy.sql.sqltypes import BLOB, DATE, DATETIME, DECIMAL, TEXT, Float,CHAR
from database import Base
import uuid

    
class VendorBlacklist(Base):
    __tablename__ = "vendor_blacklist"
    id = Column(String(36), primary_key=True, default=text('UUID()'))
    vendor_id = Column(String(255), ForeignKey("vendor_procurement.id"), nullable=False)
    vendor_name = Column(String(255), nullable=False)
    email = Column(String(255), nullable=False)
    remarks = Column(TEXT, nullable=False)
    status = Column(String(255), nullable=False,default="Active")
    created_by = Column(CHAR(36), ForeignKey("users.user_id"), nullable=True)
    updated_by = Column(CHAR(36), ForeignKey("users.user_id"), nullable=True)
    created_at = Column(DATETIME, default=func.current_timestamp())
    updated_at = Column(DATETIME,
                    default=func.current_timestamp(),
                    onupdate=func.current_timestamp())




    
    # relation with vendor
    vendor_procurement = relationship("VendorProcurement", back_populates="vendor_blacklist")