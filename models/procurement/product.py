from sqlalchemy import Boolean, Column, ForeignKey, Integer, String
from sqlalchemy.orm import relationship
from sqlalchemy.sql.functions import func
from sqlalchemy.sql.sqltypes import BLOB, DATE, DATETIME, DECIMAL, TEXT, Float,CHAR
from database import Base
import uuid

class Product(Base):
    __tablename__ = "product"

    id = Column(CHAR(36), primary_key=True, default=uuid.uuid4)
    product_name = Column(String(255), nullable=False)
    estimated_price = Column(DECIMAL, nullable=False)
    description = Column(TEXT, nullable=False)
    estimated_price = Column(Float, nullable=False)
    status = Column(String(255), nullable=False,default="active")
    category_id = Column(CHAR(36), ForeignKey("category.id"), nullable=False)
    created_by = Column(CHAR(36), ForeignKey("users.user_id"), nullable=True)
    updated_by = Column(CHAR(36), ForeignKey("users.user_id"), nullable=True)
    created_at = Column(DATETIME, default=func.current_timestamp())
    updated_at = Column(DATETIME,
                    default=func.current_timestamp(),
                    onupdate=func.current_timestamp())

    # relation with category
    # category = relationship("Category", back_populates="product")

    # # relation with purchase requisition detail
    # purchase_requisition_detail = relationship("PurchaseRequisitionDetail", back_populates="product")

    # # relation with user
    # u_created_by = relationship("User",foreign_keys=[created_by])
    # u_updated_by = relationship("User",foreign_keys=[updated_by])
