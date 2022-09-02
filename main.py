from fastapi import FastAPI, Request, Depends
from fastapi.responses import HTMLResponse
from fastapi.templating import Jinja2Templates
from fastapi.staticfiles import StaticFiles
from sqlalchemy.orm import Session
from sqlalchemy.sql.functions import count
from database import Base, get_db, engine
from dependencies import get_token

from routes.asset_management import asset_route, asset_type_route, asset_provider_route, maintenance_provider_route, maintenance_route, event_route
from routes.asset_management import missing_asset_route, asset_request_route, sell_asset_route, dispose_asset_route, broken_asset_route, repair_asset_route
from routes.asset_management import (maintenance_report_route, check_out_route, check_in_route, asset_warranty_route,
                                    department_route
                                    )
from routes.access import auth_route

# importing all admin routes
from routes.Admin import (#authRoutes
                    employeeRoutes
                    , supplyRoutes
                    , postRoutes 
                    # , hospital_departmentRoutes
                    , inbound_reportRoutes
                    , inventory_locationRoutes
                    , inventoryRoutes
                    , outbound_report_detailRoutes
                    , outbound_reportRoutes
                    , request_detailRoutes
                    , requestRoutes
                    , supplierRoutes 
                    , supply_categoriesRoutes 
                    , return_detailRoutes
                    , returnRoutes 
                    , notifRoutes
                    , warehouseRoutes
                    )
from routes.Admin.count import (countRequestDetail_Supply
                                , countSupply
                                , countRequest_Pending
                                , countReturn_Pending
                                , countFromHospital
                                , countFromProcurement
                                , count_analytics
                                )

from routes.Admin.filter import (requestFilter
                                )

# importing all models
from models.Admin import ( 
                    #userModel, 
                    employeeModel
                    , warehouseModel
                    , supplierModel
                    , inventoryModel
                    # , hospital_departmentModel
                    , inbound_reportModel
                    , inventory_locationModel
                    , outbound_report_detailModel
                    , outbound_reportModel
                    , request_detailModel
                    , requestModel
                    , supply_categoryModel
                    , supplyModel 
                    , postModel
                    , returnModel
                    , return_detailModel
                    , notifModel)

from models.asset_management import (user_model
                    , asset_model
                    , asset_provider_model
                    , asset_type_model
                    , asset_warranty_model
                    , broken_asset_model
                    , check_in_model
                    , check_out_model
                    , department_model
                    , dispose_asset_model
                    , event_model
                    , maintenance_model
                    , maintenance_provider_model
                    , maintenance_report_model
                    , missing_asset_model
                    , repair_asset_model
                    , request_asset_model
                    , sell_asset_model)

# importing models one by one
#from models.Admin.userModel import User
from models.Admin.supplyModel import Supplies
from models.Admin.supply_categoryModel import Supply_Categories
from models.Admin.inventoryModel import Inventories
from models.Admin.inventory_locationModel import Inventory_Locations
from models.Admin.requestModel import Request as RequestModel
from models.Admin.returnModel import Return as ReturnModel
from models.Admin.request_detailModel import Request_Details
from models.Admin.return_detailModel import Return_Details
from models.Admin.outbound_reportModel import Outbound_Reports
from models.Admin.outbound_report_detailModel import Outbound_Report_Details
from models.Admin.inbound_reportModel import Inbound_Reports
from models.Admin.supplierModel import Suppliers
from models.Admin.warehouseModel import Warehouses
# from models.Admin.hospital_departmentModel import Hospital_Departments
from models.Admin.employeeModel import Employees
from models.Admin.notifModel import Notifications
from models.Admin.postModel import Post

from models.asset_management.user_model import User
from models.asset_management.asset_model import Asset
from models.asset_management.asset_provider_model import Asset_provider
from models.asset_management.asset_type_model import Asset_Type
from models.asset_management.asset_warranty_model import Asset_Warranty
from models.asset_management.broken_asset_model import Broken_Asset
from models.asset_management.check_in_model import Asset_check_in
from models.asset_management.check_out_model import Asset_check_out
from models.asset_management.department_model import Department
from models.asset_management.dispose_asset_model import Dispose_Asset
from models.asset_management.event_model import Events
from models.asset_management.maintenance_model import Maintenance
from models.asset_management.maintenance_provider_model import Maintenance_provider
from models.asset_management.maintenance_report_model import Maintenance_Report
from models.asset_management.missing_asset_model import Missing_Asset
from models.asset_management.repair_asset_model import Repair_Asset
from models.asset_management.request_asset_model import Request_Asset
from models.asset_management.sell_asset_model import Sell_Asset



# importing all procurement models

from models.procurement.vendor_blacklist import VendorBlacklist 
from models.procurement.vendor import VendorProcurement 
from models.procurement.category import Category 
from models.procurement.budget_plan import BudgetPlan 
from models.procurement.vendor_performance_evaluation import VendorPerformanceEvaluation 
from models.procurement.purchase_order_detail import PurchaseOrderDetail 
from models.procurement.vendor_proposal import VendorProposals
from models.procurement.vendor_bidding_items import VendorBiddingItems
from models.procurement.product import Product 
# from models.procurement.department import DepartmentProcurement 

from models.procurement.purchase_requisition_detail import PurchaseRequisitionDetail 
from models.procurement.vendor_audit_trail import VendorAuditTrail
from models.procurement.vendor_time_log import VendorTimeLog
from models.procurement.request_quotation import RequestQuotation
from models.procurement.notification import Notification
from models.procurement.purchase_order import PurchaseOrder 
from models.procurement.purchase_requisition import PurchaseRequisition 
from models.procurement.related_documents import RelatedDocuments
from models.procurement.payment_method import PaymentMethod
from models.procurement.payment_terms import PaymentTerms
from models.procurement.purchase_order_invoice import PurchaseOrderInvoice
from models.procurement.utilities import Utilities
from models.procurement.rfq_vendor import RequestQuotationVendor
from models.procurement.replacement_request import ReplacementRequest
# from models.procurement.project_request import ProjectRequestProcurement
from models.procurement.return_details import ReturnDetailProcurement
from models.procurement.returns import ReturnProcurement



from models.procurement.terms_of_reference import TermsOfReferenceProcurement


# importing all project management models
from models.project_management.activity_model import Activity
from models.project_management.budget_requirements_model import BudgetRequirements
from models.project_management.concept_paper_model import ConceptPaper
# from models.project_management.department_model import Departments
from models.project_management.document_model import Document
from models.project_management.history_model import ProjectHistory
from models.project_management.job_model import Job
from models.project_management.milestone_model import Milestones
from models.project_management.project_model import Project
from models.project_management.quotation_model import Quotation
from models.project_management.stakeholders_model import Stakeholder
from models.project_management.task_model import Task
# from models.project_management.tor_model import TermsOfReference
# from models.project_management.vendor_model import Vendor

# importing all project management routes
from routes.project_management import (activity_routes
                    , budget_requirements_routes
                    , concept_paper_routes
                    # , department_routes
                    , document_routes 
                    , history_routes
                    , job_routes
                    , milestone_routes
                    , project_routes
                    , quotation_routes
                    , stakeholder_routes
                    , task_routes
                    , tor_routes
                    , vendor_routes
                    )


# from .replacement_items import ReplacementItems

# importing all procurement routes
from routes.procurement import (purchase_order_invoice
,product, category
,replacement_request
,budget_plan, vendor_performance_evaluation,vendor_proposal, vendor_login
,purchase_order,purchase_requisition,purchase_requisition_detail,request_quotation,vendor, vendor_bidding_item, notif
,vendor_log_time,vendor_audit_trail,related_documents, utility,rfq_vendor
,payment_method,payment_terms
, terms_of_reference
,project_request
# ,employee,employee_type
# , department
,returns,return_details
# , user, login, user_type
)



# creating all models
Base.metadata.create_all(engine)

app = FastAPI()
# Mount static folder
app.mount('/static', StaticFiles(directory='static'), name='static')

# Register Routes
# app.include_router(authRoutes.router)
app.include_router(employeeRoutes.router)
app.include_router(supplyRoutes.router)
# app.include_router(hospital_departmentRoutes.router)
app.include_router(inbound_reportRoutes.router)
app.include_router(inventory_locationRoutes.router)
app.include_router(inventoryRoutes.router)
app.include_router(outbound_report_detailRoutes.router)
app.include_router(outbound_reportRoutes.router)
app.include_router(requestRoutes.router)
app.include_router(returnRoutes.router)
app.include_router(request_detailRoutes.router)
app.include_router(return_detailRoutes.router)
app.include_router(supplierRoutes.router)
app.include_router(supply_categoriesRoutes.router)
app.include_router(warehouseRoutes.router)
app.include_router(notifRoutes.router)

