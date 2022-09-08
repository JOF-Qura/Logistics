from dataclasses import is_dataclass
from fastapi import APIRouter, Request, Depends, HTTPException, Cookie, status
from sqlalchemy import or_
from datatables import DataTable

# importing models one by one
from models.Admin.supplyModel import Supplies
# from models.Admin.supply_categoryModel import Supply_Categories
from models.procurement.category import Category
# from models.Admin.supplierModel import Suppliers

from models.Admin import supplyModel
from schemas.Admin import supplySchema

from schemas.Admin.supplySchema import ShowSupplies, ShowSupply
from database import get_db
from dependencies import get_token
from typing import List, Optional
from sqlalchemy.orm import Session, joinedload


router = APIRouter(
    prefix='/supplies',
    tags=['supply'],
    # dependencies=[Depends(get_token)]
)

#================================ Supply Table =================================#

# Supplies DataTable
@router.get('/datatable')
def datatable(request: Request, db: Session = Depends(get_db)):
    try:
        def perform_search(queryset, user_input):
            return queryset.filter(
                or_
                (
                    Supplies.id.like('%' + user_input + '%'),
                    # Supplies.supply_id.like('%' + user_input + '%'),
                    # Supply_Categories.supply_category_name.like('%' + user_input + '%'),
                    Category.category_name.like('%' + user_input + '%'),
                    # Suppliers.supplier_name.like('%' + user_input + '%'),
                    Supplies.product_name.like('%' + user_input + '%'),
                    # Supplies.supply_name.like('%' + user_input + '%'),
                    Supplies.supply_quantity.like('%' + user_input + '%'),
                    Supplies.supply_unit_type.like('%' + user_input + '%'),
                    Supplies.estimated_price.like('%' + user_input + '%'),
                    # Supplies.supply_unit_cost.like('%' + user_input + '%'),
                    Supplies.description.like('%' + user_input + '%'),
                    # Supplies.supply_description.like('%' + user_input + '%'),
                    Supplies.supply_reorder_interval.like('%' + user_input + '%'),
                    Supplies.supply_expiration.like('%' + user_input + '%'),
                    Supplies.created_at.like('%' + user_input + '%'),
                    Supplies.updated_at.like('%' + user_input + '%'),
                )
            )

        table = DataTable(dict(request.query_params), Supplies, db.query(Supplies), 
        [
            # 'supply_id',
            'id',
            # ('supply_category_id', 'supply_category.supply_category_name'),
            ('category_id', 'category.category_name'),
            # ('supplier_id', 'supply_supplier.supplier_name'),
            # 'supply_name',
            'product_name',
            'supply_quantity',
            'supply_unit_type',
            'estimated_price',
            # 'supply_unit_cost',
            'description',
            # 'supply_description',
            'supply_reorder_interval',
            'supply_expiration',
            'created_at',
            'updated_at',
        ])

        table.searchable(lambda queryset, user_input: perform_search(queryset, user_input))
    
        return table.json()
    except Exception as e:
        print(e)

# GET all Active Supplies
def get_active_supplies( db : Session ):
    supplies = db.query(supplyModel.Supplies).filter(supplyModel.Supplies.status != "Inactive").all()
    return supplies
# get all
@router.get('/active-supplies', response_model=List[ShowSupply])#
def get_active( db : Session = Depends(get_db)):
    return get_active_supplies(db)



# GET all Supplies
@router.get('/')
def get_all_supply(db: Session = Depends(get_db)):
    supplies = db.query(supplyModel.Supplies).options(joinedload(supplyModel.Supplies.category)
                                                    # , joinedload(supplyModel.Supplies.supply_supplier)
                                                    ).all()
    return {'Supplies': supplies}

# GET Supply by ID
@router.get('/{supply_id}', response_model=supplySchema.ShowSupply)
def get_one_supply(supply_id:str, db: Session = Depends(get_db)):
    # emp = db.query(supplyModel.Supplies).filter(supplyModel.Supplies.supply_id == supply_id).first()
    emp = db.query(supplyModel.Supplies).filter(supplyModel.Supplies.id == supply_id).first()
    if not emp:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail=f"Supply with the id {supply_id} is not available")
    return emp

# CREATE Supply
@router.post('/')
def create_supply(request: supplySchema.CreateSupply, db: Session = Depends(get_db)):
    to_store = supplyModel.Supplies(
        # supply_category_id = request.supply_category_id,
        category_id = request.category_id,
        # supplier_id = request.supplier_id,
        product_name = request.product_name,
        # supply_name = request.supply_name,
        supply_quantity = request.supply_quantity,
        supply_unit_type = request.supply_unit_type,
        estimated_price = request.estimated_price,
        # supply_unit_cost = request.supply_unit_cost,
        description = request.description,
        # supply_description = request.supply_description,
        supply_reorder_interval = request.supply_reorder_interval,
        supply_expiration = request.supply_expiration,
        supply_status = request.supply_status,
        status = request.status
    )
    db.add(to_store)
    db.commit()
    return {'message': 'Supply stored successfully.'}

# UPDATE Supply
@router.put('/{supply_id}')
# def update_supply(supply_id: str, Supply: supplySchema.UpdateSupply, db: Session = Depends(get_db)): 
def update_supply(supply_id: str, Supply: supplySchema.UpdateSupply, db: Session = Depends(get_db)): 
    # if not db.query(supplyModel.Supplies).filter(supplyModel.Supplies.supply_id == supply_id).update({
    if not db.query(supplyModel.Supplies).filter(supplyModel.Supplies.id == supply_id).update({
        # 'supply_name': Supply.supply_name,
        'product_name': Supply.product_name,
        'supply_quantity': Supply.supply_quantity,
        'estimated_price': Supply.estimated_price,
        # 'supply_unit_cost': Supply.supply_unit_cost,
        'supply_unit_type': Supply.supply_unit_type,
        'description': Supply.description,
        # 'supply_description': Supply.supply_description,
        'supply_reorder_interval': Supply.supply_reorder_interval,
        'supply_expiration': Supply.supply_expiration,
        'supply_status': Supply.supply_status,
        'status': Supply.status,
    }):
        raise HTTPException(404, 'Supply to update is not found')
    db.commit()
    return {'message': 'Supply updated successfully.'}

# DELETE Supply
@router.delete('/{supply_id}')
# def delete_supply(supply_id: str, db: Session = Depends(get_db)):
def delete_supply(id: str, db: Session = Depends(get_db)):
    if not db.query(supplyModel.Supplies).filter(supplyModel.Supplies.id == id).delete():
        raise HTTPException(404, 'Supply to delete is not found')
    db.commit()
    return {'message': 'Supply removed successfully.'}

