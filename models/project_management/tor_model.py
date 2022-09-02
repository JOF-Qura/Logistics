# from sqlalchemy import Integer, String, Text, DateTime, text
# from sqlalchemy.sql.schema import Column, ForeignKey
# from sqlalchemy.orm import relationship
# from database import Base

# class TermsOfReference(Base):
#     __tablename__ = 'terms_of_reference'

#     id = Column(String(36), primary_key=True, default=text('UUID()'))
#     tor_number =Column(Integer, nullable=True, unique=True)
#     background = Column(Text(255), nullable=False)
#     objective = Column(Text(255), nullable=False)
#     scope_of_service = Column(Text(255), nullable=False)
#     tor_deliverables = Column(Text(255), nullable=False)
#     qualifications = Column(Text(255), nullable=False)
#     reporting_and_working_arrangements = Column(Text(255), nullable=False)
#     tor_annex_technical_specifications = Column(Text(255), nullable=False)
#     tor_annex_key_experts = Column(Text(255), nullable=False)
#     tor_annex_deliverables = Column(Text(255), nullable=False)
#     tor_annex_terms_conditions = Column(Text(255), nullable=False)
#     prepared_by = Column(String(255), nullable=False)
#     approver_name = Column(String(255), nullable=True)
#     approval_date = Column(DateTime, nullable=True)
#     reject_reason = Column(String(255), nullable=True)
#     status = Column(String(255), server_default='Pending', nullable=False)
#     project_id = Column(String(36), ForeignKey('projects.id'), nullable=True)
#     vendor_id = Column(String(36), ForeignKey('vendors.id'), nullable=True)
#     created_at = Column(DateTime, server_default=text('NOW()'))
#     updated_at = Column(DateTime, server_onupdate=text('NOW()'))

#     tor_project = relationship('Project', back_populates='project_tor')
#     tor_vendor = relationship('Vendor', back_populates='vendor_tor')
