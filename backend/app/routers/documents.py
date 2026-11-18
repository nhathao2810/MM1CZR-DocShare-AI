import os
import uuid
import datetime
from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, Query, status
from pydantic import BaseModel
from sqlalchemy.orm import Session
from sqlalchemy import or_

from app.database import get_db
from app.models.user import User
from app.models.category import Category
from app.models.document import Document
from app.schemas.document import DocumentResponse
from app.middleware.auth import get_current_user
from app.services.extractor import extract_document_text

router = APIRouter(prefix="/api/documents", tags=["Quản lý tài liệu học tập"])

# Giới hạn dung lượng tệp: tối đa 20MB
MAX_FILE_SIZE_BYTES = 20 * 1024 * 1024  # 20 MB
ALLOWED_EXTENSIONS = {"pdf", "docx", "txt"}

class MyDocStatsResponse(BaseModel):
    total_uploaded: int
    pending_count: int
    approved_count: int
    rejected_count: int

@router.post("/upload", response_model=DocumentResponse, status_code=status.HTTP_201_CREATED)
async def upload_document(
    title: str = Form(..., min_length=3, max_length=255, description="Tiêu đề học liệu"),
    category_id: int = Form(..., description="ID danh mục môn học"),
    description: Optional[str] = Form(None, max_length=2000, description="Mô tả tóm tắt nội dung"),
    file: UploadFile = File(..., description="Tệp tin tài liệu (.pdf, .docx, .txt ≤ 20MB)"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Đăng tải tài liệu học tập mới:
    - Kiểm tra định dạng (.pdf, .docx, .txt) và dung lượng (≤ 20MB).
    - Lưu trữ tệp tin trên máy chủ.
    - Tự động bóc tách nội dung văn bản và đếm số trang.
    - Lưu vào CSDL với trạng thái PENDING (Chờ duyệt).
    """
    # 1. Kiểm tra danh mục môn học có tồn tại
    category = db.query(Category).filter(Category.id == category_id).first()
    if not category:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Danh mục môn học được chọn không tồn tại trong hệ thống."
        )

    # 2. Kiểm tra định dạng tệp tin
    raw_filename = file.filename or "tai-lieu-chua-dat-ten"
    extension = raw_filename.split(".")[-1].lower() if "." in raw_filename else ""
    if extension not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Định dạng tệp '.{extension}' không được hỗ trợ. Vui lòng chỉ tải lên tệp: .pdf, .docx, .txt"
        )

    # 3. Đọc dữ liệu và kiểm tra kích thước tệp
    content = await file.read()
    file_size = len(content)
    if file_size > MAX_FILE_SIZE_BYTES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Dung lượng tệp vượt quá giới hạn cho phép (20MB). Dung lượng hiện tại: {round(file_size / (1024*1024), 2)}MB"
        )
    if file_size == 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Tệp tin tải lên bị rỗng (0 bytes). Vui lòng chọn tệp hợp lệ."
        )

    # 4. Tổ chức thư mục lưu trữ theo năm/tháng: backend/uploads/documents/YYYY/MM/
    now = datetime.datetime.now()
    year_month = now.strftime("%Y/%m")
    base_upload_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "uploads", "documents", year_month)
    os.makedirs(base_upload_dir, exist_ok=True)

    # Tên tệp duy nhất để tránh xung đột
    safe_file_id = uuid.uuid4().hex
    saved_filename = f"{safe_file_id}.{extension}"
    file_path = os.path.join(base_upload_dir, saved_filename)

    with open(file_path, "wb") as f:
        f.write(content)

    # Đường dẫn tương đối phục vụ tệp tĩnh
    relative_url = f"/uploads/documents/{year_month}/{saved_filename}"

    # 5. Tự động bóc tách nội dung văn bản và đếm số trang
    extracted_text, page_count = extract_document_text(file_path, extension)

    # 6. Tạo bản ghi tài liệu mới trong CSDL
    new_doc = Document(
        title=title.strip(),
        description=description.strip() if description else None,
        category_id=category_id,
        uploader_id=current_user.id,
        file_url=relative_url,
        file_name=raw_filename,
        file_type=extension,
        file_size=file_size,
        page_count=page_count,
        status="PENDING",  # Mặc định ở trạng thái Chờ duyệt
        extracted_text=extracted_text
    )

    db.add(new_doc)
    db.commit()
    db.refresh(new_doc)

    return new_doc

@router.get("/my-stats", response_model=MyDocStatsResponse)
def get_my_documents_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Thống kê số lượng tài liệu đã tải lên của người dùng đang đăng nhập
    """
    user_docs = db.query(Document).filter(Document.uploader_id == current_user.id)
    total = user_docs.count()
    pending = user_docs.filter(Document.status == "PENDING").count()
    approved = user_docs.filter(Document.status == "APPROVED").count()
    rejected = user_docs.filter(Document.status == "REJECTED").count()

    return MyDocStatsResponse(
        total_uploaded=total,
        pending_count=pending,
        approved_count=approved,
        rejected_count=rejected
    )

@router.get("/my-documents", response_model=List[DocumentResponse])
def get_my_documents(
    status_filter: Optional[str] = Query(None, alias="status", description="Lọc theo trạng thái: PENDING, APPROVED, REJECTED"),
    q: Optional[str] = Query(None, description="Tìm kiếm theo tiêu đề tài liệu"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Lấy danh sách toàn bộ tài liệu do người dùng đang đăng nhập tải lên
    """
    query = db.query(Document).filter(Document.uploader_id == current_user.id)

    if status_filter and status_filter in ["PENDING", "APPROVED", "REJECTED"]:
        query = query.filter(Document.status == status_filter)

    if q and q.strip():
        search_pattern = f"%{q.strip()}%"
        query = query.filter(Document.title.ilike(search_pattern))

    documents = query.order_by(Document.created_at.desc()).all()
    return documents

@router.delete("/{document_id}", status_code=status.HTTP_200_OK)
def delete_my_document(
    document_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Xóa tài liệu của chính mình (hoặc Admin có thể xóa bất kỳ tài liệu nào)
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
            detail="Không tìm thấy tài liệu cần xóa."
        )

    # Ràng buộc quyền: Chỉ chủ bài đăng hoặc Quản trị viên mới được xóa
    if document.uploader_id != current_user.id and current_user.role != "ADMIN":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Bạn không có quyền xóa tài liệu của người khác."
        )

    # Xóa tệp tin vật lý trên ổ đĩa nếu tồn tại
    try:
        base_dir = os.path.dirname(os.path.dirname(os.path.dirname(__file__)))
        # document.file_url có dạng /uploads/documents/...
        rel_path = document.file_url.lstrip("/").replace("/", os.sep)
        disk_path = os.path.join(base_dir, rel_path)
        if os.path.exists(disk_path):
            os.remove(disk_path)
    except Exception as e:
        print(f"Cảnh báo: Không thể xóa file vật lý: {e}")

    db.delete(document)
    db.commit()

    return {"message": f"Đã xóa thành công tài liệu '{document.title}'", "id": document_id}

@router.get("/{document_id}", response_model=DocumentResponse)
def get_document_detail(
    document_id: str,
    db: Session = Depends(get_db)
):
    """
    Xem chi tiết một tài liệu theo ID
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
            detail="Không tìm thấy tài liệu học tập yêu cầu."
        )

    return document
