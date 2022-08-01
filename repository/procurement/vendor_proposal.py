from aiohttp import request
from fastapi import status, HTTPException
from sqlalchemy.orm import Session
from models import procurement as models
from fastapi import HTTPException, status
from schemas.procurement.vendor_proposal import AwardVendor, VendorProposal,VendorProposalStatus, BiddingItemID
from random import randint

# generate random proposal number 
def random_integer( db : Session):
    min_ = 100
    max_ = 10000
    rand = randint(min_, max_)
    while db.query(models.VendorProposals).filter(models.VendorProposals.proposal_number == rand).limit(1).first() is not None:
        rand = randint(min_, max_)
    return rand



# get all vendor proposal
def get( db : Session ):
    vendor_proposals = db.query(models.VendorProposals).filter(models.VendorProposals.status != "Draft").filter(models.VendorProposals.status != "Cancelled").all()
    return vendor_proposals

# get all proposal of specific vendor
def get_own_proposal(id, db : Session):
    vendor_proposal = db.query(models.VendorProposals).filter(models.VendorProposals.created_by == models.User.id).filter(models.User.vendor_id == models.Vendor.id).filter(models.Vendor.id == id).all()
    return vendor_proposal


# create vendor proposal
def create(request: VendorProposal, db : Session, current_user):#
    rfq = db.query(models.RequestQuotation).filter(models.RequestQuotation.id == request.request_quotation_id)

    if db.query(models.VendorProposals).filter_by(request_quotation_id = request.request_quotation_id,created_by=current_user).count() > 0:
         raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="You have already created proposal for this request")


    new_proposals = models.VendorProposals(
        proposal_number = random_integer(db),

        subtotal=request.subtotal,
        arrival_date=request.arrival_date,
        contact_no=request.contact_no,
        prepared_by=request.prepared_by,
        notes=request.notes,
        discount=request.discount,
        tax=request.tax,
        total_amount=request.total_amount,
        message=request.message,
        created_by = current_user,
        request_quotation_id = request.request_quotation_id,
        status = request.status
      
        )
    db.add(new_proposals)
    db.commit()
    for i in range(len(request.vendor_bidding_item)):
        new_proposals_detail = models.VendorBiddingItems(
            quantity=request.vendor_bidding_item[i].quantity,
            product_name=request.vendor_bidding_item[i].product_name,
            category_id=request.vendor_bidding_item[i].category_id,
            price_per_unit=request.vendor_bidding_item[i].price_per_unit,
            description=request.vendor_bidding_item[i].description,
            # total=request.vendor_bidding_item[i].total,
            vendor_proposal_id=new_proposals.id,
            # created_by = request.vendor_id        
                )
        db.add(new_proposals_detail)
        db.commit()
    # print(new_proposals_detail)
    # results = {new_proposals,new_proposals_detail}  
    db.refresh(new_proposals)
    db.refresh(new_proposals_detail)
    if not rfq.first():
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
        detail=f'request quotation with the {request.request_quotation_id} is not found')
    db.commit()

    # create notification
    new_notif = models.Notification(
    # vendor_proposal_id=new_proposals.id,
    # vendor_id=current_user,
    notif_to="procurement_officer",
    title="Proposal",
    description="New vendor proposal",
    status="unread",

        )
    db.add(new_notif)
    db.commit()
    db.refresh(new_notif)

    return new_proposals

# delete vendor proposal
def delete(id,db : Session):
    vendor_proposal = db.query(models.VendorProposals).filter(models.VendorProposals.id == id)
    if not vendor_proposal.first():
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
        detail=f'Vendor Proposal with the {id} is not found')
    # vendor_proposal.delete(synchronize_session=False)
    vendor_proposal.update({'status':"Denied"})

    db.commit()
    return "Deleted Successfully"




