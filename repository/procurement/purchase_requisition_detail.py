from fastapi import status, HTTPException
from sqlalchemy.orm import Session
from models import procurement as models
from fastapi import HTTPException, status
from schemas.procurement.purchase_requisition_detail import PurchaseRequestItemsStatus, PurchaseRequisitionDetail, PurchaseRequisitionDetailStatus





# get all purchase requisition detail
def get( db : Session):
    purchase_request = db.query(models.PurchaseRequisitionDetail).all()
    return purchase_request


# update purchase requisition detail
def update(id, request: PurchaseRequisitionDetail, db : Session ):
    pr_detail = db.query(models.PurchaseRequisitionDetail).filter(models.PurchaseRequisitionDetail.id == id)
    if not pr_detail.first():
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
        detail=f'Purchase Requisition detail with the {id} is not found')
    print( request.quantity)
    print( request.product_id)
    print( request.new_product_name)

    pr_detail.update(
       {
            'quantity' : request.quantity,
            # 'product_id' : request.product_id,       
            'new_category':request.new_category,
            'new_product_name':request.new_product_name,
            'estimated_price':request.estimated_price,
            'description':request.description,
            # 'updated_by': current_user,
       }
        )
    db.commit()
    return 'Updated Succesfully'



# delete purchase requisition detail
def delete(id,request:PurchaseRequestItemsStatus,db : Session):
    pr_item = db.query(models.PurchaseRequisitionDetail).filter(models.PurchaseRequisitionDetail.id == id)
    if not pr_item.first():
         raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
        detail=f'Purchase Requisition detail with the {id} is not found')
    # pr_item.delete(synchronize_session=False)
    pr_item.update({'status':request.status})
    db.commit()
    pr = db.query(models.PurchaseRequisition).filter(models.PurchaseRequisition.id == pr_item.first().purchase_requisition_id)
    if not pr.first():
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
            detail=f'Purchase Requisition detail with the {id} is not found')
    pr.update({'estimated_amount':request.estimated_amount})
    
    return "Update Status Successfully"



# update status of purchase requisition
def update_status(id, request: PurchaseRequisitionDetailStatus, db : Session):

    purchase_request_detail = db.query(models.PurchaseRequisitionDetail).filter(models.PurchaseRequisitionDetail.id == id)
    if not purchase_request_detail.first():
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
        detail=f'Purchase Request Detail with the {id} is not found')

    purchase_request_detail.update(
       {
        'status' : request.status,
       }
    )
    db.commit()
    return purchase_request_detail.first()