import React from "react";

export default function App() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", backgroundColor: "#f8fafc", padding: "20px" }}>
      <div style={{ maxWidth: "600px", background: "white", padding: "32px", borderRadius: "12px", boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)", textAlign: "center" }}>
        <h1 style={{ fontSize: "28px", fontWeight: "bold", color: "#1e293b", marginBottom: "12px" }}>
          DocShare AI
        </h1>
        <p style={{ color: "#64748b", fontSize: "16px", marginBottom: "20px" }}>
          Hệ thống Quản lý, Chia sẻ Tài nguyên Học tập và Tìm kiếm Tài liệu Thông minh Ứng dụng AI
        </p>
        <div style={{ display: "inline-block", background: "#e0f2fe", color: "#0369a1", padding: "6px 14px", borderRadius: "9999px", fontSize: "14px", fontWeight: 600 }}>
          Mã nhóm: MM1CZR | Đề tài: TN-102
        </div>
      </div>
    </div>
  );
}