# Asset Management Routes
app.include_router(auth_route.router)
app.include_router(asset_route.router)
app.include_router(asset_type_route.router)
app.include_router(asset_provider_route.router)
app.include_router(maintenance_provider_route.router)
app.include_router(maintenance_route.router)
app.include_router(event_route.router)
app.include_router(missing_asset_route.router)
app.include_router(asset_request_route.router)
app.include_router(sell_asset_route.router)
app.include_router(dispose_asset_route.router)
app.include_router(broken_asset_route.router)
app.include_router(repair_asset_route.router)
app.include_router(department_route.router)
app.include_router(maintenance_report_route.router)
app.include_router(check_out_route.router)
app.include_router(check_in_route.router)
app.include_router(asset_warranty_route.router)

# PROJECT MANAGEMENT ROUTES
app.include_router(activity_routes.router)
app.include_router(budget_requirements_routes.router)
app.include_router(concept_paper_routes.router)
# app.include_router(department_routes.router)
app.include_router(document_routes.router)
app.include_router(history_routes.router)
app.include_router(job_routes.router)
app.include_router(milestone_routes.router)
app.include_router(project_routes.router)
app.include_router(quotation_routes.router)
app.include_router(stakeholder_routes.router)
app.include_router(task_routes.router)
# app.include_router(tor_routes.router)
# app.include_router(vendor_routes.router)

app.include_router(countRequestDetail_Supply.router)
app.include_router(countSupply.router)
app.include_router(countRequest_Pending.router)
app.include_router(countReturn_Pending.router)
app.include_router(countFromHospital.router)
app.include_router(countFromProcurement.router)
app.include_router(count_analytics.router)

app.include_router(requestFilter.router)


# routers procurement

app.include_router(product.router)
app.include_router(category.router)
app.include_router(budget_plan.router)
app.include_router(purchase_order.router)
app.include_router(purchase_requisition.router)
app.include_router(purchase_requisition_detail.router)
app.include_router(request_quotation.router)
# app.include_router(vendor_evaluation_schedules.router)
app.include_router(vendor_performance_evaluation.router)
app.include_router(vendor_proposal.router)
app.include_router(vendor_bidding_item.router)
app.include_router(vendor.router)
app.include_router(vendor_login.router)
app.include_router(notif.router)
app.include_router(vendor_log_time.router)
app.include_router(vendor_audit_trail.router)
app.include_router(related_documents.router)

app.include_router(purchase_order_invoice.router)
app.include_router(utility.router)
app.include_router(rfq_vendor.router)
app.include_router(payment_terms.router)
app.include_router(payment_method.router)
app.include_router(project_request.router)
app.include_router(terms_of_reference.router)
app.include_router(returns.router)
app.include_router(return_details.router)

app.include_router(replacement_request.router)


#Saling Pusa
app.include_router(postRoutes.router)


# Register template folder
template = Jinja2Templates('templates')


from fastapi.middleware.cors import CORSMiddleware

origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

#Template
# @app.get('/', response_class=HTMLResponse)
# def index(request: Request, db: Session = Depends(get_db)):
#     try:
#         posts = db.query(Post).all()
#         return template.TemplateResponse('index.html', 
#         {
#             'request': request,
#             'posts': posts
#         })
#     except Exception as e:
#         print(e)

# # ---------------------------- HomePage Template ------------------------------ # -- Remove (Duplicate in Asset)
# @app.get('/homies', response_class=HTMLResponse)
# def landing(request: Request):
#     return template.TemplateResponse('index.html', 
#     {
#         'request': request
#     })

# # ---------------------------- Access Template ------------------------------ # Remove (Duplicate in Asset)
# @app.get('/homies/main', response_class=HTMLResponse)
# def dashMain(request: Request):
#     return template.TemplateResponse('mainDashboard.html', 
#     {
#         'request': request
#     })

# @app.get('/homies/systemAdmin', response_class=HTMLResponse)
# def dashMain(request: Request):
#     return template.TemplateResponse('systemAdminMain.html', 
#     {
#         'request': request
#     }) 

# @app.get('/homies/systemAdmin/users', response_class=HTMLResponse)
# def index(request: Request, db: Session = Depends(get_db), current_user: User = Depends(get_token)):
#     try:
#         users = db.query(User).all()
#         return template.TemplateResponse('systemAdmin_Users.html', 
#         {
#             'request': request,
#             'users': users
#         })
#     except Exception as e:
#         print(e)
 

# ---------------------------- Access Template ------------------------------ #
@app.get('/homies/login', response_class=HTMLResponse)
def login(request: Request):
    return template.TemplateResponse('access/login.html', 
    {
        'request': request
    })

@app.get("/sysAdmin/users", response_class=HTMLResponse)
def dashboard(request: Request,):
    return template.TemplateResponse("access/sysAdmin/user.html", {"request": request})

@app.get("/sysAdmin/department", response_class=HTMLResponse)
def dashboard(request: Request,):
    return template.TemplateResponse("access/sysAdmin/department.html", {"request": request})

# ---------------------------- Warehousing Admin Template ------------------------------ #
@app.get('/warehousing/admin/', response_class=HTMLResponse)
def dashhboard(request: Request, db: Session = Depends(get_db), current_user: User = Depends(get_token)):
    return template.TemplateResponse('warehousing/admin/content/dashboard.html', 
    {
        'request': request
    })

@app.get('/warehousing/admin/dashboard', response_class=HTMLResponse)
def dashhboard(request: Request, db: Session = Depends(get_db), current_user: User = Depends(get_token)):
    return template.TemplateResponse('warehousing/admin/content/dashboard.html', 
    {
        'request': request
    })

@app.get('/warehousing/admin/users/', response_class=HTMLResponse)
def index(request: Request, db: Session = Depends(get_db), current_user: User = Depends(get_token)):
    try:
        users = db.query(User).all()
        return template.TemplateResponse('warehousing/admin/content/users.html', 
        {
            'request': request,
            'users': users
        })
    except Exception as e:
        print(e)

@app.get('/warehousing/admin/supplies/', response_class=HTMLResponse)
def index(request: Request, db: Session = Depends(get_db), current_user: User = Depends(get_token)):
    try:
        supplies = db.query(Supplies).all()
        return template.TemplateResponse('warehousing/admin/content/supplies.html', 
        {
            'request': request,
            'supplies': supplies
        })
    except Exception as e:
        print(e)

@app.get('/warehousing/admin/supply_categories/', response_class=HTMLResponse)
def index(request: Request, db: Session = Depends(get_db), current_user: User = Depends(get_token)):
    try:
        supply_categories = db.query(Supply_Categories).all()
        return template.TemplateResponse('warehousing/admin/content/supply_categories.html', 
        {
            'request': request,
            'supply_categories': supply_categories
        })
    except Exception as e:
        print(e)

        
@app.get('/warehousing/admin/inventories/', response_class=HTMLResponse)
def index(request: Request, db: Session = Depends(get_db), current_user: User = Depends(get_token)):
    try:
        inventories = db.query(Inventories).all()
        return template.TemplateResponse('warehousing/admin/content/inventories.html', 
        {
            'request': request,
            'inventories': inventories
        })
    except Exception as e:
        print(e)
            
@app.get('/warehousing/admin/inventory_locations/', response_class=HTMLResponse)
def index(request: Request, db: Session = Depends(get_db), current_user: User = Depends(get_token)):
    try:
        inventory_locations = db.query(Inventory_Locations).all()
        return template.TemplateResponse('warehousing/admin/content/inventory_locations.html', 
        {
            'request': request,
            'inventory_locations': inventory_locations
        })
    except Exception as e:
        print(e)

@app.get('/warehousing/admin/request/', response_class=HTMLResponse)
def index(request: Request, db: Session = Depends(get_db), current_user: User = Depends(get_token)):
    try:
        request_model = db.query(RequestModel).all()
        return template.TemplateResponse('warehousing/admin/content/request.html', 
        {
            'request': request,
            'request_model': request_model
        })
    except Exception as e:
        print(e)

