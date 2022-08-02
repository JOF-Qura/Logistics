from sqlalchemy import Integer, String, Text, DateTime, text
from sqlalchemy.sql.schema import Column, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql.sqltypes import Float
from database import Base

class BudgetRequirements(Base):
    __tablename__ = 'budget_requirements'

    id = Column(String(36), primary_key=True, default=text('UUID()'))
    name = Column(String(255), nullable=False)
    description = Column(Text(255), nullable=False)
    cost = Column(Float, nullable=False)
    project_id = Column(String(36), ForeignKey('projects.id'), nullable=True)
    concept_paper_id = Column(String(36), ForeignKey('concept_papers.id'), nullable=True)
    active_status = Column(String(255), server_default='Active', nullable=False)
    created_at = Column(DateTime, server_default=text('NOW()'))
    updated_at = Column(DateTime, server_onupdate=text('NOW()'))

    budget_project = relationship('Project', back_populates='project_budget')
    budget_concept = relationship('ConceptPaper', back_populates='concept_budget')
