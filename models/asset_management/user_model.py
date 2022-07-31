from sqlalchemy import Integer, String, Text, DateTime, text
from sqlalchemy.sql.schema import Column, ForeignKey
from models.asset_management.department_model import Department
from sqlalchemy.orm import relationship
from database import Base


class User(Base):
    __tablename__ = 'users'

    user_id = Column(String(36), primary_key=True, default=text('UUID()'))
    department_id = Column(String(36), ForeignKey(Department.department_id), nullable=True)
    user_name = Column(String(255), nullable=True)
    user_email = Column(String(255), nullable=True)
    user_password = Column(String(255), nullable=True)
    user_type = Column(String(255), nullable=True)
    active_status = Column(String(255), nullable=True, default=('Active'))
    created_at = Column(DateTime, default=text('NOW()'))
    updated_at = Column(DateTime, onupdate=text('NOW()'))
    
    user_department = relationship('Department', foreign_keys=[department_id], lazy='joined')
    