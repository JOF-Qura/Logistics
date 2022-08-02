from sqlalchemy import Integer, String, Text, DateTime, text
from sqlalchemy.sql.schema import Column, ForeignKey
from sqlalchemy.orm import relationship
from database import Base

class Vendor(Base):
    __tablename__ = 'vendors'

    id = Column(String(36), primary_key=True, default=text('UUID()'))
    vendor_name = Column(String(255), nullable=False)
    contact_person = Column(String(255), nullable=False)
    contact_no = Column(String(255), nullable=False)
    vendor_website = Column(String(255), nullable=False)
    email = Column(String(255), nullable=False)
    organization_type = Column(String(255), nullable=False)
    created_at = Column(DateTime, server_default=text('NOW()'))
    updated_at = Column(DateTime, server_onupdate=text('NOW()'))

    vendor_tor = relationship('TermsOfReference', back_populates='tor_vendor')
