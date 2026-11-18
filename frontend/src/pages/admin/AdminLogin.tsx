import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import {
  Shield,
  Lock,
  Mail,
  ArrowRight,
  AlertCircle,
  ArrowLeft,
  KeyRound,
  CheckCircle2,
} from "lucide-react";

export const AdminLogin: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { login, logout, user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Đích đến sau khi đăng nhập thành công (mặc định là /admin)
  const from = (location.state as any)?.from?.pathname || "/admin";

  // Nếu đã đăng nhập sẵn và là ADMIN -> chuyển hướng ngay vào /admin
  useEffect(() => {
    if (isAuthenticated && user?.role === "ADMIN") {
      navigate("/admin", { replace: true });
    }
  }, [isAuthenticated, user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const loggedUser = await login({ email, password });

      // Kiểm tra trạng thái tài khoản
      if (loggedUser.status === "BANNED") {
        logout();
        setError("Tài khoản của bạn đang bị khóa bởi hệ thống.");
        return;
      }

      // KIỂM TRA QUYỀN QUẢN TRỊ VIÊN:
      // Nếu không phải ADMIN -> Lập tức hủy phiên và báo lỗi từ chối quyền truy cập
      if (loggedUser.role !== "ADMIN") {
        logout();
        setError(
          "Từ chối quyền truy cập! Tài khoản này không có quyền Quản trị viên. Vui lòng đăng nhập bằng tài khoản Quản trị hoặc quay lại cổng sinh viên."
        );
        return;
      }

      // Đăng nhập thành công với vai trò Quản trị viên
      navigate(from, { replace: true });
    } catch (err: any) {
      const msg =
        err.response?.data?.detail ||
        "Đăng nhập thất bại. Vui lòng kiểm tra lại email hoặc mật khẩu Quản trị viên.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden font-sans">
      {/* Background Glow Accents */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-blue-600/20 via-indigo-600/20 to-purple-600/20 blur-[100px] pointer-events-none rounded-full"></div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4">
        {/* Back Link */}
        <div className="mb-6">
          <Link
            to="/"
            className="inline-flex items-center space-x-2 text-xs font-medium text-slate-400 hover:text-white transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Quay về trang học liệu sinh viên</span>
          </Link>
        </div>

        {/* Portal Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30 mx-auto">
            <Shield className="w-8 h-8" />
          </div>

          <div>
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 bg-amber-500/10 border border-amber-500/30 rounded-full text-amber-300 text-[11px] font-bold uppercase tracking-wider mb-2">
              <KeyRound className="w-3 h-3 text-amber-400" />
              <span>Cổng Quản Trị Hệ Thống</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              DocShare <span className="text-blue-400">Admin</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-sm mx-auto">
              Đăng nhập dành riêng cho Ban quản trị để kiểm duyệt học liệu, quản lý môn học và người dùng.
            </p>
          </div>
        </div>

        {/* Form Container */}
        <div className="mt-8 bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-black/50">
          {error && (
            <div className="mb-6 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start space-x-3 leading-relaxed animate-in fade-in duration-200">
              <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
              <div className="flex-1">
                <span className="font-bold block text-rose-200">Không thể truy cập:</span>
                <span>{error}</span>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                Email Quản Trị Viên <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <Mail className="w-5 h-5 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@docshare.edu.vn"
                  className="w-full pl-11 pr-4 py-3 bg-slate-950/60 border border-slate-700/80 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                Mật Khẩu Quản Trị <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <Lock className="w-5 h-5 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-11 pr-4 py-3 bg-slate-950/60 border border-slate-700/80 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:opacity-50 text-white font-bold rounded-xl shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center space-x-2 text-sm active:scale-98"
              >
                {loading ? (
                  <span>Đang xác thực bảo mật...</span>
                ) : (
                  <>
                    <span>Đăng nhập trang Quản trị</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Footer Security Notice */}
          <div className="mt-6 pt-5 border-t border-slate-800 text-center">
            <div className="inline-flex items-center space-x-1.5 text-[11px] text-slate-400">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Hệ thống phân quyền Role-Based Access Control (RBAC)</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-2">
              Bạn là sinh viên?{" "}
              <Link to="/login" className="text-blue-400 hover:text-blue-300 font-semibold underline">
                Đăng nhập tại cổng sinh viên
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
