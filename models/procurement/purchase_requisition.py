from sqlalchemy import Boolean, Column, ForeignKey, Integer, String
from sqlalchemy.orm import relationship
from sqlalchemy.sql.functions import func
from sqlalchemy.sql.sqltypes import BLOB, DATE, DATETIME, DECIMAL, TEXT, Float,CHAR
from database import Base
import uuid


# purchase requisition model
class PurchaseRequisition(Base):
    __tablename__ = "purchase_requisition"

    id = Column(CHAR(36), primary_key=True, default=uuid.uuid4)
    purchase_requisition_number = Column(Integer, unique=True)
    purpose = Column(String(255), nullable=False)
    message = Column(TEXT, nullable=False)
    status = Column(String(255), nullable=False)
    date_approved = Column(DATETIME, nullable=True)
    department_id = Column(CHAR(36), ForeignKey("department_procurement.id"), nullable=False)
    created_by = Column(CHAR(36), ForeignKey("users.user_id"), nullable=True)
    updated_by = Column(CHAR(36), ForeignKey("users.user_id"), nullable=True)  
    created_at = Column(DATETIME, default=func.current_timestamp())
    updated_at = Column(DATETIME,
                    default=func.current_timestamp(),
                    onupdate=func.current_timestamp())
    
    # if approved
    approved_by = Column(String(255), nullable=True)
    given_budget = Column(Float, nullable=True)
    estimated_amount = Column(Float, nullable=True,default=0)
    # if rejected
    reason = Column(String(255), nullable=True)


    # relation with department
    department_procurement = relationship("DepartmentProcurement", back_populates="purchase_requisition")

    # relation with purchase requisition detail
    purchase_requisition_detail = relationship("PurchaseRequisitionDetail", back_populates="purchase_requisition")

    # relation with request quotation
    request_quotation = relationship("RequestQuotation", back_populates="purchase_requisition")

    # relation with user
    # u_created_by = relationship("User",foreign_keys=[created_by])
    # u_updated_by = relationship("User",foreign_keys=[updated_by])