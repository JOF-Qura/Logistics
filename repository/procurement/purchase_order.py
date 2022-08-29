from fastapi import status, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy.sql.expression import true

from models import procurement as models
from schemas.procurement.purchase_order import PurchaseOrder, UpdatePurchaseOrderStatus
from random import randint
from sqlalchemy import func
from collections import defaultdict

# generate random purchase order number
def random_integer( db : Session):
    min_ = 100
    max_ = 10000
    rand = randint(min_, max_)
    while db.query(models.PurchaseOrder).filter(models.PurchaseOrder.purchase_order_number == rand).limit(1).first() is not None:
        rand = randint(min_, max_)
    return rand


# get all orders for specific vendor
def get_orders(id, db : Session):
    purchase_order = db.query(models.PurchaseOrder).filter(models.PurchaseOrder.vendor_id == id).all()
    return purchase_order

# get all filterd reports by date range and status
def get_filtered_po_reports(start_date,end_date, po_status, db : Session):

    if(start_date != "none" and po_status != "none"):
        # print("date, status not null")
        purchase_order = db.query(models.PurchaseOrder).filter(models.PurchaseOrder.created_at >= start_date+'T00:00:00').filter(models.PurchaseOrder.created_at <= end_date+'T23:59:59').filter(models.PurchaseOrder.status == po_status).order_by(models.PurchaseOrder.order_date.desc()).all()
        
    elif(start_date != "none" and po_status == "none"):
        # print("date not null, status null")
        purchase_order = db.query(models.PurchaseOrder).filter(models.PurchaseOrder.created_at >= start_date+'T00:00:00').filter(models.PurchaseOrder.created_at <= end_date+'T23:59:59').order_by(models.PurchaseOrder.order_date.desc()).all()

    elif(start_date == "none" and po_status != "none"):
        # print("status not null, date null")
        purchase_order = db.query(models.PurchaseOrder).filter(models.PurchaseOrder.status == po_status).order_by(models.PurchaseOrder.order_date.desc()).all()

    else:
        purchase_order = db.query(models.PurchaseOrder).order_by(models.PurchaseOrder.order_date.desc()).all()

    return purchase_order

# get all purchase order
def get( db : Session):
    purchase_order = db.query(models.PurchaseOrder).all()
    return purchase_order

# get all purchase order with equal to status parameter
def get_status(vendor_id,status, db : Session):
    purchase_order = db.query(models.PurchaseOrder).filter(models.PurchaseOrder.status == status).filter(models.PurchaseOrder.vendor_id == vendor_id).all()
    return purchase_order

# get all purchase order of specific vendor
def get_vendor_po(vendor_id, db : Session):
    purchase_order = db.query(models.PurchaseOrder).filter(models.PurchaseOrder.vendor_id==vendor_id).all()
    return purchase_order

# create purchase order
def create(request: PurchaseOrder, db : Session):#

    if db.query(models.PurchaseOrder).filter_by(vendor_proposal_id = request.vendor_proposal_id).count() > 0:
         raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="You have already ordered this proposal")

    new_po = models.PurchaseOrder(
        purchase_order_number = random_integer(db),
        order_date=request.order_date,
        expected_delivery_date=request.order_date,
        payment_method_id=request.payment_method_id,
        shipping_method=request.shipping_method,
        payment_terms_id=request.payment_terms_id,


        notes= request.notes,
        subtotal=request.subtotal,
        tax=request.tax,
        discount= request.discount,
        total_amount= request.total_amount,
        status=request.status,
        vendor_proposal_id=request.vendor_proposal_id,
        vendor_id=request.vendor_id
        )
    db.add(new_po)
    db.commit()
    vendor_proposal = db.query(models.VendorProposals).filter(models.VendorProposals.id == request.vendor_proposal_id)
    if not vendor_proposal.first():
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
        detail=f'Purchase Order with the id is not found')
    vendor_proposal.update({'is_ordered' : True})

    for i in range(len(request.purchase_order_detail)):
        new_po_detail = models.PurchaseOrderDetail(
            quantity=request.purchase_order_detail[i].quantity,
            product_name=request.purchase_order_detail[i].product_name,
            category=request.purchase_order_detail[i].product_category,
            product_price=request.purchase_order_detail[i].product_price,
            # description=request.purchase_order_detail[i].description,t,

            purchase_order_id=new_po.id,
            # created_by = request.vendor_id        
                )
        db.add(new_po_detail)
        db.commit()
    # print(new_po_detail)
    results = {new_po,new_po_detail}  
    db.refresh(new_po)
    db.refresh(new_po_detail)

    new_notif = models.Notification(
    # purchase_order_id=new_po.id,
    vendor_id=request.vendor_id,
    notif_to="vendor",
    title="Purchase Order",
    description="You have new purchase order",

    status="unread",

        )
    db.add(new_notif)
    db.commit()
    db.refresh(new_notif)

    return new_po

# delete purchase order
def delete(id,db : Session):
    purchase_order = db.query(models.PurchaseOrder).filter(models.PurchaseOrder.id == id)
    if not purchase_order.first():
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
        detail=f'Purchase Order with the {id} is not found')
    purchase_order.delete(synchronize_session=False)
    db.commit()
    return purchase_order


# update purchase order
def update(id, request: PurchaseOrder, db : Session):
    purchase_order = db.query(models.PurchaseOrder).filter(models.PurchaseOrder.id == id)
    if not purchase_order.first():
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
        detail=f'Purchase Order with the {id} is not found')
    purchase_order.update(
       {
        'order_date' : request.order_date,
        'expected_delivery_date' : request.expected_delivery_date,
        # 'payment_method' : request.payment_method,
        # 'delivery_method' : request.delivery_method,
        # 'status' : request.status,
       }
        )
    # user.update(request)
    db.commit()
    return 'Updated Succesfully'


