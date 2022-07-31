from typing import Optional
from datetime import datetime as dt
from pydantic import BaseModel

class MaintenanceBase(BaseModel):
    maintenance_provider_id: str
    maintenance_name: str
    maintenance_details: Optional [str] = None
    maintenance_cost: int
    maintenance_day: Optional [int] = 0
    maintenance_due: dt
    maintenance_completed: Optional [dt] = None
    maintenance_repeatable: str
    maintenance_status: str

class CompleteMaintenance(BaseModel):
    maintenance_cost: int
    maintenance_due: Optional [dt] = None
    maintenance_status: str
    maintenance_completed: Optional [dt] = None

# Schema for request body
class CreateMaintenance(MaintenanceBase):
    asset_id: str


class UpdateMaintenance(MaintenanceBase):
    remarks: str
