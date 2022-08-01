from sqlalchemy import Integer, String, Text, DateTime, text
from sqlalchemy.sql.schema import Column, ForeignKey
from sqlalchemy.orm import relationship
from database import Base

class Departments(Base):
    __tablename__ = 'departments'

    id = Column(String(36), primary_key=True, default=text('UUID()'))
    name = Column(String(255), nullable=False)
    description = Column(Text(255), nullable=False)
    location = Column(String(255), nullable=False)
    active_status = Column(String(255), server_default='Active', nullable=False)
    created_at = Column(DateTime, server_default=text('NOW()'))
    updated_at = Column(DateTime, server_onupdate=text('NOW()'))

    department_employee = relationship('Employees', back_populates='departments')
    department_projects = relationship('Project', back_populates='project_department')
    department_concept = relationship('ConceptPaper', back_populates='concept_department')
