"""
Kịch bản kiểm thử Chặng 4: API Kiểm duyệt học liệu cho Quản trị viên (Admin Moderation)
"""
from fastapi.testclient import TestClient
from app.main import app
from app.database import SessionLocal
from app.models.user import User
from app.models.document import Document
from app.services.auth_service import create_access_token

client = TestClient(app)

def run_tests():
    db = SessionLocal()
    try:
        admin_user = db.query(User).filter(User.role == "ADMIN").first()
        normal_user = db.query(User).filter(User.role == "USER").first()

        assert admin_user is not None, "Cần có ít nhất 1 tài khoản ADMIN"
        assert normal_user is not None, "Cần có ít nhất 1 tài khoản USER"

        admin_token = create_access_token({"sub": str(admin_user.id)})
        user_token = create_access_token({"sub": str(normal_user.id)})

        admin_headers = {"Authorization": f"Bearer {admin_token}"}
        user_headers = {"Authorization": f"Bearer {user_token}"}

        print("1. Kiểm tra GET /api/admin/moderation/stats...")
        res = client.get("/api/admin/moderation/stats", headers=admin_headers)
        assert res.status_code == 200, f"Lỗi stats: {res.text}"
        stats = res.json()
        print(f"   -> Thành công! Thống kê kiểm duyệt: {stats}")
        assert "pending_count" in stats
        assert "approved_count" in stats

        print("2. Kiểm tra chặn người dùng thường (USER) truy cập trang duyệt bài...")
        res = client.get("/api/admin/moderation/stats", headers=user_headers)
        assert res.status_code == 403, f"Phải chặn với 403, nhận: {res.status_code}"
        print("   -> Thành công! Đã chặn 403 Forbidden chính xác đối với USER thường.")

        print("3. Kiểm tra GET /api/admin/moderation/documents...")
        res = client.get("/api/admin/moderation/documents?status=ALL", headers=admin_headers)
        assert res.status_code == 200
        docs = res.json()
        print(f"   -> Thành công! Lấy được {len(docs)} tài liệu trong hàng đợi kiểm duyệt.")

        if len(docs) > 0:
            target_doc = docs[0]
            doc_id = target_doc["id"]

            print(f"4. Kiểm tra Phê duyệt tài liệu ID: {doc_id}...")
            res = client.patch(f"/api/admin/moderation/documents/{doc_id}/approve", headers=admin_headers)
            assert res.status_code == 200
            approved_doc = res.json()
            assert approved_doc["status"] == "APPROVED"
            assert approved_doc["rejection_reason"] is None
            print("   -> Phê duyệt thành công! Trạng thái: APPROVED.")

            print(f"5. Kiểm tra Từ chối tài liệu ID: {doc_id} kèm lý do...")
            test_reason = "Tài liệu bị trùng lặp nội dung, vui lòng kiểm tra lại trước khi gửi."
            res = client.patch(
                f"/api/admin/moderation/documents/{doc_id}/reject",
                json={"reason": test_reason},
                headers=admin_headers
            )
            assert res.status_code == 200
            rejected_doc = res.json()
            assert rejected_doc["status"] == "REJECTED"
            assert rejected_doc["rejection_reason"] == test_reason
            print(f"   -> Từ chối thành công! Trạng thái: REJECTED, Lý do: '{rejected_doc['rejection_reason']}'.")

            # Đưa lại về trạng thái PENDING để test tiếp nếu cần
            print("6. Đưa lại tài liệu về trạng thái PENDING...")
            db_doc = db.query(Document).filter(Document.id == doc_id).first()
            if db_doc:
                db_doc.status = "PENDING"
                db_doc.rejection_reason = None
                db.commit()
                print("   -> Đã khôi phục trạng thái PENDING cho bài test.")

        print("\n✅ TOÀN BỘ CÁC BÀI TEST CHẶNG 4 (ADMIN MODERATION) ĐÃ VƯỢT QUA 100%!")

    finally:
        db.close()

if __name__ == "__main__":
    run_tests()
