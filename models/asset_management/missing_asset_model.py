from sqlalchemy import Integer, String, Text, DateTime, text
from sqlalchemy.sql.schema import Column, ForeignKey
from sqlalchemy.orm import relationship
from database import Base


class Missing_Asset(Base):
    __tablename__ = 'missing_assets'

    missing_id = Column(String(36), primary_key=True, default=text('UUID()'))
    asset_id = Column(String(36), ForeignKey('assets.asset_id'), nullable=True)
    remarks = Column(Text, nullable=True)
    missing_date = Column(DateTime, nullable=True)
    active_status = Column(String(255), nullable=True, default=('Active'))
    created_at = Column(DateTime, default=text('NOW()'))
    updated_at = Column(DateTime, onupdate=text('NOW()'))

    created_by = Column(String(60), ForeignKey('users.user_id'))


    created_by_details = relationship('User', foreign_keys=[created_by], lazy='joined')