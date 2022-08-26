from sqlalchemy import Integer, String, Text, DateTime, text
from sqlalchemy.sql.expression import null
from sqlalchemy.sql.schema import Column, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql.sqltypes import Float
from database import Base

class Quotation(Base):
    __tablename__ = 'quotations'

    id = Column(String(36), primary_key=True, default=text('UUID()'))
    project_id = Column(String(36), ForeignKey('projects.id'), nullable=False)
    task_id = Column(String(36), ForeignKey('tasks.id'), nullable=False)
    name = Column(String(255), nullable=False)
    description = Column(Text(255), nullable=False)
    quantity = Column(Integer, nullable=False)
    price = Column(Float, nullable=False)
    total = Column(Float, nullable=False)
    active_status = Column(String(255), server_default='Active', nullable=False)
    created_at = Column(DateTime, server_default=text('NOW()'))
    updated_at = Column(DateTime, server_onupdate=text('NOW()'))

    quotation_project = relationship('Project', back_populates='project_quotation')
    quotation_task = relationship('Task', back_populates='task_quotation')
