
from fastapi import APIRouter
from fastapi import Request
from fastapi.responses import HTMLResponse
from fastapi.templating import Jinja2Templates
from sqlalchemy.orm.session import Session
from fastapi import FastAPI, Request, Depends
from ... import database


templates = Jinja2Templates(directory="templates")

vendor_user_pages = APIRouter()









# vendor portal
@vendor_user_pages.get('/vendor-login', response_class=HTMLResponse,tags=["Web Pages"])
async def vendor_login(request: Request,db: Session = Depends(database.get_db)):
    # user_type = db.query(models.UserType).filter(models.UserType.id == models.User.user_type_id).first()
    return templates.TemplateResponse('public/vendor/vendor_login.html',{"request": request})

# vendor portal
# @vendor_user_pages.get('/vendor-application', response_class=HTMLResponse,tags=["Web Pages"])
# async def vendor_application(request: Request,db: Session = Depends(database.get_db)):
#     # user_type = db.query(models.UserType).filter(models.UserType.id == models.User.user_type_id).first()
#     return templates.TemplateResponse('public/vendor/vendor_application.html',{"request": request})

@vendor_user_pages.get('/vendor/dashboard/', response_class=HTMLResponse,tags=["Web Pages"])
async def vendor_dashboard(request: Request):
    return templates.TemplateResponse('public/vendor/dashboard.html',{"request": request})

@vendor_user_pages.get('/vendor/quotations-services/', response_class=HTMLResponse,tags=["Web Pages"])
async def vendor_rfq_services(request: Request):
    return templates.TemplateResponse('public/vendor/rfqs_for_services.html',{"request": request})


@vendor_user_pages.get('/vendor/quotations-products/', response_class=HTMLResponse,tags=["Web Pages"])
async def vendor_rfq_products(request: Request):
    return templates.TemplateResponse('public/vendor/rfqs_for_products.html',{"request": request})

# @vendor_user_pages.get('/vendor/create-proposal/', response_class=HTMLResponse,tags=["Web Pages"])
# async def vendor_proposals(request: Request):
#     return templates.TemplateResponse('public/vendor/create_proposal.html',{"request": request})


@vendor_user_pages.get('/vendor/proposals/', response_class=HTMLResponse,tags=["Web Pages"])
async def vendor_proposals(request: Request):
    return templates.TemplateResponse('public/vendor/proposals.html',{"request": request})

@vendor_user_pages.get('/vendor/list-of-orders/', response_class=HTMLResponse,tags=["Web Pages"])
async def vendor_po(request: Request):
    return templates.TemplateResponse('public/vendor/orders.html',{"request": request})

@vendor_user_pages.get('/vendor/reviews/', response_class=HTMLResponse,tags=["Web Pages"])
async def reviews(request: Request):
    return templates.TemplateResponse('public/vendor/reviews.html',{"request": request})

@vendor_user_pages.get('/vendor/account/', response_class=HTMLResponse,tags=["Web Pages"])
async def vendor_account(request: Request):
    return templates.TemplateResponse('public/vendor/vendor_account.html',{"request": request})

@vendor_user_pages.get('/vendor/invoice/', response_class=HTMLResponse,tags=["Web Pages"])
async def invoice(request: Request):
    return templates.TemplateResponse('public/vendor/invoice.html',{"request": request})

@vendor_user_pages.get('/vendor/replacement-request/', response_class=HTMLResponse,tags=["Web Pages"])
async def returns(request: Request):
    return templates.TemplateResponse('public/vendor/replacement_request.html',{"request": request})


@vendor_user_pages.get('/vendor/terms-of-reference/', response_class=HTMLResponse,tags=["Web Pages"])
async def returns(request: Request):
    return templates.TemplateResponse('public/vendor/terms_of_reference.html',{"request": request})