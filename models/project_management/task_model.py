from sqlalchemy import Integer, String, Text, DateTime, text
from sqlalchemy.sql.schema import Column, ForeignKey
from sqlalchemy.orm import relationship
from database import Base

class Task(Base):
    __tablename__ = 'tasks'

    id = Column(String(36), primary_key=True, default=text('UUID()'))
    name = Column(String(255), nullable=False)
    description = Column(Text(255), nullable=False)
    project_id = Column(String(36), ForeignKey('projects.id'), nullable=False)
    employee_id = Column(String(36), ForeignKey('employees.employee_id'), nullable=False)
    deadline = Column(DateTime, nullable=False)
    priority = Column(String(255), nullable=False)
    remarks = Column(String(255), nullable=True)
    status = Column(String(255), server_default='On Track', nullable=False)
    progress_status = Column(String(255), server_default='To Do', nullable=False)
    notification = Column(String(255), nullable=True)
    active_status = Column(String(255), server_default='Active', nullable=False)
    created_at = Column(DateTime, server_default=text('NOW()'))
    updated_at = Column(DateTime, server_onupdate=text('NOW()'))

    task_project = relationship('Project', back_populates='project_task')
    task_employee = relationship('Employees', back_populates='employee_task')
    task_quotation = relationship('Quotation', back_populates='quotation_task')
    task_activity = relationship('Activity', back_populates='activity_task')
