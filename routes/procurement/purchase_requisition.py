from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from typing import List
from app.repository import purchase_requisition
from .. import  database
from app.security import oauth2

from app.schemas.purchase_requisition import ShowPurchaseRequisition,PurchaseRequisition,PurchaseRequisitionStatus, PrDetailID
from app.schemas.user import User
from app.schemas.pr_timeline import ShowPurchaseRequisitionTimeline




router = APIRouter(
    prefix="/api/v1/purchase-requisition",
    tags=['Purchase Requisition']
)
get_db = database.get_db




# temporary

# get all pending
@router.get('/pending/{department_id}', response_model=List[ShowPurchaseRequisition])
def get_pending(department_id, db : Session = Depends(get_db), current_user: User = Depends(oauth2.get_current_user)):
    return purchase_requisition.get_pending(department_id,db)

# get all pending
@router.get('/pending-cancelled/{department_id}', response_model=List[ShowPurchaseRequisition])
def get_pending_cancelled(department_id, db : Session = Depends(get_db), current_user: User = Depends(oauth2.get_current_user)):
    return purchase_requisition.get_pending_cancelled(department_id,db)

# get all approved
@router.get('/approved/{department_id}', response_model=List[ShowPurchaseRequisition])
def get_approved(department_id, db : Session = Depends(get_db), current_user: User = Depends(oauth2.get_current_user)):
    return purchase_requisition.get_approved(department_id,db) 

# rejected
@router.get('/rejected/{department_id}', response_model=List[ShowPurchaseRequisition])
def get_rejected(department_id, db : Session = Depends(get_db), current_user: User = Depends(oauth2.get_current_user)):
    return purchase_requisition.get_rejected(department_id,db)


####

    
# get all purchase requisition
@router.get('/', response_model=List[ShowPurchaseRequisition])
def get( db : Session = Depends(get_db), current_user: User = Depends(oauth2.get_current_user)):
    return purchase_requisition.get(db)

# get all filtered reports by range and status
@router.get('/filtered/pr/reports/{start_date}/{end_date}/{pr_status}', response_model=List[ShowPurchaseRequisition])
def get_filtered_pr_reports( start_date,end_date,pr_status,db : Session = Depends(get_db), current_user: User = Depends(oauth2.get_current_user)):
    return purchase_requisition.get_filtered_pr_reports(start_date,end_date,pr_status,db)


# create purchase requisition
@router.post('/', status_code=status.HTTP_201_CREATED)
def create(request: PurchaseRequisition, db : Session = Depends(get_db), current_user: User = Depends(oauth2.get_current_user)):#, current_user: User = Depends(oauth2.get_current_user)
    return purchase_requisition.create(request, db,current_user)


# delete purchase requisition
@router.delete('/{id}', status_code=status.HTTP_204_NO_CONTENT)
def delete(id,db : Session = Depends(get_db), current_user: User = Depends(oauth2.get_current_user)):
    return purchase_requisition.delete(id, db)

# delete purchase requistion detail
@router.delete('/pr-detail/{id}', status_code=status.HTTP_204_NO_CONTENT)
def delete(id,db : Session = Depends(get_db), current_user: User = Depends(oauth2.get_current_user)):
    return purchase_requisition.delete_pr_detail(id, db)



# update purchase requisition
@router.put('/{id}',status_code=status.HTTP_202_ACCEPTED)
def update(id, request: PurchaseRequisition, db : Session = Depends(get_db), current_user: User = Depends(oauth2.get_current_user)):
    
    return purchase_requisition.update(id,request, db,current_user)


# update status of purchase requisition
@router.put('/status/{id}',status_code=status.HTTP_202_ACCEPTED)
def update_status(id, request: PurchaseRequisitionStatus, db : Session = Depends(get_db), current_user: User = Depends(oauth2.get_current_user)):
    return purchase_requisition.update_status(id,request, db)



# get one purchase requistion
@router.get('/{id}', status_code=status.HTTP_200_OK, response_model=ShowPurchaseRequisition)
def get_one(id, db : Session = Depends(get_db), current_user: User = Depends(oauth2.get_current_user)):
    return purchase_requisition.get_one(id, db)

# get one purchase requisition timeline
@router.get('/timeline/{id}', status_code=status.HTTP_200_OK, response_model=ShowPurchaseRequisitionTimeline)
def get_pr_timeline(id, db : Session = Depends(get_db), current_user: User = Depends(oauth2.get_current_user)):
    return purchase_requisition.get_pr_timeline(id, db)

    



# get all drafts of the department
@router.get('/datatable/drafts/{department_id}', status_code=status.HTTP_200_OK, response_model=List[ShowPurchaseRequisition])
def get_draft_status(department_id, db : Session = Depends(get_db), current_user: User = Depends(oauth2.get_current_user)):
    return purchase_requisition.get_draft_status(department_id, db)



# get all request of the department not equal to draft
@router.get('/datatable/{department_id}', status_code=status.HTTP_200_OK, response_model=List[ShowPurchaseRequisition])
def get_status(department_id, db : Session = Depends(get_db), current_user: User = Depends(oauth2.get_current_user)):
    return purchase_requisition.get_status(department_id, db)




# get count of approved,rejected,pending,all purchase requisition
@router.get('/charts/count/{department_id}')
def get_count( department_id,db : Session = Depends(get_db), current_user: User = Depends(oauth2.get_current_user)):
    return purchase_requisition.get_count(department_id,db)


# get number of purchase requisition by category 
@router.get('/charts/pr_category/{department_id}')
def get_pr_categ(department_id, db : Session = Depends(get_db), current_user: User = Depends(oauth2.get_current_user)):
    return purchase_requisition.get_pr_categ(department_id,db)


# get number of purchase requisition per month
@router.get('/charts/pr_per_month')
def get_pr_per_month( db : Session = Depends(get_db), current_user: User = Depends(oauth2.get_current_user)):
    return purchase_requisition.get_pr_per_month(db)