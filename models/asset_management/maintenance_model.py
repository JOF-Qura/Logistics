from sqlalchemy import Integer, String, Text, DateTime, text, Numeric
from sqlalchemy.orm.relationships import foreign
from sqlalchemy.sql.schema import Column, ForeignKey
from sqlalchemy.orm import relationship
from database import Base


class Maintenance(Base):
    __tablename__ = 'maintenances'

    maintenance_id = Column(String(36), primary_key=True, default=text('UUID()'))
    maintenance_provider_id = Column(String(36), ForeignKey('maintenance_providers.maintenance_provider_id'), nullable=False)
    asset_id = Column(String(36), ForeignKey('assets.asset_id'), nullable=False)
    maintenance_name = Column(String(255), nullable=True)
    maintenance_details = Column(String(255), nullable=True)
    maintenance_cost = Column(Numeric, nullable=True)
    maintenance_day = Column(Integer, nullable=True)
    maintenance_due = Column(DateTime, nullable=True)
    maintenance_completed = Column(DateTime, nullable=True)
    maintenance_repeatable = Column(String(255), nullable=True)
    maintenance_status = Column(String(255), nullable=True)
    remarks = Column(String(255), nullable=True)
    active_status = Column(String(255), nullable=True, default=('Active'))
    created_at = Column(DateTime, default=text('NOW()'))
    updated_at = Column(DateTime, onupdate=text('NOW()'))

    Maintenance_provider = relationship('Maintenance_provider', back_populates='maintenance', lazy='joined')