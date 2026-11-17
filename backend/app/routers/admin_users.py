import uuid
from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException, Query, status
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session
from sqlalchemy import or_

from app.database import get_db
from app.models.user import User
from app.models.category import Category
from app.schemas.user import UserResponse
from app.middleware.auth import require_admin

router = APIRouter(prefix="/api/admin", tags=["Quản trị hệ thống"])

class UpdateStatusPayload(BaseModel):
    status: str = Field(..., pattern="^(ACTIVE|BANNED)$", description="Trạng thái tài khoản (ACTIVE hoặc BANNED)")

class UpdateRolePayload(BaseModel):
    role: str = Field(..., pattern="^(USER|ADMIN)$", description="Vai trò người dùng (USER hoặc ADMIN)")

class AdminStatsResponse(BaseModel):
    total_users: int
    active_users: int
    banned_users: int
    admin_users: int
    total_categories: int

@router.get("/stats", response_model=AdminStatsResponse)
def get_admin_stats(
    db: Session = Depends(get_db),
    current_admin: User = Depends(require_admin)
):
    """
    Thống kê tổng quan số liệu hệ thống dành cho Dashboard Quản trị
    """
    total_users = db.query(User).count()
    active_users = db.query(User).filter(User.status == "ACTIVE").count()
    banned_users = db.query(User).filter(User.status == "BANNED").count()
    admin_users = db.query(User).filter(User.role == "ADMIN").count()
    total_categories = db.query(Category).count()

    return AdminStatsResponse(
        total_users=total_users,
        active_users=active_users,
        banned_users=banned_users,
        admin_users=admin_users,
        total_categories=total_categories
    )

@router.get("/users", response_model=List[UserResponse])
def get_all_users(
    q: Optional[str] = Query(None, description="Tìm kiếm theo họ tên hoặc email"),
    role: Optional[str] = Query(None, description="Lọc theo vai trò (USER, ADMIN)"),
    status_filter: Optional[str] = Query(None, alias="status", description="Lọc theo trạng thái (ACTIVE, BANNED)"),
    db: Session = Depends(get_db),
    current_admin: User = Depends(require_admin)
):
    """
    Lấy danh sách tất cả người dùng hệ thống có tìm kiếm và bộ lọc (Chỉ Quản trị viên)
    """
    query = db.query(User)

    if q and q.strip():
        search_pattern = f"%{q.strip()}%"
        query = query.filter(
            or_(
                User.full_name.ilike(search_pattern),
                User.email.ilike(search_pattern)
            )
        )

    if role and role in ["USER", "ADMIN"]:
        query = query.filter(User.role == role)

    if status_filter and status_filter in ["ACTIVE", "BANNED"]:
        query = query.filter(User.status == status_filter)

    users = query.order_by(User.created_at.desc()).all()
    return users

@router.patch("/users/{user_id}/status", response_model=UserResponse)
def update_user_status(
    user_id: str,
    payload: UpdateStatusPayload,
    db: Session = Depends(get_db),
    current_admin: User = Depends(require_admin)
):
    """
    Khóa hoặc Kích hoạt lại tài khoản người dùng
    """
    try:
        target_uuid = uuid.UUID(user_id)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Định dạng ID người dùng không hợp lệ"
        )

    # Ràng buộc an toàn: Không cho phép Admin tự khóa tài khoản của chính mình
    if current_admin.id == target_uuid:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Bạn không thể tự khóa tài khoản Quản trị viên của chính mình!"
        )

    target_user = db.query(User).filter(User.id == target_uuid).first()
    if not target_user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Không tìm thấy người dùng trong hệ thống"
        )

    target_user.status = payload.status
    db.commit()
    db.refresh(target_user)
    return target_user

@router.patch("/users/{user_id}/role", response_model=UserResponse)
def update_user_role(
    user_id: str,
    payload: UpdateRolePayload,
    db: Session = Depends(get_db),
    current_admin: User = Depends(require_admin)
):
    """
    Thay đổi vai trò người dùng (Thăng cấp lên ADMIN hoặc chuyển về USER)
    """
    try:
        target_uuid = uuid.UUID(user_id)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Định dạng ID người dùng không hợp lệ"
        )

    # Ràng buộc an toàn: Không cho phép Admin tự hạ quyền quản trị viên của chính mình
    if current_admin.id == target_uuid and payload.role != "ADMIN":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Bạn không thể tự gỡ quyền Quản trị viên của chính mình!"
        )

    target_user = db.query(User).filter(User.id == target_uuid).first()
    if not target_user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Không tìm thấy người dùng trong hệ thống"
        )

    target_user.role = payload.role
    db.commit()
    db.refresh(target_user)
    return target_user
