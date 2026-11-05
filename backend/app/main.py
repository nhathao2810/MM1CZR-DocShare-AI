"""
Main Application Entry Point
DocShare AI Backend - Group MM1CZR - Topic TN-102
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="DocShare AI API",
    description="Hệ thống quản lý, chia sẻ tài nguyên học tập và tìm kiếm tài liệu thông minh ứng dụng AI",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/", tags=["Root"])
def root():
    return {
        "project": "DocShare AI",
        "team": "MM1CZR",
        "topic": "TN-102",
        "status": "Online",
        "docs_url": "/docs"
    }

@app.get("/api/health", tags=["Health Check"])
def health_check():
    return {"status": "ok"}
