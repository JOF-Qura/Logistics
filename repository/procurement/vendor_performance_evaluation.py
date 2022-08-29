from statistics import mode
from fastapi import status, HTTPException
from sqlalchemy.orm import Session

from models.procurement import purchase_order
from models import procurement as models
from fastapi import HTTPException, status
from schemas.procurement.vendor_evaluation import VendorEvaluationResult
from collections import defaultdict

# get all
def get( db : Session ):
    vendor_eval = db.query(models.VendorPerformanceEvaluation).all()
    return vendor_eval

# create performance evaluation
def create(request: VendorEvaluationResult, db : Session,current_user ):#
    if db.query(models.VendorPerformanceEvaluation).filter_by(purchase_order_id = request.purchase_order_id).count == 1:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
        detail=f"You have already rated this order") 

    new_vendor_eval = models.VendorPerformanceEvaluation(
        purchase_order_id= request.purchase_order_id,
        cost= request.cost,
        timeliness= request.timeliness,
        reliability= request.reliability,
        quality= request.quality,
        availability= request.availability,
        reputation= request.reputation,
        message = request.message,
        created_by = current_user,
     

        )

  
    db.add(new_vendor_eval)
    db.commit()
    db.refresh(new_vendor_eval)
    return new_vendor_eval

# delete
def delete(id, db : Session,current_user ):
    vendor_eval = db.query(models.VendorPerformanceEvaluation).filter(models.VendorPerformanceEvaluation.id == id)
    if not vendor_eval.first():
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
        detail=f'Vendor Evaluation with the {id} is not found')
    # vendor.delete(synchronize_session=False)
    vendor_eval.update({'status':"Inactive"})
    db.commit()
    return 'Deleted Succesfully'

# update
def update(id, request: VendorEvaluationResult, db : Session,current_user ):
    vendor_eval = db.query(models.VendorPerformanceEvaluation).filter(models.VendorPerformanceEvaluation.id == id)
    if not vendor_eval.first():
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
        detail=f'Vendor Evaluation with the {id} is not found')
    vendor_eval.update(
       {

        'message' : request.message,
        # 'defect_comments':request.defect_comments,
        # 'cost': request.cost,
        # 'reliability': request.reliability,
        # 'product_defect': request.product_defect,
        # 'user_timeliness': request.user_timeliness,
        # 'vendor_evaluation_schedule_id' : request.vendor_evaluation_schedule_id,

       }
        )
    # user.update(request)
    db.commit()
    return 'Updated Succesfully'



# get one
def get_one(id, db : Session ):
    results = db.query(models.VendorPerformanceEvaluation).filter(models.VendorPerformanceEvaluation.id == id).first()
    if not results:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f'VendorEvaluationResults with the id of {id} is not found')
    return results

# # get all results of specific vendor eval results
def get_results_vendor(id, db : Session ):
    vendor_eval = db.query(models.VendorPerformanceEvaluation).filter(models.VendorPerformanceEvaluation.vendor_id == id).all()
    return vendor_eval




# get all results of all eval results
def get_ratings( category_id,db : Session ):

    cost= 0
    timeliness= 0
    reliability= 0
    quality= 0
    availability= 0
    reputation= 0
    count_dct = defaultdict(int)
    
    if category_id != "none":
        vendor = db.query(models.VendorProcurement).filter(models.VendorProcurement.category_id == category_id).all()
    else:
        vendor = db.query(models.VendorProcurement).all()

    for vendor_idx in range(len(vendor)):
        
        count_dct[vendor[vendor_idx].vendor_name]

        for po_idx in range(len(vendor[vendor_idx].purchase_order)):
            for eval_idx in range(len(vendor[vendor_idx].purchase_order[po_idx].vendor_performance_evaluation)):
                
                dived_cost = int(vendor[vendor_idx].purchase_order[po_idx].vendor_performance_evaluation[eval_idx].cost) / 5
                multiplied_cost = dived_cost * 100
                cost =multiplied_cost

                dived_timeliness = int(vendor[vendor_idx].purchase_order[po_idx].vendor_performance_evaluation[eval_idx].timeliness) / 5
                multiplied_timeliness = dived_timeliness * 100
                timeliness =multiplied_timeliness

                dived_reliability = int(vendor[vendor_idx].purchase_order[po_idx].vendor_performance_evaluation[eval_idx].reliability) / 5
                multiplied_reliability= dived_reliability * 100
                reliability =multiplied_reliability
                
                dived_quality = int(vendor[vendor_idx].purchase_order[po_idx].vendor_performance_evaluation[eval_idx].quality) / 5
                multiplied_quality = dived_quality * 100
                quality =multiplied_quality
                 
                dived_availability = int(vendor[vendor_idx].purchase_order[po_idx].vendor_performance_evaluation[eval_idx].availability) / 5
                multiplied_availability = dived_availability * 100
                availability =multiplied_availability
                
                dived_reputation = int(vendor[vendor_idx].purchase_order[po_idx].vendor_performance_evaluation[eval_idx].reputation) / 5
                multiplied_reputation = dived_reputation * 100
                reputation =multiplied_reputation
                
        
            if(len(vendor[vendor_idx].purchase_order[po_idx].vendor_performance_evaluation) > 0):
           
                count_dct[vendor[vendor_idx].vendor_name] = [{ 'vendor_name':vendor[vendor_idx].vendor_name,
                'category':vendor[vendor_idx].category.category_name,
                'eval_data':{
                            'cost': round(cost),
                            'timeliness': round(timeliness),
                            'reliability': round(reliability),
                            'quality': round(quality),
                            'availability':round(availability),
                            'reputation':round(reputation),
                            'total': round((cost + timeliness + reliability+quality+availability+reputation) / 6)
            }}]

    return count_dct


