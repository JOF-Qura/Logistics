from fastapi import status, HTTPException
from sqlalchemy.orm import Session

from models import procurement as models

from fastapi import HTTPException, status
from schemas.procurement.budget_plan import BudgetPlan, BudgetPlanPO, BudgetPlanStatus
from collections import defaultdict
from sqlalchemy import and_


# get all budget of the year
def get_budget(year, db : Session):
    budget = db.query(models.BudgetPlan).filter(models.BudgetPlan.year == year).filter(models.BudgetPlan.status != "Inactive").all()
    return budget

# get budget of specific department and specific year
def get_one_budget(department_id,year, db : Session):
    budget = db.query(models.BudgetPlan).filter(models.BudgetPlan.year == year).filter(models.BudgetPlan.department_id == department_id).first()
    return budget

# get all budget of specific department
def get_budget_department(id, db : Session):
    budget = db.query(models.BudgetPlan).filter(models.BudgetPlan.department_id == id).filter(models.BudgetPlan.status != "Inactive").all()
    return budget

# create
def create(request: BudgetPlan, db : Session):#
    if db.query(models.BudgetPlan).filter_by(year = request.year, department_id =request.department_id).count() > 0:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT,detail=f"You have already set budget for year {request.year}")
    new_budget = models.BudgetPlan(
        given_budget=request.given_budget,
        # remaining_budget=request.remaining_budget,
        year=request.year,
        date_from=request.date_from,
        date_to=request.date_to,
        department_id=request.department_id,
        )
    db.add(new_budget)
    db.commit()
    db.refresh(new_budget)
    return new_budget

# delete
def delete(id,db : Session):
    budget = db.query(models.BudgetPlan).filter(models.BudgetPlan.id == id)
    if not budget.first():
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
        detail=f'Budget Plan with the {id} is not found')
    budget.delete(synchronize_session=False)
    db.commit()
    return "Deleted Successfully"

# update
def update(id, request: BudgetPlan, db : Session):
    if db.query(models.BudgetPlan).filter(and_(models.BudgetPlan.year == request.year, models.BudgetPlan.department_id == request.department_id, 
    models.BudgetPlan.id != id)).count() > 0:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT,detail=f"You have already set budget for year {request.year}")
    budget = db.query(models.BudgetPlan).filter(models.BudgetPlan.id == id)
    if not budget.first():
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
        detail=f'Budget Plan with the {id} is not found')
    budget.update(
       {
        'given_budget' : request.given_budget,
        # 'remaining_budget' : request.remaining_budget,
        'year' : request.year,
        'date_from' : request.date_from,
        'date_to' : request.date_to,
        'department_id' : request.department_id,
       }
        )
    # user.update(request)
    db.commit()
    return 'Updated Succesfully'

# update status - activate / deactivate
def update_status(id, db : Session):
    budget = db.query(models.BudgetPlan).filter(models.BudgetPlan.id == id)
    if not budget.first():
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
        detail=f'Budget Plan with the {id} is not found')
    budget.update({'status':"Inactive"})

    db.commit()
    return 'Updated Succesfully'

# get one
def get_one(id, db : Session):
    budget = db.query(models.BudgetPlan).filter(models.BudgetPlan.id == id).first()

    if not budget:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f'Budget with the id of {id} is not found')
    return budget



# update budget every purchase order transacions
def update_budget_po(given_budget:float,total_amount:float,year, department_id, db : Session):
    budget = db.query(models.BudgetPlan).filter(models.BudgetPlan.year == year).filter(models.BudgetPlan.department_id == department_id)
    if not budget.first():
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
        detail=f'Budget Plan with the year of {year} is not found')
    total_spent =budget.first().total_spent
    if total_amount != 0:
        budget.update(
        {
            # 'remaining_budget' : (budget.first().remaining_budget + given_budget) - total_amount,
            'total_spent' : (total_spent - given_budget) + total_amount,
        }
            )
    else:
        budget.update(
        {
            # 'remaining_budget' :budget.first().remaining_budget  - given_budget,
            'total_spent' : budget.first().total_spent + given_budget,
        }
            )
     
    db.commit()
    return "Update Successfully"


# get budget spent of specific department
def get_dept_spent( department_id,year,db : Session):
    count_dct = defaultdict(int)

    purchase_order = db.query(models.PurchaseOrder).\
        filter(models.PurchaseOrder.vendor_proposal_id == models.VendorProposals.id).\
        filter(models.VendorProposals.request_quotation_id == models.RequestQuotation.id).\
        filter(models.RequestQuotation.purchase_requisition_id == models.PurchaseRequisition.id).\
        filter(models.PurchaseRequisition.department_id == department_id).all() #models.PurchaseOrder.vendor_proposal.request_quotation

    for po_idx in range(len(purchase_order)):
        if purchase_order[po_idx].created_at.strftime("%Y") == year:

            count_dct[purchase_order[po_idx].created_at.strftime("%B")] +=purchase_order[po_idx].total_amount

    return count_dct