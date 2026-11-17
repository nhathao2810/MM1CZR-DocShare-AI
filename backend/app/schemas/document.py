import uuid
from pydantic import BaseModel, ConfigDict, Field
from datetime import datetime
from typing import Optional

class DocumentCategorySummary(BaseModel):
    id: int
    name: str
    slug: str
    icon: Optional[str] = "folder"

    model_config = ConfigDict(from_attributes=True)

class DocumentUploaderSummary(BaseModel):
    id: uuid.UUID
    full_name: str
    email: str
    avatar_url: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)

class DocumentResponse(BaseModel):
    id: uuid.UUID
    title: str
    description: Optional[str] = None
    category_id: int
    uploader_id: uuid.UUID
    file_url: str
    file_name: str
    file_type: str
    file_size: int
    page_count: int
    status: str
    rejection_reason: Optional[str] = None
    extracted_text: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    category: Optional[DocumentCategorySummary] = None
    uploader: Optional[DocumentUploaderSummary] = None

    model_config = ConfigDict(from_attributes=True)

