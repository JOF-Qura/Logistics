from fastapi import status, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy.sql.expression import null, true
from app import models
from sqlalchemy import and_
from fastapi import HTTPException, status
from app.models import department, purchase_requisition
from app.schemas.purchase_requisition import PurchaseRequisition,PurchaseRequisitionStatus, PrDetailID
from random import randint
from datetime import date, datetime
from sqlalchemy import func
from collections import defaultdict

todays_date = date.today()

# get all that status is not equal to draft
def get( db : Session):
    purchase_request = db.query(models.PurchaseRequisition).filter(and_(models.PurchaseRequisition.status != "Draft", models.PurchaseRequisition.status != "Inactive")).order_by(models.PurchaseRequisition.created_at.desc()).all()
    return purchase_request

# get all filtered reports by range and status
def get_filtered_pr_reports(start_date,end_date, pr_status, db : Session):
    if(start_date != "none" and pr_status != "none"):
        # purchase_request = db.query(models.PurchaseRequisition).filter(models.PurchaseRequisition.created_at >= start_date+'T00:00:00').filter(models.PurchaseRequisition.created_at <= end_date+'T23:59:59').filter(models.PurchaseRequisition.status == pr_status).order_by(models.PurchaseRequisition.created_at.desc()).all()
        purchase_request = db.query(models.PurchaseRequisition).filter(and_(models.PurchaseRequisition.created_at >= start_date+'T00:00:00',models.PurchaseRequisition.created_at <= end_date+'T23:59:59',models.PurchaseRequisition.status == pr_status)).order_by(models.PurchaseRequisition.created_at.desc()).all()
        
    elif(start_date != "none" and pr_status == "none"):
        print("date not null, status null")
        purchase_request = db.query(models.PurchaseRequisition).filter(models.PurchaseRequisition.created_at >= start_date+'T00:00:00').filter(models.PurchaseRequisition.created_at <= end_date+'T23:59:59').filter(and_(models.PurchaseRequisition.status != "Draft", models.PurchaseRequisition.status != "Inactive")).order_by(models.PurchaseRequisition.created_at.desc()).all()

    elif(start_date == "none" and pr_status != "none"):
        print("status not null, date null")
        purchase_request = db.query(models.PurchaseRequisition).filter(models.PurchaseRequisition.status == pr_status).order_by(models.PurchaseRequisition.created_at.desc()).all()

    else:
        purchase_request = db.query(models.PurchaseRequisition).filter(and_(models.PurchaseRequisition.status != "Draft", models.PurchaseRequisition.status != "Inactive")).order_by(models.PurchaseRequisition.created_at.desc()).all()

    return purchase_request


# generate randon purchase requistion number
def random_integer( db : Session):
    min_ = 100
    max_ = 10000
    rand = randint(min_, max_)
    while db.query(models.PurchaseRequisition).filter(models.PurchaseRequisition.purchase_requisition_number == rand).limit(1).first() is not None:
        rand = randint(min_, max_)
    return rand


# create purchase requisition
def create(request: PurchaseRequisition, db : Session, current_user):#
    try:
        if db.query(models.BudgetPlan.given_budget - models.BudgetPlan.total_spent).\
            filter(and_(models.BudgetPlan.year == todays_date.year,models.BudgetPlan.department_id == request.department_id)).scalar() < request.estimated_amount:
                raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="You have not enough budget for this request")
    except:
        raise HTTPException(status_code=status.HTTP_406_NOT_ACCEPTABLE, detail="You have not enough budget for this request")

    new_pr = models.PurchaseRequisition(
        purpose=request.purpose,
        message=request.message,
        estimated_amount=request.estimated_amount,
        purchase_requisition_number = random_integer(db),
        status=request.status,
        # created_at=request.created_at,
        department_id=request.department_id,
        created_by = current_user
        )
    db.add(new_pr)
    db.commit()
    for i in range(len(request.pr_detail)):
        new_pr_detail = models.PurchaseRequisitionDetail(
            quantity=request.pr_detail[i].quantity,
            product_id=request.pr_detail[i].product_id,
            new_category=request.pr_detail[i].new_category,
            new_product_name=request.pr_detail[i].new_product_name,
            estimated_price=request.pr_detail[i].estimated_price,
            description=request.pr_detail[i].description,
            purchase_requisition_id=new_pr.id,
            # created_by = current_user
                )
        db.add(new_pr_detail)
        db.commit()

    results = {new_pr,new_pr_detail}  
    db.refresh(new_pr)
    db.refresh(new_pr_detail)

    #create notification 
    new_notif = models.Notification(
    notif_to="procurement_manager",
    title="Purchase Requisition",
    department_id=request.department_id,
    description ="New Purchase Request",
    status="unread",

        )
    db.add(new_notif)
    db.commit()
    db.refresh(new_notif)

    return results

