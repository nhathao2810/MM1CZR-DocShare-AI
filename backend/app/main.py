"""
Main Application Entry Point
DocShare AI Backend
"""
import os
from dotenv import load_dotenv

load_dotenv()

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.database import engine, Base
import app.models  # Đăng ký toàn bộ models với Base
from app.routers import auth, categories, admin_users, documents

# Tự động tạo bảng trên CSDL nếu chưa tồn tại
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="DocShare AI API",
    description="Hệ thống quản lý, chia sẻ tài nguyên học tập và tìm kiếm tài liệu thông minh ứng dụng AI",
    version="1.0.0",
)

# Cấu hình CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount thư mục uploads để phục vụ tệp tĩnh (ảnh đại diện, tài liệu xem trước)
uploads_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), "uploads")
os.makedirs(uploads_dir, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=uploads_dir), name="uploads")

# Đăng ký Routers
app.include_router(auth.router)
app.include_router(categories.router)
app.include_router(admin_users.router)
app.include_router(documents.router)

@app.get("/", tags=["Hệ thống"])
def root():
    return {
        "project": "DocShare AI",
        "status": "Online",
        "docs_url": "/docs"
    }

@app.get("/api/health", tags=["Hệ thống"])
def health_check():
    return {"status": "ok", "service": "DocShare AI"}
