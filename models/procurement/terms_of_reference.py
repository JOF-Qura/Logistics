from sqlalchemy import Boolean, Column, ForeignKey, Integer, String,text
from sqlalchemy.orm import relationship
from sqlalchemy.sql.functions import func
from sqlalchemy.sql.sqltypes import BLOB, DATE, DATETIME, DECIMAL, TEXT, Float,CHAR
from database import Base
import uuid

class TermsOfReferenceProcurement(Base):
    __tablename__ = "terms_of_reference_procurement"

    id = Column(String(36), primary_key=True, default=text('UUID()'))
    tor_number =Column(Integer, nullable=True, unique=True)

    background = Column(TEXT, nullable=False)
    objective = Column(TEXT, nullable=False)
    scope_of_service = Column(TEXT, nullable=False)
    tor_deliverables = Column(TEXT, nullable=False)
    qualifications = Column(TEXT, nullable=False)
    reporting_and_working_arrangements = Column(TEXT, nullable=False)
    tor_annex_technical_specifications = Column(TEXT, nullable=False)
    tor_annex_key_experts = Column(TEXT, nullable=False)
    tor_annex_deliverables = Column(TEXT, nullable=False)
    tor_annex_terms_conditions = Column(TEXT, nullable=False)
    status = Column(String(255), nullable=False,default="Pending")
    prepared_by = Column(String(255), nullable=False)
    approver_name = Column(String(255), nullable=True)
    approval_date = Column(DATE, nullable=True)
    reject_reason = Column(String(255), nullable=True)
    project_request_id = Column(CHAR(36), ForeignKey("projects.id"), nullable=True)
    vendor_id = Column(CHAR(36), ForeignKey("vendor_procurement.id"), nullable=True)
    # created_by = Column(CHAR(36), ForeignKey("users.id"), nullable=True)
    # updated_by = Column(CHAR(36), ForeignKey("users.id"), nullable=True) 
    created_at = Column(DATETIME, default=func.current_timestamp())
    updated_at = Column(DATETIME,
                    default=func.current_timestamp(),
                    onupdate=func.current_timestamp())

    #  relation with project request
    project_request_procurement = relationship("Project", back_populates="terms_of_reference_procurement")

    # relation with related documents
    # related_documents = relationship("RelatedDocuments", back_populates="terms_of_reference")

    # relation with vendor
    vendor_procurement = relationship("VendorProcurement", back_populates="terms_of_reference_procurement")


