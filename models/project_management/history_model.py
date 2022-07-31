from sqlalchemy import Integer, String, Text, DateTime, text
from sqlalchemy.sql.expression import null
from sqlalchemy.sql.schema import Column, ForeignKey
from sqlalchemy.orm import relationship
from database import Base

class ProjectHistory(Base):
    __tablename__ = 'project_history'

    id = Column(String(36), primary_key=True, default=text('UUID()'))
    project_id = Column(String(36), ForeignKey('projects.id'), nullable=False)
    employee_id = Column(String(36), ForeignKey('employees.employee_id'), nullable=True)
    subject = Column(String(255), nullable=False)
    date = Column(DateTime, server_default=text('NOW()'))
    remarks = Column(Text(255), nullable=False)
    active_status = Column(String(255), server_default='Active', nullable=False)
    created_at = Column(DateTime, server_default=text('NOW()'))
    updated_at = Column(DateTime, server_onupdate=text('NOW()'))

    history_project = relationship('Project', back_populates='project_history')
    history_employee = relationship('Employee', back_populates='employee_history')