# delete purchase requisition
def delete(id,db : Session):
    purchase_request = db.query(models.PurchaseRequisition).filter(models.PurchaseRequisition.id == id)
    if not purchase_request.first():
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
        detail=f'purchase_request with the {id} is not found')
    # purchase_request.delete(synchronize_session=False)
    purchase_request.update({'status': 'Inactive'})
    db.commit()
    return "Deleted Successsfully"

# update purchase requisition
def update(id, request: PurchaseRequisition, db : Session, current_user):
    if db.query(models.BudgetPlan.given_budget - models.BudgetPlan.total_spent).\
        filter(and_(models.BudgetPlan.year == todays_date.year,models.BudgetPlan.department_id == request.department_id)).scalar() < request.estimated_amount:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="You have not enough budget for this request")
    purchase_request = db.query(models.PurchaseRequisition).filter(models.PurchaseRequisition.id == id)
    purchase_request_all = db.query(models.PurchaseRequisitionDetail).filter(models.PurchaseRequisitionDetail.purchase_requisition_id == id).all()
    item_arr = []
    for x in range(len(purchase_request_all)):
        item_arr.append(purchase_request_all[x].product_id)

    print(item_arr)
    if not purchase_request.first():
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
        detail=f'Purchase Request with the {id} is not found')
    purchase_request.update(
       {
        'purpose' : request.purpose,
        'message' : request.message,
        'estimated_amount':request.estimated_amount,

        'department_id':request.department_id,
        'updated_by': current_user,
        'status' : request.status,
        # 'created_at' : request.created_at,
       }
    )
    
    # add if there are new purchase request items on update
    for y in range(len(request.pr_detail)):
        if(request.pr_detail[y].product_id not in item_arr or request.pr_detail[y].product_id == None ):
            # print(request.pr_detail[y].product_id)
            # print(request.pr_detail[y].new_product_name)
            new_pr_detail = models.PurchaseRequisitionDetail(
                quantity=request.pr_detail[y].quantity,
                product_id=request.pr_detail[y].product_id,
                new_category=request.pr_detail[y].new_category,
                new_product_name=request.pr_detail[y].new_product_name,
                estimated_price=request.pr_detail[y].estimated_price,
                description=request.pr_detail[y].description,
                purchase_requisition_id=id,
                    )
            db.add(new_pr_detail)
            db.commit()
            db.refresh(new_pr_detail)
        else:
            print("false")
            # pass

    return request


# delete purchase requistion detail
def delete_pr_detail(id,db : Session):
    purchase_request = db.query(models.PurchaseRequisitionDetail).filter(models.PurchaseRequisitionDetail.id == id)
    if not purchase_request.first():
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
        detail=f'purchase_requisition detail with the {id} is not found')
    purchase_request.delete(synchronize_session=False)
    db.commit()
    return "purchase_request"



# get one pr detail
def get_pr_detail(id,db : Session):
    purchase_request_detail = db.query(models.PurchaseRequisitionDetail).filter(models.PurchaseRequisitionDetail.id == id).first()
    if not purchase_request_detail:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f'PR detail with the id of {id} is not found')
    return purchase_request_detail


