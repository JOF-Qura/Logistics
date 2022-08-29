from sqlalchemy import Boolean, Column, ForeignKey, Integer, String,text
from sqlalchemy.orm import relationship
from sqlalchemy.sql.functions import func
from sqlalchemy.sql.sqltypes import BLOB, DATE, DATETIME, DECIMAL, TEXT, Float,CHAR
from database import Base
import uuid

class VendorAuditTrail(Base):
    __tablename__ = "vendor_audit_trail"

    id = Column(String(36), primary_key=True, default=text('UUID()'))
    crud = Column(String(255), nullable=False)
    client_ip = Column(String(255), nullable=True)
    table = Column(String(255), nullable=False)
    payload = Column(TEXT, nullable=True)
    vendor_id = Column(CHAR(36), ForeignKey("vendor_procurement.id"), nullable=False)
    created_at = Column(DATETIME, default=func.current_timestamp())

    # relation with vendor
    vendor_procurement = relationship("VendorProcurement", back_populates="vendor_audit_trail")