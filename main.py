from fastapi import FastAPI, Request, Depends
from fastapi.responses import HTMLResponse
from fastapi.templating import Jinja2Templates
from fastapi.staticfiles import StaticFiles
from sqlalchemy.orm import Session
from sqlalchemy.sql.functions import count
from database import Base, get_db, engine
from dependencies import get_token

from routes.asset_management import asset_route, asset_type_route, asset_provider_route, maintenance_provider_route, maintenance_route, auth_route, event_route
from routes.asset_management import missing_asset_route, asset_request_route, sell_asset_route, dispose_asset_route, broken_asset_route, repair_asset_route
from routes.asset_management import department_route, maintenance_report_route, check_out_route, check_in_route, asset_warranty_route

# importing all admin routes
from routes.Admin import (#authRoutes
                    employeeRoutes
                    , supplyRoutes
                    , postRoutes 
                    , hospital_departmentRoutes
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
                    , hospital_departmentModel
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
from models.Admin.hospital_departmentModel import Hospital_Departments
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
from models.procurement.budget_plan import BudgetPlan 
from models.procurement.category import Category 
from models.procurement.vendor import Vendor 
from models.procurement.vendor_performance_evaluation import VendorPerformanceEvaluation 
from models.procurement.purchase_order_detail import PurchaseOrderDetail 
from models.procurement.vendor_proposal import VendorProposals
from models.procurement.vendor_bidding_items import VendorBiddingItems
from models.procurement.product import Product 

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
# from .replacement_items import ReplacementItems

# importing all procurement routes
# from routes.procurement import (purchase_order_invoice, user, login, user_type,product, category, department,budget_plan, vendor_performance_evaluation,vendor_proposal, vendor_login, terms_of_reference,
# purchase_order,purchase_requisition,purchase_requisition_detail,request_quotation,vendor, vendor_bidding_item, notif,project_request,
# vendor_log_time,vendor_audit_trail,related_documents, utility,rfq_vendor,employee,employee_type,payment_method,payment_terms,returns,return_details,replacement_request)


# creating all models
Base.metadata.create_all(engine)

app = FastAPI()
# Mount static folder
app.mount('/static', StaticFiles(directory='static'), name='static')

# Register Routes
# app.include_router(authRoutes.router)
app.include_router(employeeRoutes.router)
app.include_router(supplyRoutes.router)
app.include_router(hospital_departmentRoutes.router)
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

app.include_router(countRequestDetail_Supply.router)
app.include_router(countSupply.router)
app.include_router(countRequest_Pending.router)
app.include_router(countReturn_Pending.router)
app.include_router(countFromHospital.router)
app.include_router(countFromProcurement.router)
app.include_router(count_analytics.router)

app.include_router(requestFilter.router)

#Saling Pusa
app.include_router(postRoutes.router)


# Register template folder
template = Jinja2Templates('templates')

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

# ---------------------------- HomePage Template ------------------------------ #
@app.get('/homies', response_class=HTMLResponse)
def landing(request: Request):
    return template.TemplateResponse('index.html', 
    {
        'request': request
    })

# ---------------------------- Access Template ------------------------------ #
@app.get('/homies/main', response_class=HTMLResponse)
def dashMain(request: Request):
    return template.TemplateResponse('mainDashboard.html', 
    {
        'request': request
    })

@app.get('/homies/systemAdmin', response_class=HTMLResponse)
def dashMain(request: Request):
    return template.TemplateResponse('systemAdminMain.html', 
    {
        'request': request
    }) 

@app.get('/homies/systemAdmin/users', response_class=HTMLResponse)
def index(request: Request, db: Session = Depends(get_db), current_user: User = Depends(get_token)):
    try:
        users = db.query(User).all()
        return template.TemplateResponse('systemAdmin_Users.html', 
        {
            'request': request,
            'users': users
        })
    except Exception as e:
        print(e)
 

# ---------------------------- Access Template ------------------------------ #
@app.get('/homies/login', response_class=HTMLResponse)
def login(request: Request):
    return template.TemplateResponse('access/login.html', 
    {
        'request': request
    })

# ---------------------------- Admin Template ------------------------------ #
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
        hospital_departments = db.query(Hospital_Departments).all()
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

# ------------ Admin View --------------- #
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



# ---------------------------- Manager Template ------------------------------ #
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

# ------------ Manager View --------------- #
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

# ---------------------------- Staff Template ------------------------------ #
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

# ------------ Staff View --------------- #
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

# ---------------------------- Procurement Template ------------------------------ #
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
        
# ASSET MANAGEMENT ROUTES

@app.get("/", response_class=HTMLResponse)
def dashboard(request: Request,):
    return template.TemplateResponse("asset_management/home.html", {"request": request})

@app.get("/login", response_class=HTMLResponse)
def dashboard(request: Request,):
    return template.TemplateResponse("asset_management/login.html", {"request": request})

@app.get("/index", response_class=HTMLResponse)
def dashboard(request: Request,):
    return template.TemplateResponse("asset_management/index.html", {"request": request})

@app.get("/forbidden", response_class=HTMLResponse)
def dashboard(request: Request,):
    return template.TemplateResponse("asset_management/forbidden.html", {"request": request})

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

@app.get("/asset_management/sysAdmin/users", response_class=HTMLResponse)
def dashboard(request: Request,):
    return template.TemplateResponse("asset_management/admin/sysAdmin/user.html", {"request": request})

@app.get("/asset_management/sysAdmin/department", response_class=HTMLResponse)
def dashboard(request: Request,):
    return template.TemplateResponse("asset_management/admin/sysAdmin/department.html", {"request": request})

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
    