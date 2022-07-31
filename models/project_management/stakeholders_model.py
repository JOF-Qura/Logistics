from sqlalchemy import Integer, String, Text, DateTime, text
from sqlalchemy.sql.schema import Column, ForeignKey
from sqlalchemy.orm import relationship
from database import Base

class Stakeholder(Base):
    __tablename__ = 'stakeholders'

    id = Column(String(36), primary_key=True, default=text('UUID()'))
    name = Column(String(255), nullable=False)
    role = Column(String(255), nullable=False)
    expectation = Column(String(255), nullable=False)
    project_id = Column(String(36), ForeignKey('projects.id'), nullable=False)
    active_status = Column(String(255), server_default='Active', nullable=False)
    created_at = Column(DateTime, server_default=text('NOW()'))
    updated_at = Column(DateTime, server_onupdate=text('NOW()'))

    stakeholder_project = relationship('Project', back_populates='project_stakeholder')
