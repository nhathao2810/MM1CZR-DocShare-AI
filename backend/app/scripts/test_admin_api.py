"""
Test script for Categories & Admin APIs
"""
import sys
from fastapi.testclient import TestClient
from app.main import app
from app.services.auth_service import create_access_token
from app.database import SessionLocal
from app.models.user import User

client = TestClient(app)

def run_tests():
    db = SessionLocal()
    try:
        admin_user = db.query(User).filter(User.role == "ADMIN").first()
        normal_user = db.query(User).filter(User.role == "USER").first()

        assert admin_user is not None, "Cần ít nhất 1 tài khoản ADMIN"
        assert normal_user is not None, "Cần ít nhất 1 tài khoản USER"

        admin_token = create_access_token({"sub": str(admin_user.id)})
        user_token = create_access_token({"sub": str(normal_user.id)})

        admin_headers = {"Authorization": f"Bearer {admin_token}"}
        user_headers = {"Authorization": f"Bearer {user_token}"}

        print("1. Kiểm tra GET /api/categories (Công khai)...")
        res = client.get("/api/categories")
        assert res.status_code == 200, f"Lỗi get categories: {res.text}"
        categories = res.json()
        print(f"   -> Thành công! Số lượng danh mục: {len(categories)}")
        assert len(categories) >= 6

        print("2. Kiểm tra GET /api/admin/stats (Admin)...")
        res = client.get("/api/admin/stats", headers=admin_headers)
        assert res.status_code == 200, f"Lỗi admin stats: {res.text}"
        stats = res.json()
        print(f"   -> Thành công! Thống kê: {stats}")
        assert stats["admin_users"] >= 1
        assert stats["total_categories"] >= 6

        print("3. Kiểm tra chặn người dùng thường truy cập /api/admin/stats (RBAC)...")
        res = client.get("/api/admin/stats", headers=user_headers)
        assert res.status_code == 403, f"Phải chặn USER thường với mã 403, nhưng nhận: {res.status_code}"
        print("   -> Thành công! Đã chặn 403 Forbidden chính xác.")

        print("4. Kiểm tra GET /api/admin/users...")
        res = client.get("/api/admin/users", headers=admin_headers)
        assert res.status_code == 200
        users = res.json()
        print(f"   -> Thành công! Lấy được {len(users)} người dùng.")

        print("5. Kiểm tra an toàn: Admin tự khóa tài khoản chính mình...")
        res = client.patch(f"/api/admin/users/{admin_user.id}/status", json={"status": "BANNED"}, headers=admin_headers)
        assert res.status_code == 400
        print("   -> Thành công! Hệ thống từ chối khóa chính mình (400 Bad Request).")

        print("6. Kiểm tra CRUD Danh mục (Tạo mới -> Sửa -> Xóa)...")
        # Tạo
        res = client.post("/api/categories", json={
            "name": "Môn học Thử nghiệm KTPM",
            "description": "Mô tả môn học test",
            "icon": "book"
        }, headers=admin_headers)
        assert res.status_code == 201, f"Lỗi tạo category: {res.text}"
        created_cat = res.json()
        cat_id = created_cat["id"]
        print(f"   -> Đã tạo danh mục test ID: {cat_id}, Slug: {created_cat['slug']}")

        # Sửa
        res = client.put(f"/api/categories/{cat_id}", json={
            "name": "Môn học Thử nghiệm Đã Cập Nhật",
            "description": "Mô tả mới",
            "icon": "star"
        }, headers=admin_headers)
        assert res.status_code == 200
        assert res.json()["name"] == "Môn học Thử nghiệm Đã Cập Nhật"
        print("   -> Đã cập nhật danh mục thành công.")

        # Xóa
        res = client.delete(f"/api/categories/{cat_id}", headers=admin_headers)
        assert res.status_code == 200
        print("   -> Đã xóa danh mục test thành công.")

        print("\n✅ TẤT CẢ 6 BÀI KIỂM THỬ BACKEND ĐỀU VƯỢT QUA 100%!")

    finally:
        db.close()

if __name__ == "__main__":
    run_tests()

