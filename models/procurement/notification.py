from sqlalchemy import Boolean, Column, ForeignKey, Integer, String
from sqlalchemy.orm import relationship
from sqlalchemy.sql.functions import func
from sqlalchemy.sql.sqltypes import BLOB, DATE, DATETIME, DECIMAL, TEXT, Float,CHAR
from database import Base
import uuid


class Notification(Base):
    __tablename__ = "notification"

    id = Column(CHAR(36), primary_key=True, default=uuid.uuid4)
    title = Column(String(255), nullable=False)
    notif_to = Column(String(255), nullable=False)
    description = Column(String(255), nullable=True)
    status = Column(String(255), nullable=False)
    vendor_id = Column(CHAR(36), ForeignKey("vendor_procurement.id"), nullable=True)
    department_id = Column(CHAR(36), ForeignKey("department_procurement.id"), nullable=True)

    created_at = Column(DATETIME, default=func.current_timestamp())
    updated_at = Column(DATETIME,
                    default=func.current_timestamp(),
                    onupdate=func.current_timestamp())

  
    # relation with vendor
    vendor_procurement = relationship("VendorProcurement", back_populates="notification")

    department_procurement = relationship("DepartmentProcurement", back_populates="notification")

