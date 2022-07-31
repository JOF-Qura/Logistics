from sqlalchemy import Integer, String, Text, DateTime, text
from sqlalchemy.sql.schema import Column, ForeignKey
from sqlalchemy.orm import relationship
from database import Base


class Asset_check_out(Base):
    __tablename__ = 'asset_check_out'

    check_out_id = Column(String(36), primary_key=True, default=text('UUID()'))
    asset_id = Column(String(60), ForeignKey('assets.asset_id'), nullable=True)
    user_id = Column(String(60), ForeignKey('users.user_id'), nullable=True)
    department_id = Column(String(60), ForeignKey('department.department_id'), nullable=True)
    location = Column(String(255), nullable=True)
    check_out_date = Column(DateTime, nullable=True)
    check_out_due = Column(DateTime, nullable=True)
    remarks = Column(Text, nullable=True)
    active_status = Column(String(255), nullable=True, default=('Active'))
    created_at = Column(DateTime, default=text('NOW()'))
    updated_at = Column(DateTime, onupdate=text('NOW()'))
   
    on_department = relationship('Department', foreign_keys=[department_id], lazy='joined')
    on_user = relationship('User', foreign_keys=[user_id], lazy='joined')
    the_asset = relationship('Asset', foreign_keys=[asset_id], lazy='joined')