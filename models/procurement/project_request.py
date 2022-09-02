# from sqlalchemy import Boolean, Column, ForeignKey, Integer, String,text
# from sqlalchemy.orm import relationship
# from sqlalchemy.sql.functions import func
# from sqlalchemy.sql.sqltypes import BLOB, DATE, DATETIME, DECIMAL, TEXT, Float,CHAR
# from database import Base
# import uuid

# class ProjectRequestProcurement(Base):
#     __tablename__ = "project_request_procurement"

#     id = Column(String(36), primary_key=True, default=text('UUID()'))
#     name = Column(String(255), nullable=False)
#     background = Column(TEXT, nullable=False)
#     coverage = Column(TEXT, nullable=False)
#     type = Column(String(255), nullable=False)
#     target_beneficiaries = Column(String(255), nullable=False)
#     objectives = Column(TEXT, nullable=False)
#     expected_output = Column(TEXT, nullable=False)
#     assumptions = Column(String(255), nullable=False)
#     constraints = Column(String(255), nullable=False)
#     cost = Column(Float, nullable=False)
#     start_date = Column(DATE, nullable=False)
#     end_date = Column(DATE, nullable=False)
#     approval_status = Column(String(255), nullable=False)
#     active_status = Column(String(255), nullable=False,default="Active")
#     # created_by = Column(String(255), ForeignKey("users.id"), nullable=True)
#     # updated_by = Column(String(255), ForeignKey("users.id"), nullable=True)
#     created_at = Column(DATETIME, default=func.current_timestamp())
#     updated_at = Column(DATETIME,
#                     default=func.current_timestamp(),
#                     onupdate=func.current_timestamp()) 


#     # relation with terms of reference
#     terms_of_reference_procurement = relationship("TermsOfReferenceProcurement", back_populates="project_request_procurement")