@app.get('/warehousing/admin/return/', response_class=HTMLResponse)
def index(request: Request, db: Session = Depends(get_db), current_user: User = Depends(get_token)):
    try:
        return_model = db.query(ReturnModel).all()
        return template.TemplateResponse('warehousing/admin/content/return.html', 
        {
            'request': request,
            'return_model': return_model
        })
    except Exception as e:
        print(e)

@app.get('/warehousing/admin/outbound_reports/', response_class=HTMLResponse)
def index(request: Request, db: Session = Depends(get_db), current_user: User = Depends(get_token)):
    try:
        o_reports = db.query(Outbound_Reports).all()
        return template.TemplateResponse('warehousing/admin/content/outbound_reports.html', 
        {
            'request': request,
            'o_reports': o_reports
        })
    except Exception as e:
        print(e)

@app.get('/warehousing/admin/inbound_reports/', response_class=HTMLResponse)
def index(request: Request, db: Session = Depends(get_db), current_user: User = Depends(get_token)):
    try:
        i_reports = db.query(Inbound_Reports).all()
        return template.TemplateResponse('warehousing/admin/content/inbound_reports.html', 
        {
            'request': request,
            'i_reports': i_reports
        })
    except Exception as e:
        print(e)

@app.get('/warehousing/admin/suppliers/', response_class=HTMLResponse)
def index(request: Request, db: Session = Depends(get_db), current_user: User = Depends(get_token)):
    try:
        suppliers = db.query(Suppliers).all()
        return template.TemplateResponse('warehousing/admin/content/suppliers.html', 
        {
            'request': request,
            'suppliers': suppliers
        })
    except Exception as e:
        print(e)

@app.get('/warehousing/admin/warehouses/', response_class=HTMLResponse)
def index(request: Request, db: Session = Depends(get_db), current_user: User = Depends(get_token)):
    try:
        warehouses = db.query(Warehouses).all()
        return template.TemplateResponse('warehousing/admin/content/warehouses.html', 
        {
            'request': request,
            'warehouses': warehouses
        })
    except Exception as e:
        print(e)

@app.get('/warehousing/admin/hospital_departments/', response_class=HTMLResponse)
def index(request: Request, db: Session = Depends(get_db), current_user: User = Depends(get_token)):
    try:
        hospital_departments = db.query(Department).all()
        return template.TemplateResponse('warehousing/admin/content/hospital_departments.html', 
        {
            'request': request,
            'hospital_departments': hospital_departments
        })
    except Exception as e:
        print(e)

@app.get('/warehousing/admin/employees/', response_class=HTMLResponse)
def index(request: Request, db: Session = Depends(get_db), current_user: User = Depends(get_token)):
    try:
        employees = db.query(Employees).all()
        return template.TemplateResponse('warehousing/admin/content/employees.html', 
        {
            'request': request,
            'employees': employees
        })
    except Exception as e:
        print(e)

# ------------ Warehousing Admin View --------------- #
@app.get('/warehousing/admin/supplies_details', response_class=HTMLResponse)
def index(request: Request, supply_id: str, db: Session = Depends(get_db), current_user: User = Depends(get_token)):
    try:
        supplies = db.query(Supplies).filter(Supplies.supply_id == supply_id).first()
        return template.TemplateResponse('warehousing/admin/content/viewSupplies.html', 
        {
            'request': request,
            'supplies': supplies
        })
    except Exception as e:
        print(e)

@app.get('/warehousing/admin/inventories/{inventory_id}', response_class=HTMLResponse)
def index(request: Request, inventory_id: str, db: Session = Depends(get_db), current_user: User = Depends(get_token)):
    try:
        inventories = db.query(Inventories).filter(Inventories.inventory_id == inventory_id).first()
        return template.TemplateResponse('warehousing/admin/content/viewInventories.html', 
        {
            'request': request,
            'inventories': inventories
        })
    except Exception as e:
        print(e)

@app.get('/warehousing/admin/request_details', response_class=HTMLResponse)
def index(request: Request, request_id: str, db: Session = Depends(get_db), current_user: User = Depends(get_token)):
    try:
        req = db.query(Request_Details).filter(Request_Details.request_id == request_id).all()
        return template.TemplateResponse('warehousing/admin/content/viewRequest.html', 
        {
            'request': request,
            'req': req
        })
    except Exception as e:
        print(e)

@app.get('/warehousing/admin/return_details', response_class=HTMLResponse)
def index(request: Request, return_id: str, db: Session = Depends(get_db), current_user: User = Depends(get_token)):
    try:
        ret = db.query(Return_Details).filter(Return_Details.return_id == return_id).all()
        return template.TemplateResponse('warehousing/admin/content/viewReturn.html', 
        {
            'request': request,
            'ret': ret
        })
    except Exception as e:
        print(e)

@app.get('/warehousing/admin/outbound_report_details', response_class=HTMLResponse)
def index(request: Request, outbound_report_id: str, db: Session = Depends(get_db), current_user: User = Depends(get_token)):
    try:
        out_report_d = db.query(Outbound_Report_Details).filter(Outbound_Report_Details.outbound_report_id == outbound_report_id).all()
        return template.TemplateResponse('warehousing/admin/content/viewOutboundReport.html', 
        {
            'request': request,
            'out_report_d': out_report_d
        })
    except Exception as e:
        print(e)

@app.get('/warehousing/admin/inbound_report_details', response_class=HTMLResponse)
def index(request: Request, inbound_report_id: str, db: Session = Depends(get_db), current_user: User = Depends(get_token)):
    try:
        in_report_d = db.query(Inbound_Reports).filter(Inbound_Reports.inbound_report_id == inbound_report_id).all()
        return template.TemplateResponse('warehousing/admin/content/viewInboundReport.html', 
        {
            'request': request,
            'in_report_d': in_report_d
        })
    except Exception as e:
        print(e)



# ---------------------------- Warehousing Manager Template ------------------------------ #
@app.get('/warehousing/manager/', response_class=HTMLResponse)
def dashhboard(request: Request, db: Session = Depends(get_db), current_user: User = Depends(get_token)):
    # users = db.query(User).filter(User.user_email == current_user).first()
    return template.TemplateResponse('warehousing/manager/content/dashboard.html', 
    {
        'request': request,
        # 'users': users
    })

@app.get('/warehousing/manager/dashboard', response_class=HTMLResponse)
def dashhboard(request: Request, db: Session = Depends(get_db), current_user: User = Depends(get_token)):
    return template.TemplateResponse('warehousing/manager/content/dashboard.html', 
    {
        'request': request
    })

@app.get('/warehousing/manager/supplies/', response_class=HTMLResponse)
def index(request: Request, db: Session = Depends(get_db), current_user: User = Depends(get_token)):
    try:
        supplies = db.query(Supplies).all()
        # suppliy_category = db.query(Supply_Categories).all()
        return template.TemplateResponse('warehousing/manager/content/supplies.html', 
        {
            'request': request,
            'supplies': supplies,
            # 'supply_category': suppliy_category
        })
    except Exception as e:
        print(e)

@app.get('/warehousing/manager/supply_categories/', response_class=HTMLResponse)
def index(request: Request, db: Session = Depends(get_db), current_user: User = Depends(get_token)):
    try:
        supply_categories = db.query(Supply_Categories).all()
        return template.TemplateResponse('warehousing/manager/content/supply_categories.html', 
        {
            'request': request,
            'supply_categories': supply_categories
        })
    except Exception as e:
        print(e)

        
@app.get('/warehousing/manager/inventories/', response_class=HTMLResponse)
def index(request: Request, db: Session = Depends(get_db), current_user: User = Depends(get_token)):
    try:
        inventories = db.query(Inventories).all()
        return template.TemplateResponse('warehousing/manager/content/inventories.html', 
        {
            'request': request,
            'inventories': inventories
        })
    except Exception as e:
        print(e)
            
@app.get('/warehousing/manager/inventory_locations/', response_class=HTMLResponse)
def index(request: Request, db: Session = Depends(get_db), current_user: User = Depends(get_token)):
    try:
        inventory_locations = db.query(Inventory_Locations).all()
        return template.TemplateResponse('warehousing/manager/content/inventory_locations.html', 
        {
            'request': request,
            'inventory_locations': inventory_locations
        })
    except Exception as e:
        print(e)

