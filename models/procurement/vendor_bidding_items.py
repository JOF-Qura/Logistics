from sqlalchemy import Boolean, Column, ForeignKey, Integer, String
from sqlalchemy.orm import relationship
from sqlalchemy.sql.functions import func
from sqlalchemy.sql.sqltypes import BLOB, DATE, DATETIME, DECIMAL, TEXT, Float,CHAR
from database import Base
import uuid

class VendorBiddingItems(Base):
    __tablename__ = "vendor_bidding_item"

    id = Column(CHAR(36), primary_key=True, default=uuid.uuid4)
    # relation with category
    category_id = Column(CHAR(36), ForeignKey("category.id"), nullable=False)
    product_name = Column(String(255), nullable=False)
    description = Column(TEXT, nullable=False)
    quantity = Column(Integer, nullable=False)
    price_per_unit = Column(Float, nullable=False)
    status = Column(String(255), nullable=False,default="active")
    vendor_proposal_id = Column(CHAR(36), ForeignKey("vendor_proposal.id"), nullable=True)
    created_at = Column(DATETIME, default=func.current_timestamp())
    updated_at = Column(DATETIME,
                    default=func.current_timestamp(),
                    onupdate=func.current_timestamp())

    # relation with category
    category = relationship("Category", back_populates="vendor_bidding_item") 
    
    # # relation with vendor proposal
    vendor_proposal = relationship("VendorProposals", back_populates="vendor_bidding_item")
