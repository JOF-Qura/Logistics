from datetime import datetime as dt
from pydantic import BaseModel

class MaintenanceProviderBase(BaseModel):
    maintenance_provider_name: str
    maintenance_provider_contact: str
    maintenance_provider_email: str


# Schema for request body
class CreateMaintenanceProvider(MaintenanceProviderBase):
    pass

#Schema for response body
class Asset(MaintenanceProviderBase):
    created_at: dt
    updated_at: dt