@app.get('/warehousing/manager/request/', response_class=HTMLResponse)
def index(request: Request, db: Session = Depends(get_db), current_user: User = Depends(get_token)):
    try:
        request_model = db.query(RequestModel).all()
        return template.TemplateResponse('warehousing/manager/content/request.html', 
        {
            'request': request,
            'request_model': request_model
        })
    except Exception as e:
        print(e)

@app.get('/warehousing/manager/return/', response_class=HTMLResponse)
def index(request: Request, db: Session = Depends(get_db), current_user: User = Depends(get_token)):
    try:
        return_model = db.query(ReturnModel).all()
        return template.TemplateResponse('warehousing/manager/content/return.html', 
        {
            'request': request,
            'return_model': return_model
        })
    except Exception as e:
        print(e)

@app.get('/warehousing/manager/outbound_reports/', response_class=HTMLResponse)
def index(request: Request, db: Session = Depends(get_db), current_user: User = Depends(get_token)):
    try:
        o_reports = db.query(Outbound_Reports).all()
        return template.TemplateResponse('warehousing/manager/content/outbound_reports.html', 
        {
            'request': request,
            'o_reports': o_reports
        })
    except Exception as e:
        print(e)

@app.get('/warehousing/manager/inbound_reports/', response_class=HTMLResponse)
def index(request: Request, db: Session = Depends(get_db), current_user: User = Depends(get_token)):
    try:
        i_reports = db.query(Inbound_Reports).all()
        return template.TemplateResponse('warehousing/manager/content/inbound_reports.html', 
        {
            'request': request,
            'i_reports': i_reports
        })
    except Exception as e:
        print(e)

@app.get('/warehousing/manager/suppliers/', response_class=HTMLResponse)
def index(request: Request, db: Session = Depends(get_db), current_user: User = Depends(get_token)):
    try:
        suppliers = db.query(Suppliers).all()
        return template.TemplateResponse('warehousing/manager/content/suppliers.html', 
        {
            'request': request,
            'suppliers': suppliers
        })
    except Exception as e:
        print(e)


@app.get('/warehousing/manager/employees/', response_class=HTMLResponse)
def index(request: Request, db: Session = Depends(get_db), current_user: User = Depends(get_token)):
    try:
        employees = db.query(Employees).all()
        return template.TemplateResponse('warehousing/manager/content/employees.html', 
        {
            'request': request,
            'employees': employees
        })
    except Exception as e:
        print(e)

# ------------ Warehousing Manager View --------------- #
@app.get('/warehousing/manager/supplies_details', response_class=HTMLResponse)
def index(request: Request, supply_id: str, db: Session = Depends(get_db), current_user: User = Depends(get_token)):
    try:
        supplies = db.query(Supplies).filter(Supplies.supply_id == supply_id).first()
        return template.TemplateResponse('warehousing/manager/content/viewSupplies.html', 
        {
            'request': request,
            'supplies': supplies
        })
    except Exception as e:
        print(e)


@app.get('/warehousing/manager/inventories/{inventory_id}', response_class=HTMLResponse)
def index(request: Request, inventory_id: str, db: Session = Depends(get_db), current_user: User = Depends(get_token)):
    try:
        inventories = db.query(Inventories).filter(Inventories.inventory_id == inventory_id).first()
        return template.TemplateResponse('warehousing/manager/content/viewInventories.html', 
        {
            'request': request,
            'inventories': inventories
        })
    except Exception as e:
        print(e)

@app.get('/warehousing/manager/request_details', response_class=HTMLResponse)
def index(request: Request, request_id: str, db: Session = Depends(get_db), current_user: User = Depends(get_token)):
    try:
        req = db.query(Request_Details).filter(Request_Details.request_id == request_id).all()
        return template.TemplateResponse('warehousing/manager/content/viewRequest.html', 
        {
            'request': request,
            'req': req
        })
    except Exception as e:
        print(e)

@app.get('/warehousing/manager/return_details', response_class=HTMLResponse)
def index(request: Request, return_id: str, db: Session = Depends(get_db), current_user: User = Depends(get_token)):
    try:
        ret = db.query(Return_Details).filter(Return_Details.return_id == return_id).all()
        return template.TemplateResponse('warehousing/manager/content/viewReturn.html', 
        {
            'request': request,
            'ret': ret
        })
    except Exception as e:
        print(e)

@app.get('/warehousing/manager/outbound_report_details', response_class=HTMLResponse)
def index(request: Request, outbound_report_id: str, db: Session = Depends(get_db), current_user: User = Depends(get_token)):
    try:
        out_report_d = db.query(Outbound_Report_Details).filter(Outbound_Report_Details.outbound_report_id == outbound_report_id).all()
        return template.TemplateResponse('warehousing/manager/content/viewOutboundReport.html', 
        {
            'request': request,
            'out_report_d': out_report_d
        })
    except Exception as e:
        print(e)

@app.get('/warehousing/manager/inbound_report_details', response_class=HTMLResponse)
def index(request: Request, inbound_report_id: str, db: Session = Depends(get_db), current_user: User = Depends(get_token)):
    try:
        in_report_d = db.query(Inbound_Reports).filter(Inbound_Reports.inbound_report_id == inbound_report_id).all()
        return template.TemplateResponse('warehousing/manager/content/viewInboundReport.html', 
        {
            'request': request,
            'in_report_d': in_report_d
        })
    except Exception as e:
        print(e)

# ---------------------------- Warehousing Staff Template ------------------------------ #
@app.get('/warehousing/staff/', response_class=HTMLResponse)
def dashhboard(request: Request, db: Session = Depends(get_db), current_user: User = Depends(get_token)):
    # users = db.query(User).filter(User.user_email == current_user).first()
    return template.TemplateResponse('warehousing/staff/content/dashboard.html', 
    {
        'request': request,
        # 'users': users
    })

@app.get('/warehousing/staff/dashboard', response_class=HTMLResponse)
def dashhboard(request: Request, db: Session = Depends(get_db), current_user: User = Depends(get_token)):
    return template.TemplateResponse('warehousing/staff/content/dashboard.html', 
    {
        'request': request
    })

@app.get('/warehousing/staff/supplies/', response_class=HTMLResponse)
def index(request: Request, db: Session = Depends(get_db), current_user: User = Depends(get_token)):
    try:
        supplies = db.query(Supplies).all()
        return template.TemplateResponse('warehousing/staff/content/supplies.html', 
        {
            'request': request,
            'supplies': supplies
        })
    except Exception as e:
        print(e)

@app.get('/warehousing/staff/supply_categories/', response_class=HTMLResponse)
def index(request: Request, db: Session = Depends(get_db), current_user: User = Depends(get_token)):
    try:
        supply_categories = db.query(Supply_Categories).all()
        return template.TemplateResponse('warehousing/staff/content/supply_categories.html', 
        {
            'request': request,
            'supply_categories': supply_categories
        })
    except Exception as e:
        print(e)

        
@app.get('/warehousing/staff/inventories/', response_class=HTMLResponse)
def index(request: Request, db: Session = Depends(get_db), current_user: User = Depends(get_token)):
    try:
        inventories = db.query(Inventories).all()
        return template.TemplateResponse('warehousing/staff/content/inventories.html', 
        {
            'request': request,
            'inventories': inventories
        })
    except Exception as e:
        print(e)
            
@app.get('/warehousing/staff/inventory_locations/', response_class=HTMLResponse)
def index(request: Request, db: Session = Depends(get_db), current_user: User = Depends(get_token)):
    try:
        inventory_locations = db.query(Inventory_Locations).all()
        return template.TemplateResponse('warehousing/staff/content/inventory_locations.html', 
        {
            'request': request,
            'inventory_locations': inventory_locations
        })
    except Exception as e:
        print(e)

@app.get('/warehousing/staff/request/', response_class=HTMLResponse)
def index(request: Request, db: Session = Depends(get_db), current_user: User = Depends(get_token)):
    try:
        request_model = db.query(RequestModel).all()
        return template.TemplateResponse('warehousing/staff/content/request.html', 
        {
            'request': request,
            'request_model': request_model
        })
    except Exception as e:
        print(e)

@app.get('/warehousing/staff/return/', response_class=HTMLResponse)
def index(request: Request, db: Session = Depends(get_db), current_user: User = Depends(get_token)):
    try:
        return_model = db.query(ReturnModel).all()
        return template.TemplateResponse('warehousing/staff/content/return.html', 
        {
            'request': request,
            'return_model': return_model
        })
    except Exception as e:
        print(e)

