from typing import Optional
from datetime import datetime as dt
from pydantic import BaseModel

class AssetBase(BaseModel):
    asset_provider_id : str
    asset_type_id : str
    # user_id : str
    # department_id : str
    asset_cost : int
    asset_title : str
    asset_description : Optional [str] = None
    asset_brand : Optional [str] = None
    asset_model : Optional [str] = None
    asset_serial : Optional [str] = None
    asset_acquisition : str
    acquisition_date : dt
    
    # asset_status : str


# Schema for request body
class CreateAsset(AssetBase):
    created_by : str

class UpdateAsset(AssetBase):
    pass

class UpdateStatus(BaseModel):
    asset_remarks : str
    asset_status : str

#Schema for response body
class Asset(AssetBase):
    created_at: dt
    updated_at: dt