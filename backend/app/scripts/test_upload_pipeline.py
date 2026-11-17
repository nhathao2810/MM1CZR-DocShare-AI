"""
Kịch bản kiểm thử toàn diện Chặng 2: Pipeline Upload & Bóc tách văn bản tự động
"""
import io
import fitz
import docx
from fastapi.testclient import TestClient
from app.main import app
from app.database import engine, Base, SessionLocal
from app.models.user import User
from app.models.category import Category
from app.models.document import Document
from app.services.auth_service import create_access_token

client = TestClient(app)

def create_sample_pdf() -> bytes:
    doc = fitz.open()
    page1 = doc.new_page()
    page1.insert_text((50, 100), "DocShare AI - Giao trinh Lap trinh Web nang cao Trang 1\nNoi dung chuong 1: Tong quan Client-Server.", fontsize=14)
    page2 = doc.new_page()
    page2.insert_text((50, 100), "DocShare AI - Trang 2\nNoi dung chuong 2: Xay dung RESTful API bang FastAPI.", fontsize=14)
    pdf_bytes = doc.tobytes()
    doc.close()
    return pdf_bytes

def create_sample_docx() -> bytes:
    doc = docx.Document()
    doc.add_heading("DocShare AI - Giao trinh He quan tri Co so du lieu", level=1)
    doc.add_paragraph("Do an tot nghiep DocShare AI nhom MM1CZR de tai TN-102.")
    doc.add_paragraph("Kien truc PostgreSQL va toi uu hoa chi muc B-Tree.")
    buffer = io.BytesIO()
    doc.save(buffer)
    return buffer.getvalue()

def run_tests():
    print("1. Kiểm tra cấu trúc CSDL và tạo bảng 'documents' trên Supabase...")
    Base.metadata.create_all(bind=engine)
    print("   -> Bảng 'documents' đã sẵn sàng trên CSDL!")

    db = SessionLocal()
    try:
        user = db.query(User).first()
        category = db.query(Category).first()

        assert user is not None, "Cần có ít nhất 1 tài khoản người dùng"
        assert category is not None, "Cần có ít nhất 1 danh mục môn học"

        token = create_access_token({"sub": str(user.id)})
        headers = {"Authorization": f"Bearer {token}"}

        # TEST 1: Upload file PDF
        print("2. Kiểm tra Upload file PDF và bóc tách chữ tự động (PyMuPDF)...")
        pdf_bytes = create_sample_pdf()
        res = client.post(
            "/api/documents/upload",
            data={
                "title": "Giáo trình Lập trình Web nâng cao 2026",
                "category_id": category.id,
                "description": "Tài liệu học tập kiểm thử PDF"
            },
            files={"file": ("giao-trinh-web.pdf", pdf_bytes, "application/pdf")},
            headers=headers
        )
        assert res.status_code == 201, f"Lỗi upload PDF: {res.text}"
        pdf_doc = res.json()
        print(f"   -> Thành công! Doc ID: {pdf_doc['id']}, Trạng thái: {pdf_doc['status']}, Số trang: {pdf_doc['page_count']}")
        assert pdf_doc["status"] == "PENDING"
        assert pdf_doc["page_count"] == 2
        assert "DocShare AI" in pdf_doc["extracted_text"]
        assert "FastAPI" in pdf_doc["extracted_text"]

        # TEST 2: Upload file DOCX
        print("3. Kiểm tra Upload file Word (.docx) và bóc tách chữ (python-docx)...")
        docx_bytes = create_sample_docx()
        res = client.post(
            "/api/documents/upload",
            data={
                "title": "Tài liệu CSDL PostgreSQL và Tối ưu hóa",
                "category_id": category.id,
                "description": "Tài liệu kiểm thử DOCX"
            },
            files={"file": ("csdl-postgresql.docx", docx_bytes, "application/vnd.openxmlformats-officedocument.wordprocessingml.document")},
            headers=headers
        )
        assert res.status_code == 201, f"Lỗi upload DOCX: {res.text}"
        docx_doc = res.json()
        print(f"   -> Thành công! Doc ID: {docx_doc['id']}, Số trang ước tính: {docx_doc['page_count']}")
        assert "PostgreSQL" in docx_doc["extracted_text"]

        # TEST 3: Upload file TXT
        print("4. Kiểm tra Upload file văn bản thuần (.txt)...")
        txt_bytes = "De thi trac nghiem Kien truc may tinh gom 50 cau hoi.".encode("utf-8")
        res = client.post(
            "/api/documents/upload",
            data={
                "title": "Đề thi trắc nghiệm Kiến trúc máy tính",
                "category_id": category.id,
            },
            files={"file": ("de-thi.txt", txt_bytes, "text/plain")},
            headers=headers
        )
        assert res.status_code == 201
        txt_doc = res.json()
        assert "trac nghiem" in txt_doc["extracted_text"]
        print("   -> Thành công! Đã bóc tách nội dung TXT.")

        # TEST 4: Chặn tệp không hợp lệ (ví dụ: .zip hoặc .exe)
        print("5. Kiểm tra kiểm tra định dạng tệp bị cấm (Blacklist check)...")
        res = client.post(
            "/api/documents/upload",
            data={"title": "File Virus Test", "category_id": category.id},
            files={"file": ("trojan.exe", b"fake binary", "application/octet-stream")},
            headers=headers
        )
        assert res.status_code == 400
        print("   -> Thành công! Hệ thống đã chặn định dạng '.exe' với mã 400 Bad Request.")

        # TEST 5: Chặn danh mục không tồn tại
        print("6. Kiểm tra ràng buộc danh mục không tồn tại...")
        res = client.post(
            "/api/documents/upload",
            data={"title": "Doc with invalid category", "category_id": 999999},
            files={"file": ("test.txt", b"sample content", "text/plain")},
            headers=headers
        )
        assert res.status_code == 400
        print("   -> Thành công! Hệ thống đã chặn danh mục không hợp lệ (400 Bad Request).")

        print("\n✅ TOÀN BỘ 5 BÀI TEST CHẶNG 2 (UPLOAD & BÓC TÁCH) ĐÃ VƯỢT QUA 100%!")

    finally:
        db.close()

if __name__ == "__main__":
    run_tests()