# ------------ Warehousing Staff View --------------- #
@app.get('/warehousing/staff/supplies/{supply_id}', response_class=HTMLResponse)
def index(request: Request, supply_id: str, db: Session = Depends(get_db), current_user: User = Depends(get_token)):
    try:
        supplies = db.query(Supplies).filter(Supplies.supply_id == supply_id).first()
        return template.TemplateResponse('warehousing/staff/content/viewSupplies.html', 
        {
            'request': request,
            'supplies': supplies
        })
    except Exception as e:
        print(e)

@app.get('/warehousing/staff/inventories/{inventory_id}', response_class=HTMLResponse)
def index(request: Request, inventory_id: str, db: Session = Depends(get_db), current_user: User = Depends(get_token)):
    try:
        inventories = db.query(Inventories).filter(Inventories.inventory_id == inventory_id).first()
        return template.TemplateResponse('warehousing/staff/content/viewInventories.html', 
        {
            'request': request,
            'inventories': inventories
        })
    except Exception as e:
        print(e)

@app.get('/warehousing/staff/request_details', response_class=HTMLResponse)
def index(request: Request, request_id: str, db: Session = Depends(get_db), current_user: User = Depends(get_token)):
    try:
        req = db.query(Request_Details).filter(Request_Details.request_id == request_id).all()
        return template.TemplateResponse('warehousing/staff/content/viewRequest.html', 
        {
            'request': request,
            'req': req
        })
    except Exception as e:
        print(e)

@app.get('/warehousing/staff/return_details', response_class=HTMLResponse)
def index(request: Request, return_id: str, db: Session = Depends(get_db), current_user: User = Depends(get_token)):
    try:
        ret = db.query(Return_Details).filter(Return_Details.return_id == return_id).all()
        return template.TemplateResponse('warehousing/staff/content/viewReturn.html', 
        {
            'request': request,
            'ret': ret
        })
    except Exception as e:
        print(e)

# ---------------------------- Warehousing- Procurement Template ------------------------------ #
@app.get('/warehousing/procurement/', response_class=HTMLResponse)
def dashhboard(request: Request, db: Session = Depends(get_db), current_user: User = Depends(get_token)):
    # users = db.query(User).filter(User.user_email == current_user).first()
    return template.TemplateResponse('procurement/head/content/request.html', 
    {
        'request': request,
        # 'users': users
    })

@app.get('/warehousing/procurement/request_details', response_class=HTMLResponse)
def index(request: Request, request_id: str, db: Session = Depends(get_db), current_user: User = Depends(get_token)):
    try:
        req = db.query(Request_Details).filter(Request_Details.request_id == request_id).all()
        return template.TemplateResponse('procurement/head/content/viewRequest.html', 
        {
            'request': request,
            'req': req
        })
    except Exception as e:
        print(e)

#-------------------------------------------- END OF Warehousing Template --------------------------------------------#
        
# ASSET MANAGEMENT ROUTES

@app.get("/", response_class=HTMLResponse)
def dashboard(request: Request,):
    return template.TemplateResponse("access/home.html", {"request": request})

@app.get("/login", response_class=HTMLResponse)
def dashboard(request: Request,):
    return template.TemplateResponse("access/login.html", {"request": request})

@app.get("/index", response_class=HTMLResponse)
def dashboard(request: Request,):
    return template.TemplateResponse("access/index.html", {"request": request})

@app.get("/forbidden", response_class=HTMLResponse)
def dashboard(request: Request,):
    return template.TemplateResponse("accesst/forbidden.html", {"request": request})

@app.get("/asset_management/", response_class=HTMLResponse)
def dashboard(request: Request,):
    return template.TemplateResponse("asset_management/admin/dashboard.html", {"request": request})

@app.get("/asset_management/requests", response_class=HTMLResponse)
def dashboard(request: Request,):
    return template.TemplateResponse("asset_management/admin/request_assets.html", {"request": request})

@app.get("/asset_management/asset_type", response_class=HTMLResponse)
def dashboard(request: Request,):
    return template.TemplateResponse("asset_management/admin/asset_type.html", {"request": request})

@app.get("/asset_management/asset_provider", response_class=HTMLResponse)
def dashboard(request: Request,):
    return template.TemplateResponse("asset_management/admin/asset_provider.html", {"request": request})

@app.get("/asset_management/asset", response_class=HTMLResponse)
def get_asset(request: Request,):
    return template.TemplateResponse("asset_management/admin/asset.html", {"request": request})

@app.get("/asset_management/asset/view/{id}", response_class=HTMLResponse)
def get_asset(request: Request, id: str):
    return template.TemplateResponse("asset_management/admin/asset_view.html", {"request": request, "id": id})

@app.get("/asset_management/maintenance_provider", response_class=HTMLResponse)
def dashboard(request: Request,):
    return template.TemplateResponse("asset_management/admin/maintenance_provider.html", {"request": request})

@app.get("/asset_management/maintenance_page", response_class=HTMLResponse)
def dashboard(request: Request,):
    return template.TemplateResponse("asset_management/admin/maintenance_page.html", {"request": request})

#-------------Equipment Manager----------------#

@app.get("/asset_management/manager", response_class=HTMLResponse)
def dashboard(request: Request,):
    return template.TemplateResponse("asset_management/equipment_manager/dashboard.html", {"request": request})

@app.get("/asset_management/manager/requests", response_class=HTMLResponse)
def dashboard(request: Request,):
    return template.TemplateResponse("asset_management/equipment_manager/request_assets.html", {"request": request})

@app.get("/asset_management/manager/asset_type", response_class=HTMLResponse)
def dashboard(request: Request,):
    return template.TemplateResponse("asset_management/equipment_manager/asset_type.html", {"request": request})

@app.get("/asset_management/manager/asset_provider", response_class=HTMLResponse)
def dashboard(request: Request,):
    return template.TemplateResponse("asset_management/equipment_manager/asset_provider.html", {"request": request})

@app.get("/asset_management/manager/asset", response_class=HTMLResponse)
def get_asset(request: Request,):
    return template.TemplateResponse("asset_management/equipment_manager/asset.html", {"request": request})

@app.get("/asset_management/manager/asset/view/{id}", response_class=HTMLResponse)
def get_asset(request: Request, id: str):
    return template.TemplateResponse("asset_management/equipment_manager/asset_view.html", {"request": request, "id": id})

@app.get("/asset_management/manager/maintenance_provider", response_class=HTMLResponse)
def dashboard(request: Request,):
    return template.TemplateResponse("asset_management/equipment_manager/maintenance_provider.html", {"request": request})

@app.get("/asset_management/manager/maintenance_page", response_class=HTMLResponse)
def dashboard(request: Request,):
    return template.TemplateResponse("asset_management/equipment_manager/maintenance_page.html", {"request": request})

#-------------USER----------------#

@app.get("/asset_management/user/on_hand_assets", response_class=HTMLResponse)
def get_asset(request: Request,):
    return template.TemplateResponse("asset_management/user/on_hand_assets.html", {"request": request})

@app.get("/asset_management/user/view_asset/{id}", response_class=HTMLResponse)
def get_asset(request: Request, id: str):
    return template.TemplateResponse("asset_management/user/on_hand_assets_view.html", {"request": request, "id": id})

@app.get("/asset_management/user/request_assets", response_class=HTMLResponse)
def get_asset(request: Request,):
    return template.TemplateResponse("asset_management/user/request_assets.html", {"request": request})
    

# ---------------------------------------------- PROJECT MANAGEMENT ---------------------------------------------- #
# ADMIN

# SYSADMIN PAGE
@app.get('/project_management/admin/sysadmin', response_class=HTMLResponse)
def sysadmin(request: Request, db: Session = Depends(get_db)):
    return template.TemplateResponse('project_management/admin/sysadmin.html', {
        'request': request,
    })

# JOB TITLES PAGE
@app.get('/project_management/admin/job_titles', response_class=HTMLResponse)
def user_types(request: Request, db: Session = Depends(get_db)):
    users = db.query(User).all()
    return template.TemplateResponse('project_management/admin/job_title.html', {
        'request': request,
        'users': users
    })

# USER TYPE PAGE
@app.get('/project_management/admin/user_type', response_class=HTMLResponse)
def user_types(request: Request, db: Session = Depends(get_db)):
    users = db.query(User).all()
    return template.TemplateResponse('project_management/admin/user_type.html', {
        'request': request,
        'users': users
    })