# get all results of specific vendor
def get_vendor_scores(vendor_id, db : Session ):
    cost = 0
    timeliness = 0
    reliability = 0
    quality = 0
    availability = 0
    reputation = 0

    vendor_eval = db.query(models.VendorPerformanceEvaluation).\
        filter(models.VendorPerformanceEvaluation.purchase_order_id == models.PurchaseOrder.id).\
        filter(models.PurchaseOrder.vendor_id == vendor_id).all()
        
    for vendor_id_idx in range(len(vendor_eval)):
       
        multiply_cost = int(vendor_eval[vendor_id_idx].cost) / 5
        divided_cost = multiply_cost * 100
        cost += divided_cost

        # # timeliness
        multiply_timeliness = int(vendor_eval[vendor_id_idx].timeliness) / 5
        divided_timeliness = multiply_timeliness * 100
        timeliness += divided_timeliness

        # ontime delivery
        multiply_reliability = int(vendor_eval[vendor_id_idx].reliability) / 5
        divided_reliability = multiply_reliability * 100
        reliability += divided_reliability

        multiply_quality = int(vendor_eval[vendor_id_idx].quality) / 5
        divided_quality = multiply_quality * 100
        quality += divided_quality

        multiply_availability = int(vendor_eval[vendor_id_idx].availability) / 5
        divided_availability = multiply_availability * 100
        availability += divided_availability

        multiply_reputation= int(vendor_eval[vendor_id_idx].reputation) / 5
        divided_reputation = multiply_reputation * 100
        reputation += divided_reputation

    score_dct = {
            
            'cost': '',
            'timeliness': '',
            'reliability': '',
            'quality': '',
            'availability': '',
            'reputation': ''


        }
    if(cost >0):
        score_dct["cost"] = round(cost/len(vendor_eval))
        score_dct["timeliness"] = round(timeliness/len(vendor_eval))
        score_dct["reliability"] = round(reliability/len(vendor_eval))
        score_dct["quality"] = round(quality/len(vendor_eval))
        score_dct["availability"] = round(availability/len(vendor_eval))
        score_dct["reputation"] = round(reputation/len(vendor_eval))



    return score_dct


# get number of total purchase order to each vendors
def get_total_orders( db : Session ):
 

    count_dct = defaultdict(int)
    ratings_dct = defaultdict(int)
    orders_dct = defaultdict(int)

    vendor_po = db.query(models.PurchaseOrder).all()

    for vendor_po_idx in range(len(vendor_po)):
        # print(vendor_po[vendor_po_idx].vendor_id)
        vendor_id = db.query(models.VendorProcurement).filter(models.VendorProcurement.id == vendor_po[vendor_po_idx].vendor_id).first()
        vendor_orders = db.query(models.PurchaseOrder).filter(models.PurchaseOrder.vendor_id == vendor_po[vendor_po_idx].vendor_id).count()

        count_dct[vendor_id.vendor_name] += 1
    #     ratings_dct[vendor_id.vendor_name] += int(vendor_eval[vendor_id_idx].cost)
        orders_dct[vendor_id.vendor_name] = vendor_orders


    top_vendor= []
    # monthly_dct = defaultdict(int)
    for idx, key in enumerate(count_dct):
        # temp = count_dct[key] * 5  
        # temp_score = (ratings_dct[key] / temp)*100
        
        top_vendor.append({
            "vendor_name":key,
            "purchase_order":orders_dct[key],
            # "scores":temp_score,

        })
    return top_vendor
