from fastapi import APIRouter
from fastapi import Request
from fastapi.responses import HTMLResponse
from fastapi.templating import Jinja2Templates


templates = Jinja2Templates(directory="templates")

dept_user_pages = APIRouter()


#Purchase Request Users

# dashboard for department users
@dept_user_pages.get('/procurement/dashboard1', response_class=HTMLResponse,tags=["Web Pages"])
async def dashboard(request: Request):
    return templates.TemplateResponse('internal/pr_users/dashboard1.html',{"request": request})

@dept_user_pages.get('/procurement/purchase-request/', response_class=HTMLResponse,tags=["Web Pages"])
async def purchase_request(request: Request):
    return templates.TemplateResponse('internal/pr_users/purchase_request.html',{"request": request})


# @dept_user_pages.get('/procurement/terms-of-reference/', response_class=HTMLResponse,tags=["Web Pages"])
# async def terms_of_reference(request: Request):
#     return templates.TemplateResponse('internal/pr_users/terms_of_reference.html',{"request": request})


# department / warehouse users
# @app.get('/procurement/budget-plan/', response_class=HTMLResponse,tags=["Web Pages"])
# async def budget_plan(request: Request):
#     return templates.TemplateResponse('internal/pr_users/budget_plan.html',{"request": request})


@dept_user_pages.get('/procurement/request-list/', response_class=HTMLResponse,tags=["Web Pages"])
async def request_list(request: Request):
    return templates.TemplateResponse('internal/pr_users/request_list.html',{"request": request})

# @app.get('/procurement/vendor-evaluation/', response_class=HTMLResponse,tags=["Web Pages"])
# async def purchase_request(request: Request):
#     return templates.TemplateResponse('internal/pr_users/vendor_evaluation.html',{"request": request})


@dept_user_pages.get('/procurement/our-budget/', response_class=HTMLResponse,tags=["Web Pages"])
async def dept_budget(request: Request):
    return templates.TemplateResponse('internal/pr_users/dept_budegts.html',{"request": request})