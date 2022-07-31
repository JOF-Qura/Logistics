
from sqlalchemy import Boolean, Column, ForeignKey, Integer, String
from sqlalchemy.orm import relationship
from sqlalchemy.sql.functions import func
from sqlalchemy.sql.sqltypes import BLOB, DATE, DATETIME, DECIMAL, TEXT, Float,CHAR
from database import Base
from sqlalchemy import UniqueConstraint

import uuid

class VendorProposals(Base):
    __tablename__ = "vendor_proposal"

    id = Column(CHAR(36), primary_key=True, default=uuid.uuid4)
    proposal_number = Column(Integer, unique=True)

    subtotal = Column(Float, nullable=False)
    discount = Column(Float, nullable=False,default=0)
    tax = Column(Float, nullable=False)
    total_amount = Column(String(255), nullable=False)
    prepared_by = Column(String(255), nullable=False)
    contact_no = Column(String(255), nullable=False)
    message = Column(TEXT, nullable=False)
    notes = Column(TEXT, nullable=True)
    status = Column(String(255), nullable=False)
    arrival_date = Column(DATE, nullable=False)
    is_ordered = Column(Boolean, nullable=False,default=False)
    created_by = Column(CHAR(36), ForeignKey("users.user_id"), nullable=True)
    updated_by = Column(CHAR(36), ForeignKey("users.user_id"), nullable=True)
    awarded_by = Column(String(255), nullable=True)
    request_quotation_id = Column(CHAR(36), ForeignKey("request_quotation.id"), nullable=False)

    created_at = Column(DATETIME, default=func.current_timestamp())
    updated_at = Column(DATETIME,
                    default=func.current_timestamp(),
                    onupdate=func.current_timestamp())

    UniqueConstraint(created_by, request_quotation_id) 

    # relation with vendor bidding items
    vendor_bidding_item = relationship("VendorBiddingItems", back_populates="vendor_proposal")

     # relation with vendor purchase order
    purchase_order = relationship("PurchaseOrder", back_populates="vendor_proposal")

    # relation with related documents
    related_documents = relationship("RelatedDocuments", back_populates="vendor_proposal")

    # relation with request quotation
    request_quotation = relationship("RequestQuotation", back_populates="vendor_proposal")

    # relation with vendor
    u_created_by = relationship("User",foreign_keys=[created_by])
    u_updated_by = relationship("User",foreign_keys=[updated_by])




