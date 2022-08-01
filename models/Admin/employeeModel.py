from sqlalchemy import Integer, String, DateTime, Text as Desc, text
from sqlalchemy.sql.schema import Column, ForeignKey
from models.asset_management.user_model import User

from sqlalchemy.orm import relationship
from database import Base

#-------------------- Employees Table ----------------------#
class Employees(Base):
#Table Name
    __tablename__ = 'employees'

#Columns
    employee_id             = Column(String(36), primary_key=True, default=text('UUID()'))
    user_type               = Column(String(255), nullable=False)
    employee_first_name     = Column(String(255), nullable=False)
    employee_middle_name    = Column(String(255), nullable=True)
    employee_last_name      = Column(String(255), nullable=False)
    employee_contact        = Column(String(255), nullable=False, unique=True)
    employee_age            = Column(Integer, nullable=False)
    employee_address        = Column(String(255), nullable=False)
    active_status = Column(String(255), server_default='Active', nullable=True)

    # Column for Project Management
    job_id = Column(String(36), ForeignKey('jobs.id'), nullable=True)
    department_id = Column(String(36), ForeignKey('departments.id'), nullable=True)

    created_at              = Column(DateTime, default=text('NOW()'))
    updated_at              = Column(DateTime, onupdate=text('NOW()'))


    #Foreignkey
    user_id                 = Column(String(36), ForeignKey(User.user_id), nullable=True, unique=True)
    
#Relationship/s
    #Relationship/s of this Table
    #employee_user = relationship('User', backref='user_employeeFK')

    #Relationship/s of this Table to other Table/s
    or_employeeFK = relationship("Outbound_Reports", back_populates="employee")
    ir_employeeFK = relationship("Inbound_Reports", back_populates="emp")
    w_employeeFK = relationship("Warehouses", back_populates="manager")
    hd_employeeFK = relationship("Hospital_Departments", back_populates="manager")

#Relationship w/ Project Management
    user_employee = relationship('User', back_populates='employee_user')
    job = relationship('Job', back_populates='employee')
    projects = relationship('Project', back_populates='project_user')
    departments = relationship('Departments', back_populates='department_employee')
    employee_concept = relationship('ConceptPaper', back_populates='concept_employee')
    employee_task = relationship('Task', back_populates='task_employee')
    employee_activity = relationship('Activity', back_populates='activity_employee')
    employee_history = relationship('ProjectHistory', back_populates='history_employee')
