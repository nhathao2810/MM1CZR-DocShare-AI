"""
Kịch bản kiểm thử Chặng 3: API Quản lý bài đăng cá nhân (My Documents)
"""
from fastapi.testclient import TestClient
from app.main import app
from app.database import SessionLocal
from app.models.user import User
from app.models.category import Category
from app.models.document import Document
from app.services.auth_service import create_access_token

client = TestClient(app)

def run_tests():
    db = SessionLocal()
    try:
        users = db.query(User).all()
        assert len(users) >= 2, "Cần ít nhất 2 người dùng để kiểm thử phân quyền xóa"

        user1 = users[0]
        user2 = users[1]

        token1 = create_access_token({"sub": str(user1.id)})
        token2 = create_access_token({"sub": str(user2.id)})

        headers1 = {"Authorization": f"Bearer {token1}"}
        headers2 = {"Authorization": f"Bearer {token2}"}

        print("1. Kiểm tra GET /api/documents/my-stats...")
        res = client.get("/api/documents/my-stats", headers=headers1)
        assert res.status_code == 200, f"Lỗi my-stats: {res.text}"
        stats = res.json()
        print(f"   -> Thành công! Thống kê cá nhân: {stats}")
        assert "total_uploaded" in stats
        assert "pending_count" in stats

        print("2. Kiểm tra GET /api/documents/my-documents...")
        res = client.get("/api/documents/my-documents", headers=headers1)
        assert res.status_code == 200
        docs = res.json()
        print(f"   -> Thành công! Lấy được {len(docs)} tài liệu của User 1.")

        if len(docs) > 0:
            target_doc = docs[0]
            doc_id = target_doc["id"]

            print("3. Kiểm tra bảo vệ quyền: User 2 cố tình xóa tài liệu của User 1...")
            # Nếu user2 là ADMIN thì có quyền, nhưng nếu user2 là USER thì phải bị 403
            if user2.role == "USER":
                res = client.delete(f"/api/documents/{doc_id}", headers=headers2)
                assert res.status_code == 403, f"Phải chặn với 403 Forbidden, nhận: {res.status_code}"
                print("   -> Thành công! Đã chặn 403 Forbidden khi người khác cố tình xóa tài liệu.")

        print("\n✅ TẤT CẢ CÁC BÀI TEST CHẶNG 3 BACKEND ĐỀU VƯỢT QUA 100%!")

    finally:
        db.close()

if __name__ == "__main__":
    run_tests()

