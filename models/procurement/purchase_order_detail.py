from sqlalchemy import Boolean, Column, ForeignKey, Integer, String,text
from sqlalchemy.orm import relationship
from sqlalchemy.sql.functions import func
from sqlalchemy.sql.sqltypes import BLOB, DATE, DATETIME, DECIMAL, TEXT, Float,CHAR
from database import Base
import uuid

class PurchaseOrderDetail(Base):
    __tablename__ = "purchase_order_detail"

    id = Column(String(36), primary_key=True, default=text('UUID()'))
    product_name = Column(String(255), nullable=False)
    quantity = Column(Integer, nullable=False)
    category = Column(String(255), nullable=False)
    product_price = Column(Float, nullable=False)
    status = Column(String(255), nullable=False,default="active")
    updated_by = Column(CHAR(36), ForeignKey("users.user_id"), nullable=True)
    purchase_order_id = Column(CHAR(36), ForeignKey("purchase_order.id"), nullable=False)
    created_at = Column(DATETIME, default=func.current_timestamp())
    updated_at = Column(DATETIME,
                    default=func.current_timestamp(),
                    onupdate=func.current_timestamp())
    
    # # relation with purchase order
    purchase_order = relationship("PurchaseOrder", back_populates="purchase_order_detail")

    # #relation with returns 
    # return_details = relationship("ReturnDetail", back_populates="purchase_order_detail")


    # # relation with user
    # user = relationship("User",backref="purchase_order_detail")
   