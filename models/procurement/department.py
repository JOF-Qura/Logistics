from sqlalchemy import Boolean, Column, ForeignKey, Integer, String
from sqlalchemy.orm import relationship
from sqlalchemy.sql.functions import func
from sqlalchemy.sql.sqltypes import BLOB, DATE, DATETIME, DECIMAL, TEXT, Float,CHAR
from database import Base
import uuid




class Department(Base):
    __tablename__ = "department"

    id = Column(CHAR(36), primary_key=True, default=uuid.uuid4)
    department_name = Column(String(255), nullable=False)
    department_head = Column(String(255), nullable=False)
    contact_no = Column(String(255), nullable=False)
    status = Column(String(255), nullable=False,default="active")
    created_by = Column(CHAR(36), ForeignKey("users.id"), nullable=True)
    updated_by = Column(CHAR(36), ForeignKey("users.id"), nullable=True)
    created_at = Column(DATETIME, default=func.current_timestamp())
    updated_at = Column(DATETIME,
                    default=func.current_timestamp(),
                    onupdate=func.current_timestamp())   

    # relation with employees
    # employees = relationship("Employee", back_populates="department")

    # # relation with user
    # u_created_by = relationship("User",foreign_keys=[created_by])
    # u_updated_by = relationship("User",foreign_keys=[updated_by])

    # # relation with budget plan
    # budget_plan = relationship("BudgetPlan", back_populates="department")

    # # relation with purchase requisition
    # purchase_requisition = relationship("PurchaseRequisition", back_populates="department")

    #  # relation with notif
    # notification = relationship("Notification", back_populates="department")