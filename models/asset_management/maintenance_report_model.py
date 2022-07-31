from sqlalchemy import Integer, String, Text, DateTime, text, Numeric
from sqlalchemy.orm.relationships import foreign
from sqlalchemy.sql.schema import Column, ForeignKey
from sqlalchemy.orm import relationship
from database import Base


class Maintenance_Report(Base):
    __tablename__ = 'maintenance_reports'

    maintenance_report_id = Column(String(36), primary_key=True, default=text('UUID()'))
    maintenance_id = Column(String(36), ForeignKey('maintenances.maintenance_id'), nullable=False)
    maintenance_cost = Column(Numeric, nullable=True)
    completed_date = Column(DateTime, nullable=True)
    remarks = Column(Text, nullable=True)
    created_at = Column(DateTime, default=text('NOW()'))
    updated_at = Column(DateTime, onupdate=text('NOW()'))

    maintenance_details = relationship('Maintenance', foreign_keys=[maintenance_id], lazy='joined')