# update status of purchase requisition
def update_status(id, request: PurchaseRequisitionStatus, db : Session):

    purchase_request = db.query(models.PurchaseRequisition).filter(models.PurchaseRequisition.id == id)
    if not purchase_request.first():
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
        detail=f'Purchase Request with the {id} is not found')

    if db.query(models.BudgetPlan.given_budget - models.BudgetPlan.total_spent).\
        filter(and_(models.BudgetPlan.year == todays_date.year,models.BudgetPlan.department_id == purchase_request.first().department_id)).scalar() < purchase_request.first().estimated_amount:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Budget is not enough for this request")

    if db.query(models.BudgetPlan.given_budget - models.BudgetPlan.total_spent).\
        filter(and_(models.BudgetPlan.year == todays_date.year,models.BudgetPlan.department_id == purchase_request.first().department_id)).scalar() < request.given_budget:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="This Department have not enough budget for this request")

    if request.status == "Approved":
        if purchase_request.first().estimated_amount > request.given_budget:
                raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Given Budget is not enough")

    purchase_request.update(
       {
        'status' : request.status,
        'reason' : request.reason,
        'approved_by' : request.approved_by,
        'date_approved':datetime.now(),
        'given_budget' : request.given_budget,

       }
    )
    db.commit()

    new_notif = models.Notification(
    # purchase_requisition_id=new_pr.id,
    notif_to="p_dept_users",
    title="Purchase Request",
    department_id=purchase_request.first().department_id,
    description = "Your request has been "+request.status,
    status="unread",

        )
    db.add(new_notif)
    db.commit()
    db.refresh(new_notif)
    
    return purchase_request.first()

# get one purchase requistion
def get_one(id, db : Session):
    purchase_request = db.query(models.PurchaseRequisition).filter(models.PurchaseRequisition.id == id).first()
    if not purchase_request:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f'Purchase Request with the id of {id} is not found')
    return purchase_request
    
# get one purchase requisition timeline
def get_pr_timeline(id, db : Session):
    purchase_request = db.query(models.PurchaseRequisition).filter(models.PurchaseRequisition.id == id).first()
    if not purchase_request:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f'Purchase Request with the id of {id} is not found')
    return purchase_request


# get all drafts of the department
def get_draft_status(department_id, db : Session):
    purchase_request = db.query(models.PurchaseRequisition).filter(models.PurchaseRequisition.department_id == department_id).filter(models.PurchaseRequisition.status == "Draft").all()
    return purchase_request


# get all request of the department not equal to draft
def get_status(department_id, db : Session):
    purchase_request = db.query(models.PurchaseRequisition).filter(models.PurchaseRequisition.department_id == department_id).filter(and_(models.PurchaseRequisition.status != "Draft", models.PurchaseRequisition.status != "Inactive")).all()
    return purchase_request


# temporary
# get pending
def get_pending(department_id,db : Session):
    if department_id != "none":
        purchase_request = db.query(models.PurchaseRequisition).filter(models.PurchaseRequisition.status == "Pending").filter(models.PurchaseRequisition.department_id == department_id).all()
    else: 
        purchase_request = db.query(models.PurchaseRequisition).filter(models.PurchaseRequisition.status == "Pending").all()

    return purchase_request

def get_pending_cancelled(department_id,db : Session):
    if department_id != "none":
        purchase_request = db.query(models.PurchaseRequisition).filter(models.PurchaseRequisition.status != "Approved").filter(models.PurchaseRequisition.status != "Rejected").filter(models.PurchaseRequisition.department_id == department_id).filter(and_(models.PurchaseRequisition.status != "Draft", models.PurchaseRequisition.status != "Inactive")).all()
    else: 
        purchase_request = db.query(models.PurchaseRequisition).filter(models.PurchaseRequisition.status != "Approved").all()
    return purchase_request

def get_approved(department_id,db : Session):
    if department_id != "none":
        purchase_request = db.query(models.PurchaseRequisition).filter(models.PurchaseRequisition.status == "Approved").filter(models.PurchaseRequisition.department_id == department_id).all()
    else: 
        purchase_request = db.query(models.PurchaseRequisition).filter(models.PurchaseRequisition.status == "Approved").all()
        for i in range(len(purchase_request)):
            if db.query(models.RequestQuotation).filter_by(purchase_requisition_id = purchase_request[i].id).count() > 0:
                purchase_request[i].has_rfq = True
            else:
                purchase_request[i].has_rfq = False
    return purchase_request


def get_rejected(department_id,db : Session):
    if department_id != "none":
        purchase_request = db.query(models.PurchaseRequisition).filter(models.PurchaseRequisition.status == "Rejected").filter(models.PurchaseRequisition.department_id == department_id).all()
    else: 
        purchase_request = db.query(models.PurchaseRequisition).filter(models.PurchaseRequisition.status == "Rejected").all()
    return purchase_request
# ---------------


