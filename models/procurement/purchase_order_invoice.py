from sqlalchemy import Boolean, Column, ForeignKey, Integer, String,text
from sqlalchemy.orm import relationship
from sqlalchemy.sql.functions import func
from sqlalchemy.sql.sqltypes import BLOB, DATE, DATETIME, DECIMAL, TEXT, Float,CHAR
from database import Base
import uuid
from sqlalchemy import UniqueConstraint

class PurchaseOrderInvoice(Base):
    __tablename__ = "purchase_order_invoice"

    id = Column(String(36), primary_key=True, default=text('UUID()'))

    prepared_by = Column(String(255), nullable=False)
    message = Column(TEXT, nullable=True)
    
    status = Column(String(255), nullable=False,default="Pending")
    invoice_date = Column(DATE, nullable=False)
    due_date = Column(DATE, nullable=False)
    billing_address = Column(String(255), nullable=False)
    amount_paid = Column(String(255), nullable=True,default=0)
    purchase_order_id = Column(CHAR(36), ForeignKey("purchase_order.id"), nullable=False)
    created_by = Column(CHAR(36), ForeignKey("vendor_procurement.id"), nullable=True)
    updated_by = Column(CHAR(36), ForeignKey("vendor_procurement.id"), nullable=True)
    created_at = Column(DATETIME, default=func.current_timestamp())
    updated_at = Column(DATETIME,
                    default=func.current_timestamp(),
                    onupdate=func.current_timestamp())
    
    UniqueConstraint(created_by,purchase_order_id)
    # relation with purchase order
    purchase_order = relationship("PurchaseOrder", back_populates="purchase_order_invoice")

    # relation with vendor - note: update to user
    # u_created_by = relationship("Vendor",foreign_keys=[created_by])
    # u_updated_by = relationship("Vendor",foreign_keys=[updated_by])


