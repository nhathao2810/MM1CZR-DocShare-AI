import os
import uuid
import datetime
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, status
from sqlalchemy.orm import Session

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

