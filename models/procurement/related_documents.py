from sqlalchemy import Boolean, Column, ForeignKey, Integer, String
from sqlalchemy.orm import relationship
from sqlalchemy.sql.functions import func
from sqlalchemy.sql.sqltypes import BLOB, DATE, DATETIME, DECIMAL, TEXT, Float,CHAR
from database import Base
import uuid


class RelatedDocuments(Base):
    __tablename__ = "related_documents"

    id = Column(CHAR(36), primary_key=True, default=uuid.uuid4)
    attachment = Column(String(255), nullable=False)
    request_quotation_id = Column(CHAR(36), ForeignKey("request_quotation.id"), nullable=True)
    # terms_of_reference_id = Column(CHAR(36), ForeignKey("terms_of_reference.id"), nullable=True)
    vendor_proposal_id = Column(CHAR(36), ForeignKey("vendor_proposal.id"), nullable=True)
    status = Column(String(255), nullable=True,default="active")
    created_at = Column(DATETIME, default=func.current_timestamp())
    updated_at = Column(DATETIME,
                    default=func.current_timestamp(),
                    onupdate=func.current_timestamp())
                    
    
    # # relation with terms of reference
    # terms_of_reference = relationship("TermsOfReference", back_populates="related_documents")

    # # relation with request quotation
    request_quotation = relationship("RequestQuotation", back_populates="related_documents")
  
    # # relation with vendor proposals
    vendor_proposal = relationship("VendorProposals", back_populates="related_documents")

 
     