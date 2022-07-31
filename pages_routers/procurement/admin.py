
from fastapi import APIRouter
from fastapi import Request
from fastapi.responses import HTMLResponse
from fastapi.templating import Jinja2Templates






templates = Jinja2Templates(directory="templates")
admin_user_pages = APIRouter()


    




# User Management
@admin_user_pages.get('/procurement/user/', response_class=HTMLResponse,tags=["Web Pages"])
async def user_page(request: Request):
    return templates.TemplateResponse('internal/admin/user.html',{"request": request})

@admin_user_pages.get('/procurement/user-type/', response_class=HTMLResponse,tags=["Web Pages"])
async def user_type_page(request: Request):
    return templates.TemplateResponse('internal/admin/user_type.html',{"request": request})

@admin_user_pages.get('/procurement/employee-type/', response_class=HTMLResponse,tags=["Web Pages"])
async def user_type_page(request: Request):
    return templates.TemplateResponse('internal/admin/employee_type.html',{"request": request})

@admin_user_pages.get('/procurement/employee/', response_class=HTMLResponse,tags=["Web Pages"])
async def user_type_page(request: Request):
    return templates.TemplateResponse('internal/admin/employee.html',{"request": request})

# system admin
@admin_user_pages.get('/procurement/sysadmin/', response_class=HTMLResponse,tags=["Web Pages"])
async def sysadmin_page(request: Request):
    return templates.TemplateResponse('internal/admin/sysadmin.html',{"request": request})
