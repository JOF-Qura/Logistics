from sqlalchemy import Boolean, Column, ForeignKey, Integer, String,DateTime,text
from sqlalchemy.orm import relationship
from sqlalchemy.sql.functions import func
from sqlalchemy.sql.sqltypes import BLOB, DATE, DATETIME, DECIMAL, TEXT, Float,CHAR
from database import Base
from sqlalchemy import UniqueConstraint
import uuid


class BudgetPlan(Base):
    __tablename__ = "budget_plan"

    id = Column(String(36), primary_key=True, default=text('UUID()'))
    given_budget = Column(Float, nullable=False)
    total_spent = Column(Float, nullable=False,default=0)
    year = Column(String(255), nullable=False)
    date_from = Column(DATE, nullable=False)
    date_to = Column(DATE, nullable=False)
    status = Column(String(255), nullable=False,default="active")
    department_id = Column(CHAR(36), ForeignKey("department_procurement.id"), nullable=False)
    # created_by = Column(CHAR(36), ForeignKey("users.user_id"), nullable=True)
    # updated_by = Column(CHAR(36), ForeignKey("users.user_id"), nullable=True)   
    created_at = Column(DateTime, server_default=text('NOW()'))
    updated_at = Column(DateTime, server_onupdate=text('NOW()'))
    UniqueConstraint(department_id, year) 

    # relation with deparment
    department_procurement = relationship("DepartmentProcurement", back_populates="budget_plan")

    # relation with user
    # u_created_by = relationship("User",foreign_keys=[created_by])
    # u_updated_by = relationship("User",foreign_keys=[updated_by])


    