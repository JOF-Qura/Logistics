from sqlalchemy import Boolean, Column, ForeignKey, Integer, String,text
from sqlalchemy.orm import relationship
from sqlalchemy.sql.functions import func
from sqlalchemy.sql.sqltypes import BLOB, DATE, DATETIME, DECIMAL, TEXT, Float,CHAR
from database import Base
import uuid

class ReturnDetailProcurement(Base):
    __tablename__ = "return_details_procurement"

    id = Column(String(36), primary_key=True, default=text('UUID()'))
    quantity = Column(Integer, nullable=False)
    status = Column(String(255), nullable=False,default="Active")
    purchase_order_detail_id = Column(CHAR(36), ForeignKey("purchase_order_detail.id"), nullable=True)
    return_id = Column(CHAR(36), ForeignKey("returns_procurement.id"), nullable=True)
    created_at = Column(DATETIME, default=func.current_timestamp())
    updated_at = Column(DATETIME,
                    default=func.current_timestamp(),
                    onupdate=func.current_timestamp())

    # relation with purchase order detail
    purchase_order_detail = relationship("PurchaseOrderDetail", back_populates="return_details_procurement")
  
    # relation with returns
    returns_procurement = relationship("ReturnProcurement", back_populates="return_details_procurement")
    