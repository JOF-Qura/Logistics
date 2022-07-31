from sqlalchemy import Integer, String, Text, DateTime, text
from sqlalchemy.sql.schema import Column, ForeignKey
from sqlalchemy.orm import relationship
from database import Base


class Request_Asset(Base):
    __tablename__ = 'request_assets'

    request_id = Column(String(36), primary_key=True, default=text('UUID()'))
    asset_type_id = Column(String(36), ForeignKey('asset_types.asset_type_id'), nullable=True)
    request_brand = Column(String(255), nullable=True)
    request_model = Column(DateTime, nullable=True)
    request_description = Column(Text, nullable=True)
    request_status = Column(String(255), nullable=True)
    request_remark = Column(Text, nullable=True)
    active_status = Column(Text, nullable=True, default=('Active'))

    created_at = Column(DateTime, default=text('NOW()'))
    updated_at = Column(DateTime, onupdate=text('NOW()'))
    created_by = Column(String(36), ForeignKey('users.user_id'), nullable=True)
    updated_by = Column(String(36), ForeignKey('users.user_id'), nullable=True)

    asset_type = relationship('Asset_Type', lazy='joined')
    created_by_details = relationship('User', foreign_keys=[created_by], lazy='joined')
    updated_by_details = relationship('User', foreign_keys=[updated_by], lazy='joined')