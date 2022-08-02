from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from typing import List
from app.repository import vendor_proposal
from .. import  database, models
from app.security import oauth2

from app.schemas.vendor_proposal import AwardVendor, ShowVendorProposal, ShowVendorProposalPayload,VendorProposal,VendorProposalStatus,BiddingItemID,ShowVendorBiddingItems
from app.schemas.user import User



router = APIRouter(
    prefix="/api/v1/vendor-proposal",
    tags=['Vendor Proposal']
)
get_db = database.get_db


    
# get bidding item of specific proposal
@router.get('/bid/{proposal_id}', status_code=status.HTTP_200_OK, response_model=List[ShowVendorBiddingItems])
def get_one_bid(proposal_id, db : Session = Depends(get_db), current_user: User = Depends(oauth2.get_current_user)):
    return vendor_proposal.get_bid(proposal_id,db)

########## 



# get all vendor proposal
@router.get('/', response_model=List[ShowVendorProposal])
def get( db : Session = Depends(get_db), current_user: User = Depends(oauth2.get_current_user)):
    return vendor_proposal.get(db)



# get all proposal of specific vendor
@router.get('/one-vendor-proposals/{id}', response_model=List[ShowVendorProposal])
def get_own_proposal(id, db : Session = Depends(get_db), current_user: User = Depends(oauth2.get_current_user)):
    return vendor_proposal.get_own_proposal(id,db)

# create vendor proposal
@router.post('/', status_code=status.HTTP_201_CREATED, response_model=ShowVendorProposalPayload)
def create(request: VendorProposal, db : Session = Depends(get_db), current_user: User = Depends(oauth2.get_current_user)):#, current_user: User = Depends(oauth2.get_current_user)
    return vendor_proposal.create(request, db,current_user)


# delete vendor proposal
@router.delete('/{id}', status_code=status.HTTP_204_NO_CONTENT)
def delete(id,db : Session = Depends(get_db), current_user: User = Depends(oauth2.get_current_user)):
    return vendor_proposal.delete(id, db)



# update vendor proposal
@router.put('/{id}',status_code=status.HTTP_202_ACCEPTED,response_model=ShowVendorProposalPayload)
def update(id, request: VendorProposal, request1: BiddingItemID, db : Session = Depends(get_db), current_user: User = Depends(oauth2.get_current_user)):

    return vendor_proposal.update(id,request, request1, db,current_user)


# update status of vendor proposal
@router.put('/status/{id}',status_code=status.HTTP_202_ACCEPTED)
def update_status(id, request: VendorProposalStatus, db : Session = Depends(get_db), current_user: User = Depends(oauth2.get_current_user)):
    return vendor_proposal.update_status(id,request, db,current_user)

# award vendor proposal - change status
@router.put('/award/{id}',status_code=status.HTTP_202_ACCEPTED)
def award_vendor(id, request: AwardVendor, db : Session = Depends(get_db), current_user: User = Depends(oauth2.get_current_user)):
    return vendor_proposal.award_vendor(id,request, db,current_user)


# get one vendor proposal
@router.get('/{id}', status_code=status.HTTP_200_OK, response_model=ShowVendorProposal)
def get_one(id, db : Session = Depends(get_db), current_user: User = Depends(oauth2.get_current_user)):
    return vendor_proposal.get_one(id, db)

    
# get one item bidding item
@router.get('/bidding-item/{id}', status_code=status.HTTP_200_OK, response_model=ShowVendorBiddingItems)
def get_one_bid_item(id, db : Session = Depends(get_db), current_user: User = Depends(oauth2.get_current_user)):
    return vendor_proposal.get_one_bid_item(id, db)




# get all awarded proposal
@router.get('/awarded/', status_code=status.HTTP_200_OK, response_model=List[ShowVendorProposal])
def get_awarded(db : Session = Depends(get_db), current_user: User = Depends(oauth2.get_current_user)):
    return vendor_proposal.get_awarded(db)


# get total of created proposals of vendor
@router.get('/count-proposals/{user_id}', status_code=status.HTTP_200_OK)
def get_proposal_count(user_id,db : Session = Depends(get_db), current_user: User = Depends(oauth2.get_current_user)):
    return vendor_proposal.get_proposal_count(user_id,db)





# get all filtered vendor proposals
@router.get('/filtered/proposal/{rfq_id}', response_model=List[ShowVendorProposal])
def get_filtered_pr_reports( rfq_id,db : Session = Depends(get_db), current_user: User = Depends(oauth2.get_current_user)):
    return vendor_proposal.get_filtered_proposals(rfq_id,db)