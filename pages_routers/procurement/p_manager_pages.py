


from fastapi import APIRouter
from fastapi import Request
from fastapi.responses import HTMLResponse
from fastapi.templating import Jinja2Templates


templates = Jinja2Templates(directory="templates")

p_manager_user_pages = APIRouter()









@p_manager_user_pages.get('/procurement/dashboard3', response_class=HTMLResponse,tags=["Web Pages"])
async def dashboard(request: Request):
    return templates.TemplateResponse('procurement/internal/procurement_manager/dashboard3.html',{"request": request})




#Procurement Manager
@p_manager_user_pages.get('/procurement/purchase-order-list/', response_class=HTMLResponse,tags=["Web Pages"])
async def po_list(request: Request):
    return templates.TemplateResponse('procurement/internal/procurement_manager/purchase_order_list.html',{"request": request})



@p_manager_user_pages.get('/procurement/purchase-request-approval/', response_class=HTMLResponse,tags=["Web Pages"])
async def pr_list(request: Request):
    return templates.TemplateResponse('procurement/internal/procurement_manager/requisition_approval.html',{"request": request})



@p_manager_user_pages.get('/procurement/budgets/', response_class=HTMLResponse,tags=["Web Pages"])
async def budgets(request: Request):
    return templates.TemplateResponse('procurement/internal/procurement_manager/budgets.html',{"request": request})



# Reports
@p_manager_user_pages.get('/procurement/pr-list-reports/', response_class=HTMLResponse,tags=["Web Pages"])
async def pr_reports(request: Request):
    return templates.TemplateResponse('procurement/internal/procurement_manager/list_of_pr_reports.html',{"request": request})


@p_manager_user_pages.get('/procurement/rfq-list-reports/', response_class=HTMLResponse,tags=["Web Pages"])
async def rfq_reports(request: Request):
    return templates.TemplateResponse('procurement/internal/procurement_manager/list_of_rfq_reports.html',{"request": request})


@p_manager_user_pages.get('/procurement/po-list-reports/', response_class=HTMLResponse,tags=["Web Pages"])
async def po_reports(request: Request):
    return templates.TemplateResponse('procurement/internal/procurement_manager/list_of_po_reports.html',{"request": request})


@p_manager_user_pages.get('/procurement/vendor-list-reports/', response_class=HTMLResponse,tags=["Web Pages"])
async def vendor_reports(request: Request):
    return templates.TemplateResponse('procurement/internal/procurement_manager/list_of_vendor_reports.html',{"request": request})

@p_manager_user_pages.get('/procurement/vendor-login-trail/', response_class=HTMLResponse,tags=["Web Pages"])
async def vendor_login_trail(request: Request):
    return templates.TemplateResponse('procurement/internal/procurement_manager/vendor_login_trail.html',{"request": request})

@p_manager_user_pages.get('/procurement/vendor-audit-trail/', response_class=HTMLResponse,tags=["Web Pages"])
async def vendor_audit_trail(request: Request):
    return templates.TemplateResponse('procurement/internal/procurement_manager/vendor_audit_trail.html',{"request": request})


@p_manager_user_pages.get('/procurement/blacklist-reports/', response_class=HTMLResponse,tags=["Web Pages"])
async def blacklist_reports(request: Request):
    return templates.TemplateResponse('procurement/internal/procurement_manager/blacklist_reports.html',{"request": request})


@p_manager_user_pages.get('/procurement/invalid-logins-reports/', response_class=HTMLResponse,tags=["Web Pages"])
async def invalid_login(request: Request):
    return templates.TemplateResponse('procurement/internal/procurement_manager/invalid_logins.html',{"request": request})


#System Setup
@p_manager_user_pages.get('/procurement/department-setup/', response_class=HTMLResponse,tags=["Web Pages"])
async def department(request: Request):
    return templates.TemplateResponse('procurement/internal/system_setup/department.html',{"request": request})


@p_manager_user_pages.get('/procurement/budget-plan-setup/', response_class=HTMLResponse,tags=["Web Pages"])
async def budget_plan_setup(request: Request):
    return templates.TemplateResponse('procurement/internal/system_setup/budget_plan.html',{"request": request})


@p_manager_user_pages.get('/procurement/category-setup/', response_class=HTMLResponse,tags=["Web Pages"])
async def category(request: Request):
    return templates.TemplateResponse('procurement/internal/system_setup/category.html',{"request": request})

@p_manager_user_pages.get('/procurement/product-setup/', response_class=HTMLResponse,tags=["Web Pages"])
async def product_page(request: Request):
    return templates.TemplateResponse('procurement/internal/system_setup/product.html',{"request": request})
