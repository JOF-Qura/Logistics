from sqlalchemy import Integer, String, Text, DateTime, text
from sqlalchemy.sql.schema import Column, ForeignKey
from sqlalchemy.orm import relationship
from database import Base


class Asset_provider(Base):
    __tablename__ = 'asset_providers'

    asset_provider_id = Column(String(36), primary_key=True, default=text('UUID()'))
    asset_provider_name = Column(String(255), nullable=True)
    asset_provider_contact = Column(String(255), nullable=True)
    asset_provider_email = Column(String(255), nullable=True)
    active_status = Column(String(255), nullable=True, default=('Active'))
    created_at = Column(DateTime, default=text('NOW()'))
    updated_at = Column(DateTime, onupdate=text('NOW()'))

    asset = relationship('Asset')
