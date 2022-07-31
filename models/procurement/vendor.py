from sqlalchemy import Boolean, Column, ForeignKey, Integer, String
from sqlalchemy.orm import relationship
from sqlalchemy.sql.functions import func
from sqlalchemy.sql.sqltypes import BLOB, DATE, DATETIME, DECIMAL, TEXT, Float,CHAR
from database import Base
import uuid

# vendor model
class Vendor(Base):
    __tablename__ = "vendor"

    id = Column(CHAR(36), primary_key=True, default=uuid.uuid4)

    vendor_logo = Column(String(255), nullable=False)
    vendor_name = Column(String(255), nullable=False,unique=True)
    contact_person = Column(String(255), nullable=False)
    contact_no = Column(String(255), nullable=False)
    vendor_website = Column(String(255), nullable=True)
    email = Column(String(255), nullable=False,unique=True)
    organization_type = Column(String(255), nullable=True)
    region = Column(String(255), nullable=False)
    province = Column(String(255), nullable=False)
    municipality = Column(String(255), nullable=True)
    barangay = Column(String(255), nullable=True)
    street = Column(String(255), nullable=True)
    category_id = Column(CHAR(36), ForeignKey("category.id"), nullable=True)
    status = Column(String(255), nullable=False,default="active")
    created_by = Column(String(255), ForeignKey("users.user_id"), nullable=True)
    updated_by = Column(String(255), ForeignKey("users.user_id"), nullable=True)
    # password = Column(String(255), nullable=False)
    created_at = Column(DATETIME, default=func.current_timestamp())
    updated_at = Column(DATETIME,
                    default=func.current_timestamp(),
                    onupdate=func.current_timestamp())
    
    # relationship with audit trail
    vendor_audit_trail = relationship("VendorAuditTrail", back_populates="vendor")

    # relationship with time log
    vendor_time_log = relationship("VendorTimeLog", back_populates="vendor")

    # relation with user
    # u_created_by = relationship("User",foreign_keys=[created_by])
    # u_updated_by = relationship("User",foreign_keys=[updated_by])
    users = relationship("User",primaryjoin="and_(Vendor.id==User.vendor_id)", back_populates="vendor")
    

    # relation with terms of reference
    terms_of_reference = relationship("TermsOfReference", back_populates="vendor")

    # relation wtih utilities
    utilities = relationship("Utilities", back_populates="vendor")

    # relation with category
    category = relationship("Category", back_populates="vendor") 
    
    # relation with purchase order
    purchase_order = relationship("PurchaseOrder", back_populates="vendor")

    # relation with notif
    notification = relationship("Notification", back_populates="vendor")

    #relation with request quotation vendor 
    request_quotation_vendor = relationship("RequestQuotationVendor", back_populates="vendor")

    # relation with blacklist
    vendor_blacklist = relationship("VendorBlacklist", back_populates="vendor")

  