# update status of purchase order
def update(id, request: UpdatePurchaseOrderStatus, db : Session):
    purchase_order = db.query(models.PurchaseOrder).filter(models.PurchaseOrder.id == id)
    if not purchase_order.first():
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
        detail=f'Purchase Order with the {id} is not found')
    purchase_order.update(
       {
        'status' : request.status,   
       }
        )
    # user.update(request)
    db.commit()
    new_notif = models.Notification(
    # purchase_order_id=new_po.id,
    # vendor_id=request.vendor_id,
    notif_to="procurement_officer",
    title="Purchase Order",
    description=f'{purchase_order.first().purchase_order_number} has been {request.status}',
    status="unread",

        )
    db.add(new_notif)
    db.commit()
    db.refresh(new_notif)
    return 'Updated Succesfully'


# get one purchase order
def get_one(id, db : Session):
    purchase_order = db.query(models.PurchaseOrder).filter(models.PurchaseOrder.id == id).first()
    if not purchase_order:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f'Purchase Order with the id of {id} is not found')
    return purchase_order


# get number of purchase order
def get_count(db : Session):
    purchase_order = db.query(models.PurchaseOrder).count()
    return purchase_order

# get sum of all purchase order
def get_po_total(db : Session):
    # purchase_order = db.query(models.PurchaseOrder).count()
    purchase_order = db.query(func.sum(models.PurchaseOrder.total_amount)).scalar() 
    # return "{:.2f}".format(round(purchase_order))
    try:
        round(purchase_order)
        return round(purchase_order)
    except:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f'No purchase order found')





# get number of purchase orders per category
def get_po_categ(db : Session):
    category_name = [] 
    purchase_order_detail = db.query(models.PurchaseOrderDetail.category).all() 
    for categ_idx in purchase_order_detail:
        category_name.append(categ_idx[0])
    category_dct = defaultdict(int)
  
    for key in category_name:
        # print(category_dct[key])
        # print(category_dct)
        # print(key)
        category_dct[key] += 1
    return category_dct
    

# get monthly purchase order spent
def po_monthly_spent(db : Session):
    total_amounts = []
    total_amounts2 = []

    order_date = []
    # purchase_order_total = []
    monthly_dct = []
    # category_dct = defaultdict(int)

    purchase_order_date = db.query(models.PurchaseOrder.order_date).all() 
    for date_idx in range(len(purchase_order_date)):
        order_date.append(purchase_order_date[date_idx][0].strftime("%B"))
        purchase_order_total = db.query(models.PurchaseOrder.total_amount).filter(models.PurchaseOrder.order_date == purchase_order_date[date_idx][0]).all()
        if(len(purchase_order_total) > 1):
                total_amounts = purchase_order_total
        else:
                total_amounts2.append(purchase_order_total[0])
    total_amounts3 = total_amounts2 + total_amounts

 
    monthly_dct = defaultdict(int)
    for idx, key in enumerate(order_date):
        # print(category_dct[key])
        # print(category_dct)
        # print(key)
        # if category_dct[key] == true:
        # category_dct[key] += 1
        # print(total_amounts3[idx][0])
        print(idx)

        print(key)
      
        try:
            monthly_dct[key] += int(total_amounts3[idx][0])
        except Exception as e:
            print(e)
        # print(key)

   
    return monthly_dct

# get vendor sales per month
def vendor_monthly_sales(vendor_id,db : Session):
    total_amounts = []
    total_amounts2 = []
    order_date = []
    # purchase_order_total = []
    monthly_dct = []
    # category_dct = defaultdict(int)

    purchase_order_date = db.query(models.PurchaseOrder.order_date).filter(models.PurchaseOrder.vendor_id == vendor_id).filter(models.PurchaseOrder.status != "Pending").all() 
    for date_idx in range(len(purchase_order_date)):
        order_date.append(purchase_order_date[date_idx][0].strftime("%B"))
        purchase_order_total = db.query(models.PurchaseOrder.total_amount).filter(models.PurchaseOrder.vendor_id == vendor_id).filter(models.PurchaseOrder.order_date == purchase_order_date[date_idx][0]).all()
 
        if(len(purchase_order_total) > 1):
                total_amounts = purchase_order_total

        else:
                total_amounts2.append(purchase_order_total[0])

    total_amounts3 = total_amounts2 + total_amounts
    monthly_dct = defaultdict(int)
    for idx, key in enumerate(order_date):
        # print(category_dct[key])
        # print(category_dct)
        # print(key)
        # if category_dct[key] == true:
        # category_dct[key] += 1
        # print(total_amounts3[idx][0])
        # print(key)
        monthly_dct[key] += int(total_amounts3[idx][0])
        # print(key)

   
    return monthly_dct


# get number of orders of specific vendor
def get_orders_count(vendor_id, db : Session ):
    purchase_order = db.query(models.PurchaseOrder).\
        filter(models.PurchaseOrder.vendor_id  == vendor_id).\
        count()
    return purchase_order


# get sum of sales of specific vendor
def get_orders_total(vendor_id, db : Session ):
    if len(db.query(models.PurchaseOrder.total_amount).all()) == 0:
        raise HTTPException(status_code=status.HTTP_204_NO_CONTENT,detail="No Purchase Order")
    purchase_order = db.query(func.sum(models.PurchaseOrder.total_amount)).\
    filter(models.PurchaseOrder.vendor_id  == vendor_id).\
    scalar() 

    return round(purchase_order)
