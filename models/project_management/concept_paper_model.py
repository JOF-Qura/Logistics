from sqlalchemy import Integer, String, Text, DateTime, text
from sqlalchemy.sql.expression import null
from sqlalchemy.sql.schema import Column, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql.sqltypes import Float
from database import Base

class ConceptPaper(Base):
    __tablename__ = 'concept_papers'

    id = Column(String(36), primary_key=True, default=text('UUID()'))
    name = Column(String(255), nullable=False)
    background = Column(Text(255), nullable=False)
    coverage = Column(Text(255), nullable=False)
    type = Column(String(255), nullable=False)
    target_beneficiaries = Column(Text(255), nullable=False)
    objectives = Column(Text(255), nullable=False)
    expected_output = Column(Text(255), nullable=False)
    assumptions = Column(Text(255), nullable=False)
    constraints = Column(Text(255), nullable=False)
    cost = Column(Float, nullable=False)
    start_date = Column(DateTime, nullable=False)
    end_date = Column(DateTime, nullable=False)
    remarks = Column(Text(255), nullable=True)
    manager_id = Column(String(36), ForeignKey('employees.employee_id'), nullable=False)
    department_id = Column(String(36), ForeignKey('department.department_id'), nullable=False)
    approval_status = Column(String(255), server_default='Pending', nullable=False)
    notification = Column(String(255), nullable=True)
    active_status = Column(String(255), server_default='Active', nullable=False)
    created_at = Column(DateTime, server_default=text('NOW()'))
    updated_at = Column(DateTime, server_onupdate=text('NOW()'))

    concept_employee = relationship('Employees', back_populates='employee_concept')
    concept_department = relationship('Department', back_populates='department_concept')
    concept_budget = relationship('BudgetRequirements', back_populates='budget_concept')
    concept_project = relationship('Project', back_populates='project_concept')
