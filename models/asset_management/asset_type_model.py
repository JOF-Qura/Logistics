from sqlalchemy import Integer, String, Text, DateTime, text
from sqlalchemy.sql.schema import Column, ForeignKey
from sqlalchemy.orm import relationship
from database import Base


class Asset_Type(Base):
    __tablename__ = 'asset_types'

    asset_type_id = Column(String(36), primary_key=True, default=text('UUID()'))
    asset_type_title = Column(String(255), nullable=True)
    description = Column(Text, nullable=True)
    active_status = Column(String(255), nullable=True, default=('Active'))
    created_at = Column(DateTime, default=text('NOW()'))
    updated_at = Column(DateTime, onupdate=text('NOW()'))

    asset = relationship('Asset')
   