# USERS PAGE
@app.get('/project_management/admin/users', response_class=HTMLResponse)
def users(request: Request, db: Session = Depends(get_db)):
    users = db.query(User).all()
    return template.TemplateResponse('project_management/admin/users.html', {
        'request': request,
        'users': users
    })

# USER PROFILE PAGE
@app.get('/project_management/admin/user_profile', response_class=HTMLResponse)
def users(request: Request, db: Session = Depends(get_db)):
    users = db.query(User).all()
    return template.TemplateResponse('project_management/admin/user_profile.html', {
        'request': request,
        'users': users
    })

# EMPLOYEES
@app.get('/project_management/admin/employees', response_class=HTMLResponse)
def users(request: Request, db: Session = Depends(get_db)):
    users = db.query(User).all()
    return template.TemplateResponse('project_management/admin/employee.html', {
        'request': request,
        'users': users
    })

# DEPARTMENTS PAGE
@app.get('/project_management/admin/departments', response_class=HTMLResponse)
def departments(request: Request, db: Session = Depends(get_db)):
    users = db.query(User).all()
    return template.TemplateResponse('project_management/admin/departments.html', {
        'request': request,
        'users': users
    })

# MAIN DASHBOARD PAGE
@app.get('/project_management/admin/main_dashboard', response_class=HTMLResponse)
def main_dashboard(request: Request, db: Session = Depends(get_db)):
    return template.TemplateResponse('project_management/admin/main_dashboard.html', {
        'request': request,
    })

# DASHBOARD PAGE
@app.get('/project_management/admin/dashboard', response_class=HTMLResponse)
def dashboard(request: Request, db: Session = Depends(get_db)):
    users = db.query(User).all()
    data = db.query(Project).filter(Project.active_status == "Active", Project.approval_status == "Approved").all()
    tasks = db.query(Task).filter(Task.active_status == "Active").all()

    return template.TemplateResponse('project_management/admin/dashboard.html', {
        'request': request,
        'users': users,
        "data": data,
        "tasks": tasks
    })

# CONCEPT PAPER REQUESTS PAGE
@app.get('/project_management/admin/concept_paper_requisition', response_class=HTMLResponse)
def project_requisition(request: Request, db: Session = Depends(get_db)):
    return template.TemplateResponse('project_management/admin/concept_paper_requisition.html', {
        'request': request,
    })

# CONCEPT PAPER DETAILS PAGE
@app.get('/project_management/admin/concept_paper_details/{id}', response_class=HTMLResponse)
def project_requisition(id: str, request: Request, db: Session = Depends(get_db)):
    data = db.query(ConceptPaper).filter(ConceptPaper.id == id).first()
    return template.TemplateResponse('project_management/admin/concept_paper_details.html', {
        'request': request,
        'data': data
    })

# CALENDAR PAGE
@app.get('/project_management/admin/calendar', response_class=HTMLResponse)
def calendar(request: Request, db: Session = Depends(get_db)):
    users = db.query(User).all()
    return template.TemplateResponse('project_management/admin/calendar.html', {
        'request': request,
        'users': users
    })

# PROJECT REQUESTS PAGE
@app.get('/project_management/admin/project_requisition', response_class=HTMLResponse)
def project_requisition(request: Request, db: Session = Depends(get_db)):
    return template.TemplateResponse('project_management/admin/project_requisition.html', {
        'request': request,
    })

# PROJECT LISTS PAGE
@app.get('/project_management/admin/project_lists', response_class=HTMLResponse)
def project_lists(request: Request, db: Session = Depends(get_db)):
    return template.TemplateResponse('project_management/admin/project_lists.html', {
        'request': request,
    })

# CREATE PROJECT PAGE
@app.get('/project_management/admin/create_project', response_class=HTMLResponse)
def create_project(request: Request, db: Session = Depends(get_db)):
    return template.TemplateResponse('project_management/admin/create_project.html', {
        'request': request,
    })

# ALL PROJECT LISTS PAGE
@app.get('/project_management/admin/all_projects', response_class=HTMLResponse)
def all_projects_lists(request: Request, db: Session = Depends(get_db)):
    return template.TemplateResponse('project_management/admin/projects/all_projects.html', {
        'request': request,
    })

# ON PROGRESS PROJECT LISTS PAGE
@app.get('/project_management/admin/on_progress', response_class=HTMLResponse)
def on_progress_project_lists(request: Request, db: Session = Depends(get_db)):
    return template.TemplateResponse('project_management/admin/projects/on_progress_projects.html', {
        'request': request,
    })

# COMPLETED PROJECT LISTS PAGE
@app.get('/project_management/admin/completed', response_class=HTMLResponse)
def completed_project_lists(request: Request, db: Session = Depends(get_db)):
    return template.TemplateResponse('project_management/admin/projects/completed_projects.html', {
        'request': request,
    })

# CANCELLED PROJECT LISTS PAGE
@app.get('/project_management/admin/cancelled', response_class=HTMLResponse)
def cancelled_project_lists(request: Request, db: Session = Depends(get_db)):
    return template.TemplateResponse('project_management/admin/projects/cancelled_projects.html', {
        'request': request,
    })

# DELAYED PROJECT LISTS PAGE
@app.get('/project_management/admin/delayed', response_class=HTMLResponse)
def delayed_project_lists(request: Request, db: Session = Depends(get_db)):
    return template.TemplateResponse('project_management/admin/projects/delayed_projects.html', {
        'request': request,
    })

# ON HOLD PROJECT LISTS PAGE
@app.get('/project_management/admin/on_hold', response_class=HTMLResponse)
def on_hold_project_lists(request: Request, db: Session = Depends(get_db)):
    return template.TemplateResponse('project_management/admin/projects/on_hold_projects.html', {
        'request': request,
    })

# VIEW PROJECT PAGE
@app.get('/project_management/admin/view_project/{id}', response_class=HTMLResponse)
def view_one_project(id: str, request: Request, db: Session = Depends(get_db)):
    project = db.query(Project).filter(Project.id == id).first()
    return template.TemplateResponse('project_management/admin/view_project.html', {
        'request': request,
        'data': project
    })

# VIEW PROJECT DETAILS PAGE
@app.get('/project_management/admin/project_details/{id}', response_class=HTMLResponse)
def get_one_project(id: str, request: Request, db: Session = Depends(get_db)):
    project = db.query(Project).filter(Project.id == id).first()
    return template.TemplateResponse('project_management/admin/project_details.html', {
        'request': request,
        'data': project
    })

# ALL PROJECT QUOTATIONS PAGE
@app.get('/project_management/admin/project_quotations/{id}', response_class=HTMLResponse)
def view_project_quotation(id: str, request: Request, db: Session = Depends(get_db)):
    project = db.query(Project).filter(Project.id == id, Project.active_status == "Active").first()
    return template.TemplateResponse('project_management/admin/project_quotations.html', {
        'request': request,
        'data': project
    })

# ALL PROJECT TASKS PAGE
@app.get('/project_management/admin/all_project_task/{id}', response_class=HTMLResponse)
def view_all_project_task(id: str, request: Request, db: Session = Depends(get_db)):
    project = db.query(Project).filter(Project.id == id, Project.active_status == "Active").first()
    return template.TemplateResponse('project_management/admin/all_project_tasks.html', {
        'request': request,
        'data': project
    })

# TASKS LIST PAGE
@app.get('/project_management/admin/task_lists', response_class=HTMLResponse)
def task_lists(request: Request, db: Session = Depends(get_db)):
    return template.TemplateResponse('project_management/admin/task_lists.html', {
        'request': request,
    })

# TASK DETAILS PAGE
@app.get('/project_management/admin/task_details/{id}', response_class=HTMLResponse)
def get_one_task(id: str, request: Request, db: Session = Depends(get_db)):
    task = db.query(Task).filter(Task.id == id).first()
    return template.TemplateResponse('project_management/admin/task_details.html', {
        'request': request,
        'data': task
    })

# REPORTS PAGE
@app.get('/project_management/admin/reports', response_class=HTMLResponse)
def reports(request: Request, db: Session = Depends(get_db)):
    project = db.query(Project).filter(Project.active_status == "Active", Project.progress_status == "Completed").all()
    paper = db.query(ConceptPaper).filter(ConceptPaper.active_status == "Active", ConceptPaper.approval_status == "Approved").all()
    return template.TemplateResponse('project_management/admin/reports.html', {
        'request': request,
        'project': project,
        'paper': paper
    })

