from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from typing import List
from repository.procurement import budget_plan
from .. import database
from security import oauth2

from schemas.procurement.budget_plan import BudgetPlan, BudgetPlanPO, BudgetPlanStatus,ShowBudgetPlan
from schemas.procurement.user import User


from typing import List
router = APIRouter(
    prefix="/api/v1/budget-plan",
    tags=['Budget_plan']
)

get_db = database.get_db


# get all budget of the year
@router.get('/charts/{year}', response_model=List[ShowBudgetPlan])
def get_budget(year, db : Session = Depends(get_db), current_user: BudgetPlan = Depends(oauth2.get_current_user)):
    return budget_plan.get_budget(year,db)

# get budget of specific department and specific year
@router.get('/charts/{department_id}/{year}', response_model=ShowBudgetPlan)
def get_one_budget(department_id, year, db : Session = Depends(get_db), current_user: BudgetPlan = Depends(oauth2.get_current_user)):
    return budget_plan.get_one_budget(department_id, year,db)

# get budget spent of specific department
@router.get('/dept-spent/{department_id}/{year}')
def get_dept_spent(department_id,year, db : Session = Depends(get_db), current_user: BudgetPlan = Depends(oauth2.get_current_user)):
    return budget_plan.get_dept_spent(department_id,year,db)


# get all budget of specific department
@router.get('/datatable/{id}', response_model=List[ShowBudgetPlan])
def get_budget_department(id, db : Session = Depends(get_db), current_user: User = Depends(oauth2.get_current_user)):
    return budget_plan.get_budget_department(id, db)


# create
@router.post('/', status_code=status.HTTP_201_CREATED)
def create_budget(request: BudgetPlan, db : Session = Depends(get_db)):#, current_user: User = Depends(oauth2.get_current_user)
    return budget_plan.create(request, db)


# delete
@router.delete('/delete/{id}', status_code=status.HTTP_204_NO_CONTENT)#HTTP_204_NO_CONTENT
def delete_budget(id,db : Session = Depends(get_db), current_user: BudgetPlan = Depends(oauth2.get_current_user)):
    return budget_plan.delete(id, db)

# update
@router.put('/{id}',status_code=status.HTTP_202_ACCEPTED)
def update_budget(id, request: BudgetPlan, db : Session = Depends(get_db), current_user: BudgetPlan = Depends(oauth2.get_current_user)):
    return budget_plan.update(id, request, db)


# update status - activate / deactivate
@router.put('/{id}',status_code=status.HTTP_202_ACCEPTED)
def update_budget_status(id: str,db : Session = Depends(get_db), current_user: BudgetPlan = Depends(oauth2.get_current_user)):
    return budget_plan.update_status(id, db)


# get one
@router.get('/{id}', status_code=status.HTTP_200_OK, response_model=ShowBudgetPlan)
def get_one(id,  db : Session = Depends(get_db), current_user: User = Depends(oauth2.get_current_user)):
    return budget_plan.get_one(id, db)
    

# update budget every purchase order transacions
@router.put('/{given_budget}/{total_amount}/{year}/{department_id}',status_code=status.HTTP_202_ACCEPTED)
def update_budget_po(given_budget:float,total_amount:float,year,department_id, db : Session = Depends(get_db), current_user: BudgetPlan = Depends(oauth2.get_current_user)):
    return budget_plan.update_budget_po(given_budget,total_amount,year,department_id, db)