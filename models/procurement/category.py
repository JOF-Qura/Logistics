from sqlalchemy import Boolean, Column, ForeignKey, Integer, String
from sqlalchemy.orm import relationship
from sqlalchemy.sql.functions import func
from sqlalchemy.sql.sqltypes import BLOB, DATE, DATETIME, DECIMAL, TEXT, Float,CHAR
from database import Base
import uuid



class Category(Base):
    __tablename__ = "category"

    id = Column(CHAR(36), primary_key=True, default=uuid.uuid4)
    category_name = Column(String(255), nullable=False)
    description = Column(TEXT, nullable=True)
    status = Column(String(255), nullable=False,default="active")
    created_by = Column(CHAR(36), ForeignKey("users.user_id"), nullable=True)
    updated_by = Column(CHAR(36), ForeignKey("users.user_id"), nullable=True)
    created_at = Column(DATETIME, default=func.current_timestamp())
    updated_at = Column(DATETIME,
                    default=func.current_timestamp(),
                    onupdate=func.current_timestamp())

    # relation with user
    # u_created_by = relationship("User",foreign_keys=[created_by])
    # u_updated_by = relationship("User",foreign_keys=[updated_by])

    # # relation with product
    product = relationship("Product", back_populates="category")

    # # relation with vendor items
    vendor_bidding_item = relationship("VendorBiddingItems", back_populates="category")

    #  # relation with vendor
    vendor_procurement = relationship("VendorProcurement", back_populates="category")


