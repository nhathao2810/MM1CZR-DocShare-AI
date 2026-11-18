import React from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { ShieldAlert, ArrowLeft, LogIn } from "lucide-react";

export const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-3 text-sm text-slate-400 font-medium">Đang xác thực quyền Quản trị viên...</p>
        </div>
      </div>
    );
  }

  // Chưa đăng nhập -> Chuyển hướng tới trang Đăng nhập Admin riêng (/admin/login)
  if (!isAuthenticated || !user) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  // Đã đăng nhập nhưng KHÔNG PHẢI ADMIN -> Hiển thị màn hình 403 Access Denied rõ ràng
  if (user.role !== "ADMIN") {
    const handleSwitchToAdmin = () => {
      logout();
      navigate("/admin/login", { state: { from: location } });
    };

    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-8 text-center shadow-2xl space-y-6">
          <div className="w-16 h-16 bg-rose-500/10 border border-rose-500/30 text-rose-500 rounded-2xl flex items-center justify-center mx-auto">
            <ShieldAlert className="w-9 h-9" />
          </div>

          <div>
            <span className="inline-block px-3 py-1 bg-rose-500/20 text-rose-300 border border-rose-500/40 text-xs font-bold rounded-full mb-3">
              Mã lỗi 403: Không đủ thẩm quyền
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white">
              Quyền Truy Cập Bị Từ Chối
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-2 leading-relaxed">
              Bạn đang đăng nhập bằng tài khoản: <strong className="text-white">{user.email}</strong> với vai trò <strong className="text-amber-400">{user.role}</strong>. Trang này chỉ dành riêng cho Quản trị viên hệ thống.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              onClick={() => navigate("/")}
              className="flex-1 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold transition flex items-center justify-center space-x-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Về trang chủ</span>
            </button>
            <button
              onClick={handleSwitchToAdmin}
              className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-sm transition flex items-center justify-center space-x-1.5"
            >
              <LogIn className="w-4 h-4" />
              <span>Đăng nhập Admin</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Đã đăng nhập và là ADMIN -> Cho phép truy cập
  return <>{children}</>;
};
