"""
Script khởi tạo bảng và dữ liệu mẫu danh mục môn học (DocShare AI)
"""
from app.database import engine, Base, SessionLocal
from app.models.category import Category
from app.models.user import User
from app.utils.slug import slugify

def seed_data():
    print("Đang tạo bảng trên Supabase...")
    Base.metadata.create_all(bind=engine)
    print("-> Bảng đã sẵn sàng!")

    db = SessionLocal()
    try:
        # 1. Khởi tạo danh mục môn học mẫu
        initial_categories = [
            {
                "name": "Lập trình Web & Di động",
                "description": "Tài liệu React, Vue, Node.js, FastAPI, Flutter và lập trình di động",
                "icon": "code"
            },
            {
                "name": "Cơ sở dữ liệu & SQL",
                "description": "Giáo trình và bài tập PostgreSQL, MySQL, MongoDB, tối ưu hóa truy vấn CSDL",
                "icon": "database"
            },
            {
                "name": "Trí tuệ nhân tạo & Học máy",
                "description": "Tài liệu Machine Learning, Deep Learning, NLP, Computer Vision và Generative AI",
                "icon": "bot"
            },
            {
                "name": "Cấu trúc dữ liệu & Giải thuật",
                "description": "Các thuật toán kinh điển, cấu trúc dữ liệu mảng, danh sách liên kết, cây và đồ thị",
                "icon": "cpu"
            },
            {
                "name": "Mạng máy tính & An toàn thông tin",
                "description": "Mô hình OSI/TCP-IP, định tuyến mạng, bảo mật và an ninh mạng",
                "icon": "shield-check"
            },
            {
                "name": "Toán cao cấp & Đại số",
                "description": "Giải tích 1, 2, Đại số tuyến tính, Xác suất thống kê ứng dụng cho CNTT",
                "icon": "calculator"
            }
        ]

        added_count = 0
        for item in initial_categories:
            slug = slugify(item["name"])
            existing = db.query(Category).filter(Category.slug == slug).first()
            if not existing:
                category = Category(
                    name=item["name"],
                    slug=slug,
                    description=item["description"],
                    icon=item["icon"]
                )
                db.add(category)
                added_count += 1

        # 2. Đảm bảo tài khoản Lê Nhựt Anh (nhathao031028@gmail.com) có quyền ADMIN để quản trị
        admin_user = db.query(User).filter(User.email == "nhathao031028@gmail.com").first()
        if admin_user:
            admin_user.role = "ADMIN"
            print(f"-> Đã gán quyền ADMIN cho tài khoản: {admin_user.email} ({admin_user.full_name})")

        db.commit()
        print(f"-> Đã thêm mới {added_count} danh mục môn học thành công!")

    except Exception as e:
        db.rollback()
        print(f"Lỗi khi seed dữ liệu: {e}")
        raise
    finally:
        db.close()

if __name__ == "__main__":
    seed_data()

