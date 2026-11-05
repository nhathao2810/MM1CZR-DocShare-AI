# 🎓 [MM1CZR - TN102] DocShare AI

> **Hệ thống Quản lý, Chia sẻ Tài nguyên Học tập và Tìm kiếm Tài liệu Thông minh Ứng dụng AI**

- **Mã nhóm:** MM1CZR (Nhóm 6)
- **Mã đề tài:** TN-102
- **Sinh viên thực hiện:** Nguyễn Nhật Hào
- **Đợt đồ án:** Luận văn tốt nghiệp - Đợt tháng 10/2026

---

## 🛠️ Công nghệ sử dụng

- **Frontend:** ReactJS, TypeScript, Tailwind CSS, Axios, Lucide React
- **Backend:** Python FastAPI (>= 3.10), SQLAlchemy ORM, Alembic, Pydantic v2
- **Xác thực:** JSON Web Token (python-jose), Bcrypt (passlib)
- **Cơ sở dữ liệu:** PostgreSQL (Quan hệ) & ChromaDB (Vector Database)
- **AI Stack:** Google Gemini 1.5 Flash (Tóm tắt học thuật), Sentence-Transformers (Tìm kiếm ngữ nghĩa)

---

## 📁 Cấu trúc dự án (Monorepo)

```text
MM1CZR-DocShare-AI/
├── backend/                      # Máy chủ FastAPI (Python)
│   ├── app/
│   │   ├── middleware/           # Middleware xác thực JWT & phân quyền vai trò
│   │   ├── models/               # SQLAlchemy Models (bảng CSDL)
│   │   ├── routers/              # API Endpoints (Auth, Docs, Categories, Admin)
│   │   ├── schemas/              # Pydantic Schemas (Ràng buộc & Validate dữ liệu)
│   │   ├── services/             # Logic nghiệp vụ (Auth, AI Gemini, Vector ChromaDB)
│   │   ├── utils/                # Tiện ích bóc tách tệp PDF/Docx, helper
│   │   ├── config.py             # Cấu hình biến môi trường
│   │   ├── database.py           # Kết nối PostgreSQL
│   │   └── main.py               # Điểm khởi chạy ứng dụng FastAPI
│   ├── alembic/                  # Cấu hình & các phiên bản DB migration
│   ├── uploads/                  # Thư mục lưu trữ tệp tài liệu cục bộ
│   ├── requirements.txt          # Danh sách thư viện Backend
│   └── .env.example              # Mẫu cấu hình biến môi trường Backend
│
├── frontend/                     # Giao diện người dùng ReactJS (TypeScript)
│   ├── src/
│   │   ├── components/           # Components tái sử dụng (Layout, Header, ...)
│   │   ├── contexts/             # State quản lý người dùng & phiên đăng nhập
│   │   ├── pages/                # Các trang giao diện (Home, Auth, Admin, ...)
│   │   ├── services/             # Kết nối API Backend (Axios Client)
│   │   ├── types/                # Định nghĩa kiểu dữ liệu TypeScript
│   │   ├── utils/                # Hàm bổ trợ định dạng, kiểm tra
│   │   ├── App.tsx               # Root component
│   │   ├── main.tsx              # Điểm khởi chạy React DOM
│   │   └── index.css             # Tailwind CSS & Global styles
│   ├── public/                   # Tài nguyên tĩnh (Favicon, Logo, Icons)
│   ├── package.json              # Quản lý dependencies Frontend
│   ├── tsconfig.json             # Cấu hình TypeScript
│   ├── vite.config.ts            # Cấu hình Vite bundler
│   └── .env.example              # Mẫu cấu hình biến môi trường Frontend
│
├── .gitignore                    # Bỏ qua tệp rác, thư viện và biến môi trường
└── README.md                     # Tài liệu hướng dẫn dự án
```

---

## 🚀 Hướng dẫn khởi chạy dự án

### 1. Khởi chạy Backend
```bash
cd backend
python -m venv venv

# Windows PowerShell:
.\venv\Scripts\Activate.ps1

pip install -r requirements.txt
cp .env.example .env
uvicorn app.main:app --reload --port 8000
```
- API Documentation (Swagger UI): [http://localhost:8000/docs](http://localhost:8000/docs)
- API Health Check: [http://localhost:8000/api/health](http://localhost:8000/api/health)

### 2. Khởi chạy Frontend
```bash
cd frontend
npm install
npm run dev
```
- Ứng dụng chạy tại: [http://localhost:5173](http://localhost:5173)