# TOR PAGE
@app.get('/project_management/admin/terms_of_reference', response_class=HTMLResponse)
def terms_of_reference(request: Request, db: Session = Depends(get_db)):
    return template.TemplateResponse('project_management/admin/terms_of_reference.html', {
        'request': request,
    })

# ARCHIVE PAGE
@app.get('/project_management/admin/archive', response_class=HTMLResponse)
def reports(request: Request, db: Session = Depends(get_db)):
    project = db.query(Project).filter(Project.active_status == "Active", Project.progress_status == "Completed").all()
    return template.TemplateResponse('project_management/admin/archive.html', {
        'request': request
    })

# DEPARTMENT HEAD

# MAIN DASHBOARD PAGE
@app.get('/project_management/department_head/main_dashboard', response_class=HTMLResponse)
def main_dashboard(request: Request, db: Session = Depends(get_db)):
    return template.TemplateResponse('project_management/department_head/main_dashboard.html', {
        'request': request,
    })

# DASHBOARD PAGE
@app.get('/project_management/department_head/dashboard', response_class=HTMLResponse)
def dashboard(request: Request, db: Session = Depends(get_db), current_user: User = Depends(get_token)):
    print(current_user)
    users = db.query(User).filter(User.user_email == current_user).first()
    employee = db.query(Employees).filter(Employees.user_id == users.user_id).first()
    project = db.query(Project).filter(Project.department_id == employee.department_id, Project.active_status == "Active", Project.approval_status == "Approved").all()
    tasks = []
    for i in range(len(project)):
        data = db.query(Task).filter(Task.active_status == "Active", Task.project_id == project[i].id).all()
        tasks.extend(data)
    return template.TemplateResponse('project_management/department_head/dashboard.html', {
        'request': request,
        "data": project,
        "tasks": tasks
    })

# CONCEPT PAPER REQUESTS PAGE
@app.get('/project_management/department_head/concept_paper_requisition', response_class=HTMLResponse)
def project_requisition(request: Request, db: Session = Depends(get_db)):
    return template.TemplateResponse('project_management/department_head/concept_paper_requisition.html', {
        'request': request,
    })

# CONCEPT PAPER DETAILS PAGE
@app.get('/project_management/department_head/concept_paper_details/{id}', response_class=HTMLResponse)
def concept_paper_details(id: str, request: Request, db: Session = Depends(get_db)):
    data = db.query(ConceptPaper).filter(ConceptPaper.id == id).first()
    return template.TemplateResponse('project_management/department_head/concept_paper_details.html', {
        'request': request,
        'data': data,
    })

# CALENDAR PAGE
@app.get('/project_management/department_head/calendar', response_class=HTMLResponse)
def calendar(request: Request, db: Session = Depends(get_db)):
    users = db.query(User).all()
    return template.TemplateResponse('project_management/department_head/calendar.html', {
        'request': request,
        'users': users
    })

# PROJECT REQUESTS PAGE
@app.get('/project_management/department_head/project_requisition', response_class=HTMLResponse)
def project_requisition(request: Request, db: Session = Depends(get_db)):
    return template.TemplateResponse('project_management/department_head/project_requisition.html', {
        'request': request,
    })

# PROJECT LISTS PAGE
@app.get('/project_management/department_head/project_lists', response_class=HTMLResponse)
def project_lists(request: Request, db: Session = Depends(get_db)):
    return template.TemplateResponse('project_management/department_head/project_lists.html', {
        'request': request,
    })

# CREATE PROJECT PAGE
@app.get('/project_management/department_head/create_project', response_class=HTMLResponse)
def create_project(request: Request, db: Session = Depends(get_db)):
    return template.TemplateResponse('project_management/department_head/create_project.html', {
        'request': request,
    })

# ALL PROJECT LISTS PAGE
@app.get('/project_management/department_head/all_projects', response_class=HTMLResponse)
def all_projects_lists(request: Request, db: Session = Depends(get_db)):
    return template.TemplateResponse('project_management/department_head/projects/all_projects.html', {
        'request': request,
    })

# ON PROGRESS PROJECT LISTS PAGE
@app.get('/project_management/department_head/on_progress', response_class=HTMLResponse)
def on_progress_project_lists(request: Request, db: Session = Depends(get_db)):
    return template.TemplateResponse('project_management/department_head/projects/on_progress_projects.html', {
        'request': request,
    })

# COMPLETED PROJECT LISTS PAGE
@app.get('/project_management/department_head/completed', response_class=HTMLResponse)
def completed_project_lists(request: Request, db: Session = Depends(get_db)):
    return template.TemplateResponse('project_management/department_head/projects/completed_projects.html', {
        'request': request,
    })

# CANCELLED PROJECT LISTS PAGE
@app.get('/project_management/department_head/cancelled', response_class=HTMLResponse)
def cancelled_project_lists(request: Request, db: Session = Depends(get_db)):
    return template.TemplateResponse('project_management/department_head/projects/cancelled_projects.html', {
        'request': request,
    })

# DELAYED PROJECT LISTS PAGE
@app.get('/project_management/department_head/delayed', response_class=HTMLResponse)
def delayed_project_lists(request: Request, db: Session = Depends(get_db)):
    return template.TemplateResponse('project_management/department_head/projects/delayed_projects.html', {
        'request': request,
    })

# ON HOLD PROJECT LISTS PAGE
@app.get('/department_head/on_hold', response_class=HTMLResponse)
def on_hold_project_lists(request: Request, db: Session = Depends(get_db)):
    return template.TemplateResponse('department_head/projects/on_hold_projects.html', {
        'request': request,
    })

# VIEW PROJECT PAGE
@app.get('/project_management/department_head/view_project/{id}', response_class=HTMLResponse)
def view_one_project(id: str, request: Request, db: Session = Depends(get_db)):
    project = db.query(Project).filter(Project.id == id).first()
    return template.TemplateResponse('project_management/department_head/view_project.html', {
        'request': request,
        'data': project
    })

# VIEW PROJECT DETAILS PAGE
@app.get('/project_management/department_head/project_details/{id}', response_class=HTMLResponse)
def get_one_project(id: str, request: Request, db: Session = Depends(get_db)):
    project = db.query(Project).filter(Project.id == id).first()
    return template.TemplateResponse('project_management/department_head/project_details.html', {
        'request': request,
        'data': project
    })

# ALL PROJECT QUOTATIONS PAGE
@app.get('/project_management/department_head/project_quotations/{id}', response_class=HTMLResponse)
def view_project_quotation(id: str, request: Request, db: Session = Depends(get_db)):
    project = db.query(Project).filter(Project.id == id, Project.active_status == "Active").first()
    return template.TemplateResponse('project_management/department_head/project_quotations.html', {
        'request': request,
        'data': project
    })

# ALL PROJECT TASKS PAGE
@app.get('/project_management/department_head/all_project_task/{id}', response_class=HTMLResponse)
def view_all_project_task(id: str, request: Request, db: Session = Depends(get_db)):
    project = db.query(Project).filter(Project.id == id, Project.active_status == "Active").first()
    return template.TemplateResponse('project_management/department_head/all_project_tasks.html', {
        'request': request,
        'data': project
    })

# TASKS LIST PAGE
@app.get('/project_management/department_head/task_lists', response_class=HTMLResponse)
def task_lists(request: Request, db: Session = Depends(get_db)):
    return template.TemplateResponse('project_management/department_head/task_lists.html', {
        'request': request,
    })

# TASK DETAILS PAGE
@app.get('/project_management/department_head/task_details/{id}', response_class=HTMLResponse)
def get_one_task(id: str, request: Request, db: Session = Depends(get_db)):
    task = db.query(Task).filter(Task.id == id).first()
    return template.TemplateResponse('project_management/department_head/task_details.html', {
        'request': request,
        'data': task
    })

# REPORTS PAGE
@app.get('/project_management/department_head/reports', response_class=HTMLResponse)
def reports(request: Request, db: Session = Depends(get_db), current_user: User = Depends(get_token)):
    users = db.query(User).filter(User.user_email == current_user).first()
    employee = db.query(Employees).filter(Employees.user_id == users.user_id).first()
    data = db.query(Project).filter(Project.active_status == "Active", Project.progress_status == "Completed", Project.department_id == employee.department_id).all()
    paper = db.query(ConceptPaper).filter(ConceptPaper.active_status == "Active", ConceptPaper.approval_status == "Approved", ConceptPaper.department_id == employee.department_id).all()
    return template.TemplateResponse('project_management/department_head/reports.html', {
        'request': request,
        'project': data,
        'paper': paper
    })

