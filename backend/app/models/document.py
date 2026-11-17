import uuid
from sqlalchemy import Column, String, Integer, Text, DateTime, ForeignKey, CheckConstraint
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base

class Document(Base):
    __tablename__ = "documents"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    title = Column(String(255), nullable=False, index=True)
    description = Column(Text, nullable=True)
    category_id = Column(Integer, ForeignKey("categories.id", ondelete="RESTRICT"), nullable=False, index=True)
    uploader_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    
    # Thông tin tệp tin lưu trữ
    file_url = Column(String(500), nullable=False)
    file_name = Column(String(255), nullable=False)
    file_type = Column(String(20), nullable=False)  # pdf, docx, txt
    file_size = Column(Integer, nullable=False)      # kích thước tính bằng bytes
    page_count = Column(Integer, nullable=False, default=1)
    
    # Trạng thái kiểm duyệt: PENDING (Chờ duyệt), APPROVED (Đã duyệt), REJECTED (Bị từ chối)
    status = Column(
        String(20),
        CheckConstraint("status IN ('PENDING', 'APPROVED', 'REJECTED')", name="check_document_status"),
        nullable=False,
        default="PENDING",
        index=True
    )
    rejection_reason = Column(Text, nullable=True)
    
    # Nội dung văn bản bóc tách tự động (phục vụ xem trước, kiểm duyệt và vector hóa AI)
    extracted_text = Column(Text, nullable=True)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)

    # Quan hệ liên kết
    category = relationship("Category", backref="documents")
    uploader = relationship("User", backref="documents")

