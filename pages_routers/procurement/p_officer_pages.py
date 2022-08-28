
from fastapi import APIRouter
from fastapi import Request
from fastapi.responses import HTMLResponse
from fastapi.templating import Jinja2Templates
import os
dirname = os.getcwd()

p_officer_user_pages = APIRouter()

templates = Jinja2Templates(directory="templates")



@p_officer_user_pages.get('/procurement/dashboard2', response_class=HTMLResponse,tags=["Web Pages"])
async def read_product(request: Request):
    return templates.TemplateResponse('procurement/internal/procurement_officer/dashboard2.html',{"request": request})




#Procurement Officer
@p_officer_user_pages.get('/procurement/vendor-evaluation/', response_class=HTMLResponse,tags=["Web Pages"])
async def evaluation(request: Request):
    return templates.TemplateResponse('procurement/internal/procurement_officer/vendor_evaluation.html',{"request": request})

@p_officer_user_pages.get('/procurement/performance-assessment/', response_class=HTMLResponse,tags=["Web Pages"])
async def assessment(request: Request):
    return templates.TemplateResponse('internal/procurement_officer/performance_assessment.html',{"request": request})


@p_officer_user_pages.get('/procurement/purchase-order/', response_class=HTMLResponse,tags=["Web Pages"])
async def purchase_order_page(request: Request):
    return templates.TemplateResponse('procurement/internal/procurement_officer/purchase_order.html',{"request": request})

@p_officer_user_pages.get('/procurement/purchase-order-details/', response_class=HTMLResponse,tags=["Web Pages"])
async def purchase_order_details_page(request: Request):
    return templates.TemplateResponse('procurement/internal/procurement_officer/purchase_order_details.html',{"request": request})
    
@p_officer_user_pages.get('/procurement/vendor-setup/', response_class=HTMLResponse,tags=["Web Pages"])
async def vendor_setup(request: Request):
    return templates.TemplateResponse('procurement/internal/procurement_officer/vendor.html',{"request": request})

# @p_officer_user_pages.get('/procurement/evaluation-schedules/', response_class=HTMLResponse,tags=["Web Pages"])
# async def vendor_management(request: Request):
#     return templates.TemplateResponse('internal/procurement_officer/evaluation_schedule.html',{"request": request})

# @p_officer_user_pages.get('/procurement/evaluation-results/', response_class=HTMLResponse,tags=["Web Pages"])
# async def vendor_management(request: Request):
#     return templates.TemplateResponse('internal/procurement_officer/evaluation_results.html',{"request": request})

@p_officer_user_pages.get('/procurement/vendor-transactions/', response_class=HTMLResponse,tags=["Web Pages"])
async def vendor_scores(request: Request):
    return templates.TemplateResponse('procurement/internal/procurement_officer/vendor_transactions.html',{"request": request})


@p_officer_user_pages.get('/procurement/rfq-services/', response_class=HTMLResponse,tags=["Web Pages"])
async def rfq(request: Request):
    return templates.TemplateResponse('procurement/internal/procurement_officer/rfq_for_services.html',{"request": request})

@p_officer_user_pages.get('/procurement/rfq-products/', response_class=HTMLResponse,tags=["Web Pages"])
async def rfq(request: Request):
    return templates.TemplateResponse('procurement/internal/procurement_officer/rfq_for_products.html',{"request": request})

@p_officer_user_pages.get('/procurement/vendor-proposals/', response_class=HTMLResponse,tags=["Web Pages"])
async def vendor_proposals(request: Request):
    return templates.TemplateResponse('procurement/internal/procurement_officer/vendor_proposals.html',{"request": request})

@p_officer_user_pages.get('/procurement/approved-pr/', response_class=HTMLResponse,tags=["Web Pages"])
async def approved_pr(request: Request):
    return templates.TemplateResponse('procurement/internal/procurement_officer/approved_pr.html',{"request": request})

@p_officer_user_pages.get('/procurement/approved-project/', response_class=HTMLResponse,tags=["Web Pages"])
async def approved_project(request: Request):
    return templates.TemplateResponse('procurement/internal/procurement_officer/approved_project.html',{"request": request})


@p_officer_user_pages.get('/procurement/utilities/', response_class=HTMLResponse,tags=["Web Pages"])
async def utilities(request: Request):
    return templates.TemplateResponse('procurement/internal/procurement_officer/utilities.html',{"request": request})



@p_officer_user_pages.get('/procurement/terms-of-reference/', response_class=HTMLResponse,tags=["Web Pages"])
async def tor(request: Request):
    return templates.TemplateResponse('procurement/internal/procurement_officer/terms_of_reference.html',{"request": request})


@p_officer_user_pages.get('/procurement/invoices/', response_class=HTMLResponse,tags=["Web Pages"])
async def purchase_order_invoice(request: Request):
    return templates.TemplateResponse('procurement/internal/procurement_officer/invoice.html',{"request": request})


@p_officer_user_pages.get('/procurement/po-returns/', response_class=HTMLResponse,tags=["Web Pages"])
async def returns(request: Request):
    return templates.TemplateResponse('procurement/internal/procurement_officer/returns.html',{"request": request})