# get count of approved,rejected,pending,all purchase requisition
def get_count(department_id,db : Session):
    if department_id != "none":
        purchase_request_approved = db.query(models.PurchaseRequisition.purchase_requisition_number).filter(models.PurchaseRequisition.status == "Approved").filter(models.PurchaseRequisition.department_id == department_id).count() 
        purchase_request_rejected = db.query(models.PurchaseRequisition.purchase_requisition_number).filter(models.PurchaseRequisition.status == "Rejected").filter(models.PurchaseRequisition.department_id == department_id).count()  
        purchase_request_pending = db.query(models.PurchaseRequisition.purchase_requisition_number).filter(models.PurchaseRequisition.status == "Pending").filter(models.PurchaseRequisition.department_id == department_id).count()  
        purchase_request_all = db.query(models.PurchaseRequisition.purchase_requisition_number).filter(and_(models.PurchaseRequisition.status != "Draft", models.PurchaseRequisition.status != "Inactive")).filter(models.PurchaseRequisition.department_id == department_id).count()  

    else:
        purchase_request_approved = db.query(models.PurchaseRequisition.purchase_requisition_number).filter(models.PurchaseRequisition.status == "Approved").count() 
        purchase_request_rejected = db.query(models.PurchaseRequisition.purchase_requisition_number).filter(models.PurchaseRequisition.status == "Rejected").count()  
        purchase_request_pending = db.query(models.PurchaseRequisition.purchase_requisition_number).filter(models.PurchaseRequisition.status == "Pending").count()  
        purchase_request_all = db.query(models.PurchaseRequisition.purchase_requisition_number).filter(and_(models.PurchaseRequisition.status != "Draft", models.PurchaseRequisition.status != "Inactive")).count()  
    purchase_request = {
        'approved_pr':purchase_request_approved,
        'rejected_pr':purchase_request_rejected,
        'pending_pr':purchase_request_pending,
        'all_pr':purchase_request_all,
    }
    return purchase_request



# get number of purchase requisition by category 
def get_pr_categ(department_id,db : Session):
    product_category_id = []
    category_name = []

    if department_id != "none":
        purchase_request = db.query(models.PurchaseRequisition).filter(and_(models.PurchaseRequisition.status != "Draft", models.PurchaseRequisition.status != "Inactive")).filter(models.PurchaseRequisition.department_id == department_id).all() 
        for pr_idx in range(len(purchase_request)):
            purchase_request_detail = db.query(models.PurchaseRequisitionDetail).filter(models.PurchaseRequisitionDetail.purchase_requisition_id == purchase_request[pr_idx].id).all() 
            for categ_idx in range(len(purchase_request_detail)):
                if purchase_request_detail[categ_idx].product_id:
                    product_category_id = db.query(models.Product.category_id).filter(models.Product.id == purchase_request_detail[categ_idx].product_id).first()
                    category_name.append(db.query(models.Category.category_name).filter(models.Category.id == product_category_id[0]).scalar())
    
    else:
        purchase_request = db.query(models.PurchaseRequisition).filter(and_(models.PurchaseRequisition.status != "Draft", models.PurchaseRequisition.status != "Inactive")).all() 
        purchase_request_detail = db.query(models.PurchaseRequisitionDetail).all() 
        for categ_idx in range(len(purchase_request_detail)):
            if purchase_request_detail[categ_idx].product_id:
                product_category_id = db.query(models.Product.category_id).filter(models.Product.id == purchase_request_detail[categ_idx].product_id).first()
                category_name.append(db.query(models.Category.category_name).filter(models.Category.id == product_category_id[0]).scalar())

    category_dct = defaultdict(int)
    # print(dct)

    for key in category_name:
        # print(category_dct[key])
        # print(category_dct)
        # print(key)
        category_dct[key] += 1

 
    return category_dct


# get number of purchase requisition per month
def get_pr_per_month(db : Session):
    pr_months = []
    purchase_request_all = db.query(models.PurchaseRequisition.created_at).filter(and_(models.PurchaseRequisition.status != "Draft", models.PurchaseRequisition.status != "Inactive")).all()   

    for pr_value in purchase_request_all:
        pr_months.append(pr_value[0].strftime("%B"))
        # print(pr_idx[0].strftime("%Y"))
        # print(pr_idx[0].strftime("%B"))
        # print(pr_idx[0].strftime("%d"))
    pr_dct = defaultdict(int)
    for key in pr_months:
        pr_dct[key] += 1
    return pr_dct
