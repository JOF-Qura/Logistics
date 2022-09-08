from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from typing import List
from repository.procurement import purchase_requisition_detail, purchase_requisition

from database import get_db

from schemas.procurement.purchase_requisition_detail import PurchaseRequestItemsStatus, PurchaseRequisitionDetail, ShowPurchaseRequisitionDetail, PurchaseRequisitionDetailStatus
# from schemas.procurement.user import User




router = APIRouter(
    prefix="/api/v1/purchase-requisition-detail",
    tags=['Purchase Requisition Detail']
)




    
# get all purchase requisition details
@router.get('/', response_model=List[ShowPurchaseRequisitionDetail])
def get( db : Session = Depends(get_db)):
    return purchase_requisition_detail.get(db)


# update status of purchase requisition
@router.put('/status/{id}',status_code=status.HTTP_202_ACCEPTED)
def update_status(id, request: PurchaseRequisitionDetailStatus, db : Session = Depends(get_db)):
    return purchase_requisition_detail.update_status(id,request, db)




# delete purchase requisition details
@router.delete('/{id}', status_code=status.HTTP_204_NO_CONTENT)
def delete(id,request:PurchaseRequestItemsStatus,db : Session = Depends(get_db)):
    return purchase_requisition_detail.delete(id,request, db)


# get one purchase requisition details
@router.get('/{id}', status_code=status.HTTP_200_OK, response_model=ShowPurchaseRequisitionDetail)
def get_one(id, db : Session = Depends(get_db)):
    return purchase_requisition.get_pr_detail(id, db)



# update status of purchase requisition details
@router.put('/{id}',status_code=status.HTTP_202_ACCEPTED)
def update(id, request: PurchaseRequisitionDetail, db : Session = Depends(get_db)):
    return purchase_requisition_detail.update(id,request, db)
 






