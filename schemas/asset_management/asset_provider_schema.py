from datetime import datetime as dt
from pydantic import BaseModel

class AssetProviderBase(BaseModel):
    asset_provider_name: str
    asset_provider_contact: str
    asset_provider_email: str


# Schema for request body
class CreateAssetProvider(AssetProviderBase):
    pass

#Schema for response body
class Asset(AssetProviderBase):
    created_at: dt
    updated_at: dt

    