# update vendor proposal
def update(id, request: VendorProposal, request1: BiddingItemID, db : Session, current_user):
    vendor_proposal = db.query(models.VendorProposals).filter(models.VendorProposals.id == id)
    # purchase_request_all = db.query(models.VendorBiddingItems).filter(models.VendorBiddingItems.vendor_proposal_id == id).all()
    # item_arr = []
    # for x in range(len(purchase_request_all)):
    #     item_arr.append(purchase_request_all[x].product_id)

    if not vendor_proposal.first():
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
        detail=f'Vendor Proposal with the {id} is not found')
    vendor_proposal.update(
       {
        'subtotal' : request.subtotal,
        'arrival_date':request.arrival_date,
        'contact_no':request.contact_no,
        'prepared_by':request.prepared_by,
        'notes':request.notes,
        'updated_by': current_user,
        'discount' : request.discount,
        'tax' : request.tax,
        'total_amount' : request.total_amount,
        'message' : request.message,
        # 'request_quotation_id' : request.request_quotation_id,
        'status': request.status

       }
    )
      # add if there are new purchase request items
    for y in range(len(request.vendor_bidding_item)):
            # print(request.vendor_bidding_item[y].product_name)
            new_pr_detail = models.VendorBiddingItems(
                product_name=request.vendor_bidding_item[y].product_name,
                category_id=request.vendor_bidding_item[y].category_id,
                description=request.vendor_bidding_item[y].description,
                quantity= request.vendor_bidding_item[y].quantity,

                price_per_unit=request.vendor_bidding_item[y].price_per_unit,
                vendor_proposal_id=id,
                    )
            db.add(new_pr_detail)
            db.commit()
            db.refresh(new_pr_detail)
    
    return vendor_proposal.first()

# update status of vendor proposal
def update_status(id, request: VendorProposalStatus, db : Session,current_user):
    vendor_proposal = db.query(models.VendorProposals).filter(models.VendorProposals.id == id)

    if not vendor_proposal.first():
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
        detail=f'Vendor Proposal with the {id} is not found')
    vendor_proposal.update(
       {
        'status' : request.status,
        # 'awarded_by': current_user
       }
    )
    # user.update(request)
    db.commit()
    return 'Updated Succesfully'

# award vendor proposal - change status
def award_vendor(id, request: AwardVendor, db : Session,current_user):
    vendor_proposal = db.query(models.VendorProposals).filter(models.VendorProposals.id == id)

    if not vendor_proposal.first():
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
        detail=f'Vendor Proposal with the {id} is not found')
    vendor_proposal.update(
       {
        'status' : request.status,
        'subtotal' : request.subtotal,
        'tax' : request.tax,
        'total_amount' : request.total_amount,

        # 'awarded_by': current_user
       }
    )
        
    # user.update(request)
    db.commit()
    return 'Updated Succesfully'

# get one vendor proposal
def get_one(id, db : Session):
    vendor_proposal = db.query(models.VendorProposals).filter(models.VendorProposals.id == id).first()
    if not vendor_proposal:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f'Vendor Proposal with the id of {id} is not found')
    return vendor_proposal



def get_bid(proposal_id, db : Session):
    vendor_proposal = db.query(models.VendorBiddingItems).filter(models.VendorBiddingItems.vendor_proposal_id == proposal_id).all()
    return vendor_proposal

# get one item bidding item
def get_one_bid_item(id, db : Session):
    vendor_proposal = db.query(models.VendorBiddingItems).filter(models.VendorBiddingItems.id == id).first()
    return vendor_proposal


# get bidding item of specific proposal
def get_bid(proposal_id, db : Session):
    vendor_proposal = db.query(models.VendorBiddingItems).filter(models.VendorBiddingItems.vendor_proposal_id == proposal_id).all()
    return vendor_proposal

# get all awarded proposal
def get_awarded( db : Session):
    vendor_proposal = db.query(models.VendorProposals).filter(models.VendorProposals.status == "Awarded").all()
    return vendor_proposal


# get total of created proposals of vendor
def get_proposal_count(user_id, db : Session ):
    vendor_proposals = db.query(models.VendorProposals).\
        filter(models.VendorProposals.created_by == models.User.id).\
        filter(models.User.vendor_id == models.Vendor.id).\
        filter(models.VendorProposals.created_by  == user_id).\
        count()
    return vendor_proposals


# get filtered proposals
def get_filtered_proposals(rfq_id, db : Session):
    if(rfq_id != "none"):
        vendor_proposal = db.query(models.VendorProposals).\
            filter(models.VendorProposals.request_quotation_id == models.RequestQuotation.id).\
                filter(models.RequestQuotation.id == rfq_id).all()
    else:
        vendor_proposal = db.query(models.VendorProposals).all()

    return vendor_proposal