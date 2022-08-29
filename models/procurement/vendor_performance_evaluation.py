from sqlalchemy import Boolean, Column, ForeignKey, Integer, String,text
from sqlalchemy.orm import relationship
from sqlalchemy.sql.functions import func
from sqlalchemy.sql.sqltypes import BLOB, DATE, DATETIME, DECIMAL, TEXT, Float,CHAR
from database import Base
import uuid
    
class VendorPerformanceEvaluation(Base):
    __tablename__ = "vendor_performance_evaluation"

    id = Column(String(36), primary_key=True, default=text('UUID()'))
    message = Column(TEXT, nullable=True)
    cost = Column(String(255), nullable=False)
    timeliness = Column(String(255), nullable=False)
    reliability = Column(String(255), nullable=False)
    quality = Column(String(255), nullable=False)
    availability = Column(String(255), nullable=False)
    reputation = Column(String(255), nullable=False)
    status = Column(String(255), nullable=False,default="active")
    purchase_order_id = Column(CHAR(36), ForeignKey("purchase_order.id"),unique=True, nullable=False)
    created_by = Column(CHAR(36), ForeignKey("users.user_id"), nullable=True)
    updated_by = Column(CHAR(36), ForeignKey("users.user_id"), nullable=True)
    created_at = Column(DATETIME, default=func.current_timestamp())
    updated_at = Column(DATETIME,
                    default=func.current_timestamp(),
                    onupdate=func.current_timestamp())
    
    # relation with user
    u_created_by = relationship("User",foreign_keys=[created_by])
    u_updated_by = relationship("User",foreign_keys=[updated_by])

  
    # # relation with purchase order
    purchase_order = relationship("PurchaseOrder", back_populates="vendor_performance_evaluation")
