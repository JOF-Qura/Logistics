from sqlalchemy import Boolean, Column, ForeignKey, Integer, String,text
from sqlalchemy.orm import relationship
from sqlalchemy.sql.functions import func
from sqlalchemy.sql.sqltypes import BLOB, DATE, DATETIME, DECIMAL, TEXT, Float,CHAR
from database import Base
import uuid


class PurchaseRequisitionDetail(Base):
    __tablename__ = "purchase_requisition_detail"

    id = Column(String(36), primary_key=True, default=text('UUID()'))
    quantity = Column(Integer, nullable=False)
    description = Column(TEXT, nullable=True)
    new_category = Column(String(255), nullable=True)
    new_product_name = Column(String(255), nullable=True)
    estimated_price = Column(Float, nullable=True)
    purchase_requisition_id = Column(CHAR(36), ForeignKey("purchase_requisition.id"), nullable=False)
    # for product catalog
    product_id = Column(CHAR(36), ForeignKey("product.id"), nullable=True)
    # -----
    # created_by = Column(CHAR(36), ForeignKey("users.id"), nullable=True)
    updated_by = Column(CHAR(36), ForeignKey("users.user_id"), nullable=True)
    status = Column(String(255), nullable=False,default="active")
    created_at = Column(DATETIME, default=func.current_timestamp())
    updated_at = Column(DATETIME,
                    default=func.current_timestamp(),
                    onupdate=func.current_timestamp()) 
     
    # relation with product
    product = relationship("Product", back_populates="purchase_requisition_detail")

    # relation with purchase requisition
    purchase_requisition = relationship("PurchaseRequisition", back_populates="purchase_requisition_detail")

    # relation with user
    # u_created_by = relationship("User",foreign_keys=[created_by])
    # u_updated_by = relationship("User",foreign_keys=[updated_by])
    # users = relationship("User",back_populates="purchase_requisition_detail")
    # user = relationship("User",backref="purchase_order_detail")