# TOR PAGE
@app.get('/project_management/department_head/terms_of_reference', response_class=HTMLResponse)
def terms_of_reference(request: Request, db: Session = Depends(get_db)):
    return template.TemplateResponse('project_management/department_head/terms_of_reference.html', {
        'request': request,
    })

# ARCHIVE PAGE
# @app.get('/department_head/archive', response_class=HTMLResponse)
# def reports(request: Request, db: Session = Depends(get_db)):
#     project = db.query(Project).filter(Project.active_status == "Active", Project.progress_status == "Completed").all()
#     return template.TemplateResponse('department_head/archive.html', {
#         'request': request
#     })

# CONTACT LOGS PAGE
@app.get('/project_management/department_head/logs', response_class=HTMLResponse)
def logs(request: Request, db: Session = Depends(get_db)):
    users = db.query(User).all()
    data = db.query(User).filter(User.active_status == "Active").all()
    return template.TemplateResponse('project_management/department_head/logs.html', {
        'request': request,
        'users': users,
        "data": data,
    })


# MANAGER

# MAIN DASHBOARD PAGE
@app.get('/project_management/project_officer/main_dashboard', response_class=HTMLResponse)
def main_dashboard(request: Request, db: Session = Depends(get_db)):
    return template.TemplateResponse('project_management/users/main_dashboard.html', {
        'request': request,
    })

# DASHBOARD PAGE
@app.get('/project_management/project_officer/dashboard', response_class=HTMLResponse)
def dashboard(request: Request, db: Session = Depends(get_db)):
    return template.TemplateResponse('project_management/users/dashboard.html', {
        'request': request,
    })

# CONCEPT PAPER REQUESTS PAGE
@app.get('/project_management/project_officer/concept_paper_requisition', response_class=HTMLResponse)
def concept_paper_requisition(request: Request, db: Session = Depends(get_db)):
    return template.TemplateResponse('project_management/users/concept_paper_requisition.html', {
        'request': request,
    })

# CREATE CONCEPT PAPER PAGE
@app.get('/project_management/project_officer/create_concept_paper', response_class=HTMLResponse)
def create_project(request: Request, db: Session = Depends(get_db)):
    return template.TemplateResponse('project_management/users/create_concept_paper.html', {
        'request': request,
    })

# CONCEPT PAPER DETAILS PAGE
@app.get('/project_management/project_officer/concept_paper_details/{id}', response_class=HTMLResponse)
def concept_paper_details(id: str, request: Request, db: Session = Depends(get_db)):
    data = db.query(ConceptPaper).filter(ConceptPaper.id == id).first()
    return template.TemplateResponse('project_management/users/concept_paper_details.html', {
        'request': request,
        'data': data,
    })

# CALENDAR PAGE
@app.get('/project_management/project_officer/calendar', response_class=HTMLResponse)
def calendar(request: Request, db: Session = Depends(get_db)):
    users = db.query(User).all()
    return template.TemplateResponse('project_management/users/calendar.html', {
        'request': request,
        'users': users
    })

# PROJECT REQUESTS PAGE
@app.get('/project_management/project_officer/project_requisition', response_class=HTMLResponse)
def project_requisition(request: Request, db: Session = Depends(get_db)):
    return template.TemplateResponse('project_management/users/project_requisition.html', {
        'request': request,
    })

# PROJECT LISTS PAGE
@app.get('/project_management/project_officer/project_lists', response_class=HTMLResponse)
def project_lists(request: Request, db: Session = Depends(get_db)):
    return template.TemplateResponse('project_management/users/project_lists.html', {
        'request': request,
    })

# CREATE PROJECT PAGE
@app.get('/project_management/project_officer/create_project', response_class=HTMLResponse)
def create_project(request: Request, db: Session = Depends(get_db)):
    return template.TemplateResponse('project_management/users/create_project.html', {
        'request': request,
    })

# VIEW PROJECT PAGE
@app.get('/project_management/project_officer/view_project/{id}', response_class=HTMLResponse)
def view_one_project(id: str, request: Request, db: Session = Depends(get_db)):
    project = db.query(Project).filter(Project.id == id).first()
    return template.TemplateResponse('project_management/users/view_project.html', {
        'request': request,
        'data': project
    })

# VIEW PROJECT DETAILS PAGE
@app.get('/project_management/project_officer/project_details/{id}', response_class=HTMLResponse)
def get_one_project(id: str, request: Request, db: Session = Depends(get_db)):
    project = db.query(Project).filter(Project.id == id).first()
    return template.TemplateResponse('project_management/users/project_details.html', {
        'request': request,
        'data': project
    })

# ALL PROJECT QUOTATIONS PAGE
@app.get('/project_management/project_officer/project_quotations/{id}', response_class=HTMLResponse)
def view_all_project_task(id: str, request: Request, db: Session = Depends(get_db)):
    data = db.query(Project).filter(Project.id == id, Project.active_status == "Active").first()
    return template.TemplateResponse('project_management/users/project_quotations.html', {
        'request': request,
        'data': data
    })

# ALL PROJECT TASKS PAGE
@app.get('/project_management/project_officer/all_project_task/{id}', response_class=HTMLResponse)
def view_all_project_task(id: str, request: Request, db: Session = Depends(get_db)):
    data = db.query(Project).filter(Project.id == id, Project.active_status == "Active").first()
    return template.TemplateResponse('project_management/users/all_project_tasks.html', {
        'request': request,
        'data': data
    })

# TASKS LIST PAGE
@app.get('/project_management/project_officer/task_lists', response_class=HTMLResponse)
def task_lists(request: Request, db: Session = Depends(get_db)):
    return template.TemplateResponse('project_management/users/task_lists.html', {
        'request': request,
    })

# TASK DETAILS PAGE
@app.get('/project_management/project_officer/task_details/{id}', response_class=HTMLResponse)
def get_one_task(id: str, request: Request, db: Session = Depends(get_db)):
    task = db.query(Task).filter(Task.id == id).first()
    return template.TemplateResponse('project_management/users/task_details.html', {
        'request': request,
        'data': task
    })

# REPORTS PAGE
@app.get('/project_management/project_officer/reports', response_class=HTMLResponse)
def reports(request: Request, db: Session = Depends(get_db), current_user: User = Depends(get_token)):
    users = db.query(User).filter(User.user_email == current_user).first()
    employee = db.query(Employees).filter(Employees.user_id == users.user_id).first()
    data = db.query(Project).filter(Project.active_status == "Active", Project.progress_status == "Completed", Project.manager_id == employee.employee_id).all()
    paper = db.query(ConceptPaper).filter(ConceptPaper.active_status == "Active", ConceptPaper.approval_status == "Approved", ConceptPaper.manager_id == employee.employee_id).all()
    return template.TemplateResponse('project_management/users/reports.html', {
        'request': request,
        'project': data,
        'paper': paper
    })

# TOR PAGE
@app.get('/project_management/project_officer/terms_of_reference', response_class=HTMLResponse)
def terms_of_reference(request: Request, db: Session = Depends(get_db)):
    return template.TemplateResponse('project_management/users/terms_of_reference.html', {
        'request': request,
    })

# ERROR PAGE
@app.get('/project_management/error_page', response_class=HTMLResponse)
def project_lists(request: Request, db: Session = Depends(get_db)):
    return template.TemplateResponse('project_management/error_page.html', {
        'request': request,
    })



# ---------------------------- PROCUREMENT Template ------------------------------ #
from pages_routers.procurement.p_manager_pages import p_manager_user_pages
from pages_routers.procurement.p_officer_pages import p_officer_user_pages
from pages_routers.procurement.dept_user_pages import dept_user_pages
from pages_routers.procurement.vendor_pages import vendor_user_pages
from pages_routers.procurement.admin import admin_user_pages
from pages_routers.general.general import general_user_pages


# web pages
app.include_router(p_manager_user_pages)
app.include_router(p_officer_user_pages)
app.include_router(dept_user_pages)
app.include_router(vendor_user_pages)
app.include_router(admin_user_pages)
app.include_router(general_user_pages)