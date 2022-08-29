from sqlalchemy import Boolean, Column, ForeignKey, Integer, String,text
from sqlalchemy.orm import relationship
from sqlalchemy.sql.functions import func
from sqlalchemy.sql.sqltypes import BLOB, DATE, DATETIME, DECIMAL, TEXT, Float,CHAR
from database import Base
import uuid

class VendorTimeLog(Base):
    __tablename__ = "vendor_time_log"

    id = Column(String(36), primary_key=True, default=text('UUID()'))
    logged_date = Column(DATETIME, nullable=False)
    logged_type = Column(String(255), nullable=False)
    client_ip = Column(String(255), nullable=True)
    vendor_id = Column(CHAR(36), ForeignKey("vendor_procurement.id"), nullable=False)

    # relation with vendor
    vendor_procurement = relationship("VendorProcurement", back_populates="vendor_time_log")
    