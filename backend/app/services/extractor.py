"""
Service bóc tách nội dung văn bản tự động từ các định dạng tài liệu học tập
Hỗ trợ: PDF (.pdf), Word (.docx), Văn bản thuần (.txt)
"""
import os
import logging
from typing import Tuple

logger = logging.getLogger(__name__)

def extract_from_pdf(file_path: str) -> Tuple[str, int]:
    """
    Bóc tách toàn bộ nội dung văn bản và số trang từ file PDF bằng PyMuPDF (fitz)
    """
    import fitz  # PyMuPDF
    doc = fitz.open(file_path)
    page_count = len(doc)
    
    extracted_chunks = []
    for page_num in range(page_count):
        page = doc.load_page(page_num)
        text = page.get_text("text")
        if text and text.strip():
            extracted_chunks.append(text.strip())
            
    doc.close()
    full_text = "\n\n".join(extracted_chunks)
    return full_text, max(1, page_count)

def extract_from_docx(file_path: str) -> Tuple[str, int]:
    """
    Bóc tách nội dung văn bản và bảng biểu từ file Word (.docx) bằng python-docx
    """
    import docx
    doc = docx.Document(file_path)
    
    text_parts = []
    # 1. Đọc tất cả các đoạn văn
    for paragraph in doc.paragraphs:
        cleaned = paragraph.text.strip()
        if cleaned:
            text_parts.append(cleaned)
            
    # 2. Đọc nội dung từ các bảng
    for table in doc.tables:
        for row in table.rows:
            cells_text = [cell.text.strip() for cell in row.cells if cell.text.strip()]
            if cells_text:
                text_parts.append(" | ".join(cells_text))
                
    full_text = "\n\n".join(text_parts)
    # Ước tính số trang tương đối dựa trên độ dài ký tự (khoảng 2,000 ký tự / trang)
    estimated_pages = max(1, round(len(full_text) / 2000))
    return full_text, estimated_pages

def extract_from_txt(file_path: str) -> Tuple[str, int]:
    """
    Đọc nội dung tệp tin văn bản thuần (.txt)
    """
    with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
        full_text = f.read()
    estimated_pages = max(1, round(len(full_text) / 2000))
    return full_text, estimated_pages

def extract_document_text(file_path: str, file_type: str) -> Tuple[str, int]:
    """
    Hàm điều hướng tự động bóc tách chữ dựa trên loại file
    Trả về: (văn bản đã bóc tách, số trang)
    """
    file_type = file_type.lower().replace(".", "").strip()
    try:
        if file_type == "pdf":
            return extract_from_pdf(file_path)
        elif file_type in ["docx", "doc"]:
            return extract_from_docx(file_path)
        elif file_type == "txt":
            return extract_from_txt(file_path)
        else:
            logger.warning(f"Định dạng tệp '{file_type}' chưa hỗ trợ bóc tách sâu.")
            return "", 1
    except Exception as e:
        logger.error(f"Lỗi khi bóc tách văn bản từ '{file_path}': {e}", exc_info=True)
        return "", 1

