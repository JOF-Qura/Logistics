from sqlalchemy import Boolean, Column, ForeignKey, Integer, String
from sqlalchemy.orm import relationship
from sqlalchemy.sql.functions import func
from sqlalchemy.sql.sqltypes import BLOB, DATE, DATETIME, DECIMAL, TEXT, Float,CHAR
from database import Base
from sqlalchemy import UniqueConstraint
import uuid


class RequestQuotationVendor(Base):
    __tablename__ = "request_quotation_vendor"

        
    vendor_id = Column(ForeignKey("vendor_procurement.id"), primary_key=True)
    rfq_pr_id = Column(CHAR(36),ForeignKey("request_quotation.purchase_requisition_id"), nullable=True)
    rfq_status = Column(String(255), nullable=True,default="Pending")
    approver_name = Column(String(255), nullable=True)
    approval_date = Column(DATE, nullable=True)
    reject_reason = Column(TEXT, nullable=True)
    request_quotation_id = Column(ForeignKey("request_quotation.id"), primary_key=True)
    created_by = Column(CHAR(36), ForeignKey("users.user_id"), nullable=True)
    updated_by = Column(CHAR(36), ForeignKey("users.user_id"), nullable=True)
    created_at = Column(DATETIME, default=func.current_timestamp())
    updated_at = Column(DATETIME,
                    default=func.current_timestamp(),
                    onupdate=func.current_timestamp())
    UniqueConstraint(vendor_id, rfq_pr_id) 
    
    # relation with related
    vendor_procurement = relationship("VendorProcurement", back_populates="request_quotation_vendor")

    # relation with user
    # u_created_by = relationship("User",foreign_keys=[created_by])
    # u_updated_by = relationship("User",foreign_keys=[updated_by])

   
    
  