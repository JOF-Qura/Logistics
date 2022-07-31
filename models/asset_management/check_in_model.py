from sqlalchemy import Integer, String, Text, DateTime, text
from sqlalchemy.sql.schema import Column, ForeignKey
from sqlalchemy.orm import relationship
from database import Base


class Asset_check_in(Base):
    __tablename__ = 'asset_check_in'

    check_in_id = Column(String(36), primary_key=True, default=text('UUID()'))
    check_out_id = Column(String(60), ForeignKey('asset_check_out.check_out_id'), nullable=True)
    return_date = Column(DateTime, nullable=True)
    return_location = Column(String(255), nullable=True)
    remarks = Column(Text, nullable=True)
    active_status = Column(String(255), nullable=True, default=('Active'))
    created_at = Column(DateTime, default=text('NOW()'))
    updated_at = Column(DateTime, onupdate=text('NOW()'))
    
    check_out_details = relationship('Asset_check_out', foreign_keys=[check_out_id], lazy='joined')
   