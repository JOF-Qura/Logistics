from aiohttp import request
from fastapi import status, HTTPException
from sqlalchemy.orm import Session
from .. import database, models

from fastapi import HTTPException, status
from app.schemas.vendor_proposal import VendorBiddingItems,VendorProposalStatus, BiddingItemID,VendorBiddingItemsStatus



# get one
def get_one(id, db : Session):
    proposal_item = db.query(models.VendorBiddingItems).filter(models.VendorBiddingItems.id == id).first()
    return proposal_item


# update
def update(id, request: VendorBiddingItems, db : Session,current_user ):
    proposal_item = db.query(models.VendorBiddingItems).filter(models.VendorBiddingItems.id == id)
    if not proposal_item.first():
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
        detail=f'Proposal item with the {id} is not found')
    proposal_item.update(
       {
            'quantity' : request.quantity,  
            'product_name':request.product_name,
            'price_per_unit':request.price_per_unit,
            'description':request.description,
                    # 'updated_by': current_user,
       }
        )
    db.commit()
    return 'Updated Succesfully'


# delete bidding item
def delete(id,request:VendorBiddingItemsStatus,db : Session):
    proposal_item = db.query(models.VendorBiddingItems).filter(models.VendorBiddingItems.id == id)
    if not proposal_item.first():
         raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
        detail=f'Proposal item with the {id} is not found')
    # proposal_item.delete(synchronize_session=False)
    proposal_item.update({'status':request.status})

    db.commit()
    return "Update Status Successfully"