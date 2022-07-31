from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
# from repository import user 

from typing import List
from app.repository import purchase_order
from .. import database, models
from app.security import oauth2

from app.schemas.purchase_order import ShowPurchaseOrder,PurchaseOrder,UpdatePurchaseOrderStatus
from app.schemas.user import User

router = APIRouter(
    prefix="/api/v1/purchase-order",
    tags=['Purchase Order']
)
get_db = database.get_db




# get all purchase order
@router.get('/', response_model=List[ShowPurchaseOrder])
def get( db : Session = Depends(get_db), current_user: User = Depends(oauth2.get_current_user)):
    return purchase_order.get(db)

# get all purchase order with equal to status parameter
@router.get('/get_status/{vendor_id}/{status}', response_model=List[ShowPurchaseOrder])
def get_status(vendor_id, status,db : Session = Depends(get_db), current_user: User = Depends(oauth2.get_current_user)):
    return purchase_order.get_status(vendor_id,status,db)

# get number of purchase order
@router.get('/charts/count')
def get_count( db : Session = Depends(get_db), current_user: User = Depends(oauth2.get_current_user)):
    return purchase_order.get_count(db)

# get all filterd reports by date range and status
@router.get('/filtered/po/reports/{start_date}/{end_date}/{po_status}', response_model=List[ShowPurchaseOrder])
def get_filtered_po_reports( start_date,end_date,po_status,db : Session = Depends(get_db), current_user: User = Depends(oauth2.get_current_user)):

    return purchase_order.get_filtered_po_reports(start_date,end_date,po_status,db)

# get sum of all purchase order
@router.get('/charts/po_total')
def get_po_total( db : Session = Depends(get_db), current_user: User = Depends(oauth2.get_current_user)):
    return purchase_order.get_po_total(db)

# get number of purchase orders per category
@router.get('/charts/po_categ')
def get_po_categ( db : Session = Depends(get_db), current_user: User = Depends(oauth2.get_current_user)):
    return purchase_order.get_po_categ(db)

# get monthly purchase order spent
@router.get('/charts/po_monthly_spent')
def po_monthly_spent( db : Session = Depends(get_db), current_user: User = Depends(oauth2.get_current_user)):
    return purchase_order.po_monthly_spent(db)


# create purchase order
@router.post('/', status_code=status.HTTP_201_CREATED, response_model=ShowPurchaseOrder)
def create(request: PurchaseOrder,db : Session = Depends(get_db)):#, current_user: User = Depends(oauth2.get_current_user)
    return purchase_order.create(request, db)

# delete purchase order
@router.delete('/{id}', status_code=status.HTTP_204_NO_CONTENT)
def delete(id,db : Session = Depends(get_db), current_user: User = Depends(oauth2.get_current_user)):
    return purchase_order.delete(id, db)

# update purchase order
@router.put('/{id}',status_code=status.HTTP_202_ACCEPTED)
def update(id, request: UpdatePurchaseOrderStatus, db : Session = Depends(get_db), current_user: User = Depends(oauth2.get_current_user)):
    return purchase_order.update(id,request, db)

# get one purchase order
@router.get('/{id}', status_code=status.HTTP_200_OK, response_model=ShowPurchaseOrder)
def get_one(id, db : Session = Depends(get_db), current_user: User = Depends(oauth2.get_current_user)):
    return purchase_order.get_one(id, db)

# get all purchase order of specific vendor
@router.get('/vendor/{vendor_id}', status_code=status.HTTP_200_OK,response_model=List[ShowPurchaseOrder])
def get_vendor_po(vendor_id, db : Session = Depends(get_db), current_user: User = Depends(oauth2.get_current_user)):
    return purchase_order.get_vendor_po(vendor_id, db)


# get all orders for specific vendor
@router.get('/orders-to-vendor/{id}', response_model=List[ShowPurchaseOrder])
def get_orders(id, db : Session = Depends(get_db), current_user: User = Depends(oauth2.get_current_user)):
    return purchase_order.get_orders(id,db)


# get number of orders of specific vendor
@router.get('/count-orders/{vendor_id}', status_code=status.HTTP_200_OK)
def get_orders_count(vendor_id,db : Session = Depends(get_db), current_user: User = Depends(oauth2.get_current_user)):
    return purchase_order.get_orders_count(vendor_id,db)


# get vendor sales per month
@router.get('/charts/po/vendor-monthly-sales/{vendor_id}')
def vendor_monthly_sales(vendor_id, db : Session = Depends(get_db), current_user: User = Depends(oauth2.get_current_user)):
    return purchase_order.vendor_monthly_sales(vendor_id,db)

# get sum of sales of specific vendor
@router.get('/sum/total-orders/{vendor_id}', status_code=status.HTTP_200_OK)
def get_orders_total(vendor_id,db : Session = Depends(get_db), current_user: User = Depends(oauth2.get_current_user)):
    return purchase_order.get_orders_total(vendor_id,db)