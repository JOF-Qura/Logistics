from sqlalchemy.sql.sqltypes import TEXT
from sqlalchemy import Integer, Text, String, DateTime, text
from sqlalchemy.sql.schema import Column, ForeignKey
from sqlalchemy.orm import relationship
from database import Base
    
class Job(Base):
    __tablename__ = 'jobs'

    id = Column(String(36), primary_key=True, default=text('UUID()'))
    title = Column(String(36), nullable=False)
    description = Column(Text(255), nullable=False)
    active_status = Column(String(255), server_default='Active', nullable=False)
    created_at = Column(DateTime, server_default=text('NOW()'))
    updated_at = Column(DateTime, server_onupdate=text('NOW()'))

    employee = relationship('Employee', back_populates='job')