import uuid
from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException, Query, status
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session
from sqlalchemy import or_

from app.database import get_db
from app.models.user import User
from app.models.category import Category
from app.models.document import Document
from app.schemas.document import DocumentResponse
from app.middleware.auth import require_admin

router = APIRouter(prefix="/api/admin/moderation", tags=["Kiểm duyệt học liệu (Admin)"])

class RejectDocumentPayload(BaseModel):
    reason: str = Field(..., min_length=3, max_length=1000, description="Lý do từ chối tài liệu")

class ModerationStatsResponse(BaseModel):
    total_documents: int
    pending_count: int
    approved_count: int
    rejected_count: int

@router.get("/stats", response_model=ModerationStatsResponse)
def get_moderation_stats(
    db: Session = Depends(get_db),
    current_admin: User = Depends(require_admin)
):
    """
    Thống kê số lượng tài liệu theo từng trạng thái kiểm duyệt
    """
    total = db.query(Document).count()
    pending = db.query(Document).filter(Document.status == "PENDING").count()
    approved = db.query(Document).filter(Document.status == "APPROVED").count()
    rejected = db.query(Document).filter(Document.status == "REJECTED").count()

    return ModerationStatsResponse(
        total_documents=total,
        pending_count=pending,
        approved_count=approved,
        rejected_count=rejected
    )

@router.get("/documents", response_model=List[DocumentResponse])
def get_moderation_documents(
    status_filter: Optional[str] = Query(None, alias="status", description="Lọc theo trạng thái: PENDING, APPROVED, REJECTED, ALL"),
    category_id: Optional[int] = Query(None, description="Lọc theo ID môn học"),
    q: Optional[str] = Query(None, description="Tìm kiếm theo tiêu đề hoặc tên người đăng"),
    db: Session = Depends(get_db),
    current_admin: User = Depends(require_admin)
):
    """
    Lấy danh sách tài liệu phục vụ quy trình kiểm duyệt (Chỉ Quản trị viên)
    """
    query = db.query(Document)

    # Mặc định nếu không truyền status thì hiển thị PENDING (Chờ duyệt) trước
    if status_filter and status_filter.upper() != "ALL":
        if status_filter.upper() in ["PENDING", "APPROVED", "REJECTED"]:
            query = query.filter(Document.status == status_filter.upper())
    elif not status_filter:
        query = query.filter(Document.status == "PENDING")

    if category_id:
        query = query.filter(Document.category_id == category_id)

    if q and q.strip():
        search_pattern = f"%{q.strip()}%"
        query = query.join(Document.uploader).filter(
            or_(
                Document.title.ilike(search_pattern),
                Document.file_name.ilike(search_pattern),
                User.full_name.ilike(search_pattern),
                User.email.ilike(search_pattern)
            )
        )

    # Ưu tiên tài liệu mới nộp lên trước
    documents = query.order_by(Document.created_at.desc()).all()
    return documents

@router.patch("/documents/{document_id}/approve", response_model=DocumentResponse)
def approve_document(
    document_id: str,
    db: Session = Depends(get_db),
    current_admin: User = Depends(require_admin)
):
    """
    Phê duyệt bài đăng học liệu (Chuyển sang trạng thái APPROVED)
    """
    try:
        doc_uuid = uuid.UUID(document_id)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Định dạng ID tài liệu không hợp lệ."
        )

    document = db.query(Document).filter(Document.id == doc_uuid).first()
    if not document:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Không tìm thấy tài liệu cần phê duyệt."
        )

    document.status = "APPROVED"
    document.rejection_reason = None  # Xóa lý do từ chối nếu có từ trước
    db.commit()
    db.refresh(document)
    return document

@router.patch("/documents/{document_id}/reject", response_model=DocumentResponse)
def reject_document(
    document_id: str,
    payload: RejectDocumentPayload,
    db: Session = Depends(get_db),
    current_admin: User = Depends(require_admin)
):
    """
    Từ chối bài đăng học liệu kèm lý do cụ thể gửi cho người đăng (Chuyển sang trạng thái REJECTED)
    """
    try:
        doc_uuid = uuid.UUID(document_id)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Định dạng ID tài liệu không hợp lệ."
        )

    document = db.query(Document).filter(Document.id == doc_uuid).first()
    if not document:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Không tìm thấy tài liệu cần từ chối."
        )

    document.status = "REJECTED"
    document.rejection_reason = payload.reason.strip()
    db.commit()
    db.refresh(document)
    return document
