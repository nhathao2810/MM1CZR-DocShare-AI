import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { getAssetUrl } from "../services/api";
import { BookOpen, LogOut, User as UserIcon, Shield, UploadCloud } from "lucide-react";

export const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo & Brand Identity */}
          <div className="flex items-center space-x-3">
            <Link to="/" className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 transition">
              <div className="p-2 bg-gradient-to-tr from-blue-600 to-indigo-600 text-white rounded-xl shadow-sm">
                <BookOpen className="w-5 h-5" />
              </div>
              <span className="font-extrabold text-xl tracking-tight text-slate-800">
                DocShare <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">AI</span>
              </span>
            </Link>
          </div>

          {/* Navigation & Auth Section */}
          <div className="flex items-center space-x-4">
            <Link to="/" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition">
              Khám phá tài liệu
            </Link>

            <Link
              to="/upload"
              className="text-sm font-medium text-slate-600 hover:text-blue-600 transition flex items-center space-x-1.5"
            >
              <UploadCloud className="w-4 h-4 text-blue-600" />
              <span>Đăng tài liệu</span>
            </Link>

            {isAuthenticated && user && user.role === "ADMIN" && (
              <Link
                to="/admin"
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-gradient-to-r from-amber-50 to-orange-50 hover:from-amber-100 hover:to-orange-100 text-amber-800 rounded-xl text-xs font-bold border border-amber-200/80 shadow-xs transition active:scale-95"
              >
                <Shield className="w-3.5 h-3.5 text-amber-600" />
                <span>Trang Quản Trị</span>
              </Link>
            )}

            {isAuthenticated && user ? (
              <div className="flex items-center space-x-3 border-l border-slate-200 pl-4">
                <Link
                  to="/profile"
                  className="flex items-center space-x-2.5 hover:opacity-90 transition group"
                  title="Hồ sơ cá nhân"
                >
                  {user.avatar_url ? (
                    <img
                      src={getAssetUrl(user.avatar_url)}
                      alt={user.full_name}
                      className="w-8 h-8 rounded-full object-cover border border-slate-200 shadow-sm"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold text-xs shadow-sm group-hover:shadow transition">
                      {user.full_name ? user.full_name.charAt(0).toUpperCase() : "U"}
                    </div>
                  )}

                  <div className="hidden sm:block text-left">
                    <p className="text-sm font-semibold text-slate-800 group-hover:text-blue-600 transition leading-tight">
                      {user.full_name}
                    </p>
                    <div className="flex items-center space-x-1 mt-0.5">
                      {user.role === "ADMIN" ? (
                        <span className="inline-flex items-center text-[10px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.2 rounded border border-amber-200">
                          <Shield className="w-2.5 h-2.5 mr-0.5" /> Quản trị viên
                        </span>
                      ) : (
                        <span className="inline-flex items-center text-[10px] font-medium text-slate-500 bg-slate-100 px-1.5 py-0.2 rounded">
                          <UserIcon className="w-2.5 h-2.5 mr-0.5" /> Thành viên
                        </span>
                      )}
                    </div>
                  </div>
                </Link>

                <button
                  onClick={handleLogout}
                  title="Đăng xuất"
                  className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-slate-700 hover:text-blue-600 transition"
                >
                  Đăng nhập
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-sm transition"
                >
                  Đăng ký
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
