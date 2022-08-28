

from fastapi import APIRouter
from fastapi import Request
from fastapi.responses import HTMLResponse
from fastapi.templating import Jinja2Templates
from sqlalchemy.orm.session import Session
from fastapi import FastAPI, Request, Depends

templates = Jinja2Templates(directory="templates")

general_user_pages = APIRouter()







@general_user_pages.get('/main-dashboard', response_class=HTMLResponse,tags=["Web Pages"])
async def landing_dashboard(request: Request):
    return templates.TemplateResponse('internal/main_dashboard.html',{"request": request})


    
@general_user_pages.get('/login', response_class=HTMLResponse, tags=["Web Pages"])
async def login(request: Request):
    data = {
        "page": "Login page"
    }
    return templates.TemplateResponse("internal/login.html", {"request":request,"data": data})


@general_user_pages.get('/', response_class=HTMLResponse,tags=["Web Pages"])
async def index(request: Request):
    return templates.TemplateResponse('public/index.html',{"request": request})

@general_user_pages.get('/find-doctor', response_class=HTMLResponse,tags=["Web Pages"])
async def find_doctor(request: Request):
    return templates.TemplateResponse('public/find_doctor.html',{"request": request})