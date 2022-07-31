from sqlalchemy.sql.sqltypes import TEXT
from sqlalchemy import Integer, String, DateTime, text
from sqlalchemy.sql.schema import Column, ForeignKey
from sqlalchemy.orm import relationship
from database import Base

# class Employee(Base):
#     __tablename__ = 'employees'

#     id = Column(String(36), primary_key=True, default=text('UUID()'))
#     first_name = Column(String(255), nullable=False)
#     middle_name = Column(String(255), server_default='', nullable=True)
#     last_name = Column(String(255), nullable=False)
#     suffix_name = Column(String(255), server_default='', nullable=True)
#     user_id = Column(String(36), ForeignKey('users.id'), nullable=False)
#     job_id = Column(String(36), ForeignKey('jobs.id'), nullable=False)
#     department_id = Column(String(36), ForeignKey('departments.id'), nullable=False)
#     active_status = Column(String(255), server_default='Active', nullable=False)
#     created_at = Column(DateTime, server_default=text('NOW()'))
#     updated_at = Column(DateTime, server_onupdate=text('NOW()'))

#     #Relationship/s
#     #Relationship/s of this Table

#     #Relationship/s of this Table to other Table/s
#     or_employeeFK = relationship("Outbound_Reports", back_populates="employee")
#     ir_employeeFK = relationship("Inbound_Reports", back_populates="emp")
#     w_employeeFK = relationship("Warehouses", back_populates="manager")
#     hd_employeeFK = relationship("Hospital_Departments", back_populates="manager")

#     user_employee = relationship('Users', back_populates='employee_user')
#     job = relationship('Job', back_populates='employee')
#     projects = relationship('Project', back_populates='project_user')
#     departments = relationship('Department', back_populates='department_employee')
#     employee_concept = relationship('ConceptPaper', back_populates='concept_employee')
#     employee_task = relationship('Task', back_populates='task_employee')
#     employee_activity = relationship('Activity', back_populates='activity_employee')
#     employee_history = relationship('ProjectHistory', back_populates='history_employee')