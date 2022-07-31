from sqlalchemy import Integer, String, Text, DateTime, Numeric, text
from sqlalchemy.sql.schema import Column, ForeignKey
from sqlalchemy.orm import relationship
from database import Base


class Asset(Base):
    __tablename__ = 'assets'

    asset_id = Column(String(60), primary_key=True, default=text('UUID()'))
    asset_provider_id = Column(String(60), ForeignKey('asset_providers.asset_provider_id'), nullable=True)
    asset_type_id = Column(String(60), ForeignKey('asset_types.asset_type_id'), nullable=True)
    asset_number = Column(Integer, nullable=True)
    asset_cost = Column(Numeric, nullable=True)
    asset_title = Column(String(255), nullable=True)
    asset_description = Column(Text, nullable=True)
    asset_brand = Column(String(255), nullable=True)
    asset_model = Column(String(255), nullable=True)
    asset_serial = Column(String(255), nullable=True)
    asset_acquisition = Column(String(255), nullable=True)
    acquisition_date = Column(DateTime, nullable=True)
    asset_status = Column(String(255), nullable=True, default=('Available'))
    asset_remarks = Column(String(255), nullable=True)
    active_status = Column(String(255), nullable=True, default=('Active'))
    created_at = Column(DateTime, default=text('NOW()'))
    updated_at = Column(DateTime, onupdate=text('NOW()'))
    created_by = Column(String(60), ForeignKey('users.user_id'))

    asset_provider = relationship('Asset_provider', back_populates='asset', lazy='joined')
    asset_type = relationship('Asset_Type', back_populates='asset', lazy='joined')
    created_by_details = relationship('User', foreign_keys=[created_by], lazy='joined')