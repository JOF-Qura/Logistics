from sqlalchemy import Integer, String, Text, DateTime, text
from sqlalchemy.sql.schema import Column, ForeignKey
from sqlalchemy.orm import relationship
from database import Base


class Department(Base):
    __tablename__ = 'department'

    department_id = Column(String(36), primary_key=True, default=text('UUID()'))
    department_name = Column(String(255), nullable=False)
    department_description = Column(Text(255), nullable=False)
    department_location = Column(String(255), nullable=False)
    department_head = Column(String(255), nullable=True)
    active_status = Column(String(255), server_default='Active', nullable=False)
    status = Column(String(255), nullable=False,default="active")
    created_at = Column(DateTime, server_default=text('NOW()'))
    updated_at = Column(DateTime, server_onupdate=text('NOW()'))

    contact_no = Column(String(255), nullable=False)
    

    department_employee = relationship('Employees', back_populates='departments')
    department_projects = relationship('Project', back_populates='project_department')
    department_concept = relationship('ConceptPaper', back_populates='concept_department')

#==============================================================================================================#

#-------------- Relationship/s (Warehousing) ------------ START
     #Relationship/s of this Table
    # manager = relationship('Employees', back_populates='hd_employeeFK')

    #Relationship/s of this Table to other Table/s
    or_hospital_departmentFK = relationship('Outbound_Reports', back_populates='hospital_department')
#-------------- Relationship/s (Warehousing) ------------ END

#==============================================================================================================#

#-------------- Relationship/s (Procurement) ------------ START
    # # relation with budget plan
    budget_plan = relationship("BudgetPlan", back_populates="department_procurement")

    # # relation with purchase requisition
    purchase_requisition = relationship("PurchaseRequisition", back_populates="department_procurement")

    #  # relation with notif
    notification = relationship("Notification", back_populates="department_procurement")
#-------------- Relationship/s (Procurement) ------------ END

