from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models.category import Category
from app.models.user import User
from app.schemas.category import CategoryCreate, CategoryUpdate, CategoryResponse
from app.middleware.auth import require_admin
from app.utils.slug import slugify

router = APIRouter(prefix="/api/categories", tags=["Danh mục môn học"])

@router.get("", response_model=List[CategoryResponse])
def get_categories(db: Session = Depends(get_db)):
    """
    Lấy danh sách tất cả danh mục môn học (Công khai cho toàn bộ người dùng và khách)
    """
    categories = db.query(Category).order_by(Category.name.asc()).all()
    return categories

@router.get("/{id_or_slug}", response_model=CategoryResponse)
def get_category(id_or_slug: str, db: Session = Depends(get_db)):
    """
    Lấy chi tiết một danh mục theo ID hoặc Slug
    """
    if id_or_slug.isdigit():
        category = db.query(Category).filter(Category.id == int(id_or_slug)).first()
    else:
        category = db.query(Category).filter(Category.slug == id_or_slug).first()

    if not category:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Không tìm thấy danh mục môn học"
        )
    return category

@router.post("", response_model=CategoryResponse, status_code=status.HTTP_201_CREATED)
def create_category(
    payload: CategoryCreate,
    db: Session = Depends(get_db),
    current_admin: User = Depends(require_admin)
):
    """
    Thêm mới một danh mục môn học (Chỉ dành cho Quản trị viên)
    """
    # Kiểm tra trùng lặp tên
    existing_name = db.query(Category).filter(Category.name.ilike(payload.name.strip())).first()
    if existing_name:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Danh mục '{payload.name}' đã tồn tại trong hệ thống"
        )

    slug = slugify(payload.name)
    # Kiểm tra trùng lặp slug
    existing_slug = db.query(Category).filter(Category.slug == slug).first()
    if existing_slug:
        counter = 1
        new_slug = f"{slug}-{counter}"
        while db.query(Category).filter(Category.slug == new_slug).first():
            counter += 1
            new_slug = f"{slug}-{counter}"
        slug = new_slug

    category = Category(
        name=payload.name.strip(),
        slug=slug,
        description=payload.description.strip() if payload.description else None,
        icon=payload.icon.strip() if payload.icon else "folder"
    )
    db.add(category)
    db.commit()
    db.refresh(category)
    return category

@router.put("/{category_id}", response_model=CategoryResponse)
def update_category(
    category_id: int,
    payload: CategoryUpdate,
    db: Session = Depends(get_db),
    current_admin: User = Depends(require_admin)
):
    """
    Cập nhật thông tin danh mục môn học (Chỉ dành cho Quản trị viên)
    """
    category = db.query(Category).filter(Category.id == category_id).first()
    if not category:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Không tìm thấy danh mục môn học cần cập nhật"
        )

    if payload.name is not None:
        trimmed_name = payload.name.strip()
        # Kiểm tra trùng tên với category khác
        duplicate = db.query(Category).filter(
            Category.name.ilike(trimmed_name),
            Category.id != category_id
        ).first()
        if duplicate:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Tên danh mục '{trimmed_name}' đã được sử dụng"
            )
        category.name = trimmed_name
        category.slug = slugify(trimmed_name)

    if payload.description is not None:
        category.description = payload.description.strip() if payload.description else None

    if payload.icon is not None:
        category.icon = payload.icon.strip() if payload.icon else "folder"

    db.commit()
    db.refresh(category)
    return category

@router.delete("/{category_id}", status_code=status.HTTP_200_OK)
def delete_category(
    category_id: int,
    db: Session = Depends(get_db),
    current_admin: User = Depends(require_admin)
):
    """
    Xóa một danh mục môn học (Chỉ dành cho Quản trị viên)
    """
    category = db.query(Category).filter(Category.id == category_id).first()
    if not category:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Không tìm thấy danh mục môn học cần xóa"
        )

    db.delete(category)
    db.commit()
    return {"message": f"Đã xóa thành công danh mục '{category.name}'", "id": category_id}

