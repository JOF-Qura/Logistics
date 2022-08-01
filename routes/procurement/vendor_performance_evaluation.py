from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session


from typing import List
from repository.procurement import vendor_performance_evaluation
from .. import database, models
from security import oauth2

from schemas.procurement.vendor_evaluation import VendorEvaluationResult,ShowVendorEvaluationResults,ShowVendorEvaluationResultsVendor
from schemas.procurement.user import User




router = APIRouter(
    prefix="/api/v1/vendor-evaluation",
    tags=['Vendor Evaluation']
)
get_db = database.get_db


# get all results of specific vendor
@router.get('/charts/ratings/{category_id}')
def get_ratings( category_id,db : Session = Depends(get_db), current_user: User = Depends(oauth2.get_current_user)):
    return vendor_performance_evaluation.get_ratings(category_id,db)
    
# get all results of specific vendor
@router.get('/charts/vendor-scores/{vendor_id}')
def get_vendor_scores( vendor_id,db : Session = Depends(get_db), current_user: User = Depends(oauth2.get_current_user)):
    return vendor_performance_evaluation.get_vendor_scores(vendor_id,db)    


# get number of total purchase order to each vendors
@router.get('/datatable/vendor-total-order')#status_code=status.HTTP_200_OK, response_model=ShowVendorEvaluation
def get_total_orders(db : Session = Depends(get_db), current_user: User = Depends(oauth2.get_current_user)):
    return vendor_performance_evaluation.get_total_orders( db)

# get all
@router.get('/', response_model=List[ShowVendorEvaluationResults])
def get( db : Session = Depends(get_db), current_user: User = Depends(oauth2.get_current_user)):
    return vendor_performance_evaluation.get(db)
    

# create
@router.post('/', status_code=status.HTTP_201_CREATED)
def create(request: VendorEvaluationResult, db : Session = Depends(get_db), current_user: User = Depends(oauth2.get_current_user)):#, current_user: User = Depends(oauth2.get_current_user)
    return vendor_performance_evaluation.create(request, db,current_user)
    

# delete
@router.delete('/del/{id}', status_code=status.HTTP_202_ACCEPTED)#HTTP_204_NO_CONTENT
def delete(id,db : Session = Depends(get_db), current_user: User = Depends(oauth2.get_current_user)):
    return vendor_performance_evaluation.delete(id,db,current_user)
    

# update
@router.put('/{id}',status_code=status.HTTP_202_ACCEPTED)
def update(id, request: VendorEvaluationResult, db : Session = Depends(get_db), current_user: User = Depends(oauth2.get_current_user)):
    return vendor_performance_evaluation.update(id, request, db)


# get all results to schedules
# @router.get('/get-results/{id}', response_model=List[ShowVendorEvaluationResults])#status_code=status.HTTP_200_OK, response_model=ShowVendorEvaluation
# def get_sched(id, db : Session = Depends(get_db), current_user: User = Depends(oauth2.get_current_user)):
#     return vendor_evaluation_results.get_sched(id, db)
    
# get one
@router.get('/{id}', response_model=ShowVendorEvaluationResults)#status_code=status.HTTP_200_OK, response_model=ShowVendorEvaluation
def get_one(id, db : Session = Depends(get_db), current_user: User = Depends(oauth2.get_current_user)):
    return vendor_performance_evaluation.get_one(id, db)


# # get all results to vendor
@router.get('/vendor-results/{id}', response_model=List[ShowVendorEvaluationResultsVendor])#status_code=status.HTTP_200_OK, response_model=ShowVendorEvaluation
def get(id, db : Session = Depends(get_db), current_user: User = Depends(oauth2.get_current_user)):
    return vendor_performance_evaluation.get_results_vendor(id, db)





