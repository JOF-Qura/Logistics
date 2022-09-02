from sqlalchemy import Integer, String, Text, DateTime, text
from sqlalchemy.sql.expression import null
from sqlalchemy.sql.schema import Column, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql.sqltypes import Float
from database import Base

class Project(Base):
    __tablename__ = 'projects'

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
    concept_paper_id = Column(String(36), ForeignKey('concept_papers.id'), nullable=True)
    manager_id = Column(String(36), ForeignKey('employees.employee_id'), nullable=False)
    department_id = Column(String(36), ForeignKey('department.department_id'), nullable=False)
    approval_status = Column(String(255), server_default='Pending', nullable=False)
    progress_status = Column(String(255), server_default='', nullable=True)
    notification = Column(String(255), nullable=True)
    active_status = Column(String(255), server_default='Active', nullable=False)
    created_at = Column(DateTime, server_default=text('NOW()'))
    updated_at = Column(DateTime, server_onupdate=text('NOW()'))

    project_user = relationship('Employees', back_populates='projects')
    project_department = relationship('Department', back_populates='department_projects')
    project_task = relationship('Task', back_populates='task_project')
    project_quotation = relationship('Quotation', back_populates='quotation_project')
    project_activity = relationship('Activity', back_populates='activity_project')
    project_document = relationship('Document', back_populates='document_project')
    project_history = relationship('ProjectHistory', back_populates='history_project')
    project_milestone = relationship('Milestones', back_populates='milestone_project')
    project_budget = relationship('BudgetRequirements', back_populates='budget_project')
    project_stakeholder = relationship('Stakeholder', back_populates='stakeholder_project')
    project_concept = relationship('ConceptPaper', back_populates='concept_project')
    
    # relation with terms of reference
    terms_of_reference_procurement = relationship("TermsOfReferenceProcurement", back_populates="project_request_procurement")
