from sqlalchemy import Integer, String, Text, DateTime, Numeric, text
from sqlalchemy.sql.schema import Column, ForeignKey
from sqlalchemy.orm import relationship
from database import Base


class Asset_Warranty(Base):
    __tablename__ = 'asset_warranty'

    warranty_id = Column(String(36), primary_key=True, default=text('UUID()'))
    asset_id = Column(String(36), ForeignKey('assets.asset_id'), nullable=True)
    warranty_length = Column(Numeric, nullable=True)
    expiration_date = Column(DateTime, nullable=True)
    warranty_contact = Column(String(255), nullable=True)
    warranty_email = Column(String(255), nullable=True)
    warranty_note = Column(String(255), nullable=True)
    active_status = Column(Text, nullable=True, default=('Active'))

    created_at = Column(DateTime, default=text('NOW()'))
    updated_at = Column(DateTime, onupdate=text('NOW()'))
    created_by = Column(String(36), ForeignKey('users.user_id'), nullable=True)

    asset_type = relationship('Asset', foreign_keys=[asset_id], lazy='joined')
    created_by_details = relationship('User', foreign_keys=[created_by], lazy='joined')