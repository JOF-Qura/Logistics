from sqlalchemy import Integer, String, Text, DateTime, text
from sqlalchemy.sql.schema import Column, ForeignKey
from sqlalchemy.orm import relationship
from database import Base

class Activity(Base):
    __tablename__ = 'activities'

    id = Column(String(36), primary_key=True, default=text('UUID()'))
    subject = Column(String(255), nullable=False)
    remarks = Column(Text(255), nullable=False)
    date = Column(DateTime, nullable=False)
    project_id = Column(String(36), ForeignKey('projects.id'), nullable=False)
    task_id = Column(String(36), ForeignKey('tasks.id'), nullable=False)
    employee_id = Column(String(36), ForeignKey('employees.employee_id'), nullable=False)
    active_status = Column(String(255), server_default='Active', nullable=False)
    created_at = Column(DateTime, server_default=text('NOW()'))
    updated_at = Column(DateTime, server_onupdate=text('NOW()'))

    activity_project = relationship('Project', back_populates='project_activity')
    activity_task = relationship('Task', back_populates='task_activity')
    activity_employee = relationship('Employee', back_populates='employee_activity')
