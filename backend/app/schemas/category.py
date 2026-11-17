from pydantic import BaseModel, ConfigDict, Field
from datetime import datetime
from typing import Optional

class CategoryBase(BaseModel):
    name: str = Field(..., min_length=2, max_length=100, description="Tên danh mục môn học")
    description: Optional[str] = Field(None, max_length=500, description="Mô tả chi tiết")
    icon: Optional[str] = Field("folder", max_length=50, description="Mã icon nhận diện")

class CategoryCreate(CategoryBase):
    pass

class CategoryUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=2, max_length=100)
    description: Optional[str] = Field(None, max_length=500)
    icon: Optional[str] = Field(None, max_length=50)

class CategoryResponse(CategoryBase):
    id: int
    slug: str
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)

