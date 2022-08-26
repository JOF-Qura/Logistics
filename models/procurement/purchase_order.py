from sqlalchemy import Boolean, Column, ForeignKey, Integer, String
from sqlalchemy.orm import relationship
from sqlalchemy.sql.functions import func
from sqlalchemy.sql.sqltypes import BLOB, DATE, DATETIME, DECIMAL, TEXT, Float,CHAR
from database import Base
import uuid

class PurchaseOrder(Base):
    __tablename__ = "purchase_order"

    id = Column(CHAR(36), primary_key=True, default=uuid.uuid4)
    purchase_order_number = Column(Integer, unique=True, nullable=False)
    order_date = Column(DATE, nullable=False)
    expected_delivery_date = Column(DATE, nullable=False)
    notes = Column(String(255), nullable=True)
    status = Column(String(255), nullable=False,default="active")
    subtotal = Column(Float, nullable=False)
    discount = Column(Float, nullable=False,default=0)
    tax = Column(Float, nullable=False)
    total_amount = Column(Float, nullable=False)
    shipping_method = Column(String(255), nullable=False)
    payment_terms_id = Column(CHAR(36), ForeignKey("payment_terms.id"), nullable=False)
    payment_method_id = Column(CHAR(36), ForeignKey("payment_method.id"), nullable=False)
    vendor_id = Column(CHAR(36), ForeignKey("vendor_procurement.id"), nullable=False)
    vendor_proposal_id = Column(CHAR(36), ForeignKey("vendor_proposal.id"),unique=True, nullable=False)
    created_by = Column(CHAR(36), ForeignKey("users.user_id"), nullable=True)
    updated_by = Column(CHAR(36), ForeignKey("users.user_id"), nullable=True)
    created_at = Column(DATETIME, default=func.current_timestamp())
    updated_at = Column(DATETIME,
                    default=func.current_timestamp(),
                    onupdate=func.current_timestamp())


    #relation with vendor performance evaluation 
    # vendor_performance_evaluation = relationship("VendorPerformanceEvaluation", back_populates="purchase_order")

    # #relation with payment terms
    # payment_terms = relationship("PaymentTerms", back_populates="purchase_order")

    # #relation with payment method
    # payment_method = relationship("PaymentMethod", back_populates="purchase_order")

    # #relation with purchase order invoice
    # purchase_order_invoice = relationship("PurchaseOrderInvoice", back_populates="purchase_order")


    # # relation with vendor
    # vendor = relationship("Vendor", back_populates="purchase_order")

    # # relation with vendor proposals
    # vendor_proposal = relationship("VendorProposals", back_populates="purchase_order")

    # # relation with purchase order detail
    # purchase_order_detail = relationship("PurchaseOrderDetail", back_populates="purchase_order")

    #relation with user 
    # u_created_by = relationship("User",foreign_keys=[created_by])
    # u_updated_by = relationship("User",foreign_keys=[updated_by])
  