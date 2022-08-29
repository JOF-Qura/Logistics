from sqlalchemy import Boolean, Column, ForeignKey, Integer, String,text
from sqlalchemy.orm import relationship
from sqlalchemy.sql.functions import func
from sqlalchemy.sql.sqltypes import BLOB, DATE, DATETIME, DECIMAL, TEXT, Float,CHAR
from database import Base
import uuid

class RequestQuotation(Base):
    __tablename__ = "request_quotation"

    id = Column(String(36), primary_key=True, default=text('UUID()'))
    request_quotation_number = Column(Integer, unique=True)
    message = Column(TEXT, nullable=False)
    status = Column(String(255), nullable=False)
    due_date = Column(DATETIME, nullable=False)
    prepared_by = Column(String(255), nullable=False)
    quotation_code = Column(String(255), nullable=False)
    rfq_type = Column(String(255), nullable=False)
    purchase_requisition_id = Column(CHAR(36), ForeignKey("purchase_requisition.id"), nullable=True)
    created_by = Column(CHAR(36), ForeignKey("users.user_id"), nullable=True)
    updated_by = Column(CHAR(36), ForeignKey("users.user_id"), nullable=True)
    created_at = Column(DATETIME, default=func.current_timestamp())
    updated_at = Column(DATETIME,
                    default=func.current_timestamp(),
                    onupdate=func.current_timestamp())


    # # relation with related documents
    related_documents = relationship("RelatedDocuments", back_populates="request_quotation")

    # # relation with request quotation vendor
    request_quotation_vendor = relationship("RequestQuotationVendor",foreign_keys='[RequestQuotationVendor.request_quotation_id]')
    
    # # relation with purhcase requisition - ...?
    purchase_requisition = relationship("PurchaseRequisition", back_populates="request_quotation")

    # #relation with vendor proposal    
    vendor_proposal = relationship("VendorProposals", back_populates="request_quotation")

    # # relation with user
    # u_created_by = relationship("User",foreign_keys=[created_by])
    # u_updated_by = relationship("User",foreign_keys=[updated_by])



