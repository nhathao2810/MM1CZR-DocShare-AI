import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate, Outlet } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { getAssetUrl } from "../../services/api";
import { moderationService } from "../../services/moderationService";
import {
  LayoutDashboard,
  FolderTree,
  Users,
  FileCheck2,
  ArrowLeft,
  Shield,
  LogOut,
  Menu,
  X,
  BookOpen,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";

export const AdminLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [pendingCount, setPendingCount] = useState<number | null>(null);

  useEffect(() => {
    let isMounted = true;
    moderationService
      .getStats()
      .then((data) => {
        if (isMounted) {
          setPendingCount(data.pending_count);
        }
      })
      .catch(() => {
        // Silently ignore if not authorized or network issue
      });
    return () => {
      isMounted = false;
    };
  }, [location.pathname]);

  interface NavItem {
    name: string;
    path: string;
    icon: any;
    exact?: boolean;
    badge?: string;
    tagColor?: string;
  }

  const navItems: NavItem[] = [
    {
      name: "Tổng quan",
      path: "/admin",
      icon: LayoutDashboard,
      exact: true,
    },
    {
      name: "Quản lý danh mục",
      path: "/admin/categories",
      icon: FolderTree,
      badge: "Môn học",
    },
    {
      name: "Quản lý tài khoản",
      path: "/admin/users",
      icon: Users,
      badge: "Người dùng",
    },
    {
      name: "Kiểm duyệt học liệu",
      path: "/admin/moderation",
      icon: FileCheck2,
      badge: pendingCount && pendingCount > 0 ? `${pendingCount} chờ` : undefined,
      tagColor: "bg-amber-500/20 text-amber-300 border border-amber-500/30",
    },
  ];

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  const isActive = (path: string, exact?: boolean) => {
    if (exact) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row font-sans text-slate-800">
      {/* Mobile Header Bar */}
      <div className="md:hidden bg-slate-900 text-white px-4 py-3 flex items-center justify-between shadow-sm sticky top-0 z-40">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 bg-blue-600 rounded-lg">
            <BookOpen className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-lg tracking-tight">DocShare Admin</span>
        </div>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 bg-slate-900 text-slate-200 transform transition-all duration-200 ease-in-out md:translate-x-0 md:static md:inset-auto md:min-h-screen flex flex-col ${
          mobileMenuOpen ? "translate-x-0 w-64" : "-translate-x-full md:translate-x-0"
        } ${sidebarCollapsed ? "md:w-20" : "md:w-64"}`}
      >
        {/* Brand Header */}
        <div
          className={`px-4 py-5 border-b border-slate-800 flex items-center ${
            sidebarCollapsed ? "justify-center" : "justify-between"
          }`}
        >
          <Link to="/admin" className="flex items-center space-x-3 overflow-hidden">
            <div className="p-2 bg-gradient-to-tr from-blue-600 to-indigo-600 text-white rounded-xl shadow-md shrink-0">
              <Shield className="w-5 h-5" />
            </div>
            {!sidebarCollapsed && (
              <div className="truncate">
                <div className="font-extrabold text-base tracking-tight text-white flex items-center space-x-1.5">
                  <span>DocShare</span>
                  <span className="text-blue-400">AI</span>
                </div>
                <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Trang Quản Trị</p>
              </div>
            )}
          </Link>
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="md:hidden text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 px-3 py-6 space-y-1.5 overflow-y-auto">
          {!sidebarCollapsed && (
            <div className="px-3 pb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Menu Quản Trị
            </div>
          )}

          {navItems.map((item) => {
            const active = isActive(item.path, item.exact);
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                title={sidebarCollapsed ? item.name : undefined}
                className={`flex items-center ${
                  sidebarCollapsed ? "justify-center px-2 py-3" : "justify-between px-3.5 py-2.5"
                } rounded-xl text-sm font-medium transition-all ${
                  active
                    ? "bg-blue-600 text-white shadow-md shadow-blue-600/30 font-semibold"
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon className={`w-4 h-4 shrink-0 ${active ? "text-white" : "text-slate-400"}`} />
                  {!sidebarCollapsed && <span className="truncate">{item.name}</span>}
                </div>
                {!sidebarCollapsed && item.badge && (
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                      active
                        ? "bg-blue-700 text-blue-100"
                        : item.tagColor || "bg-slate-800 text-slate-300"
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
                {sidebarCollapsed && item.badge && (
                  <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-amber-400"></span>
                )}
              </Link>
            );
          })}
        </div>

        {/* Bottom Section: Client Link & User Card */}
        <div className="p-3 border-t border-slate-800 space-y-2">
          <Link
            to="/"
            title="Quay về trang người dùng"
            className={`flex items-center ${
              sidebarCollapsed ? "justify-center px-2 py-2.5" : "space-x-2 px-3 py-2"
            } rounded-xl text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition`}
          >
            <ArrowLeft className="w-4 h-4 text-slate-400 shrink-0" />
            {!sidebarCollapsed && <span>Quay về trang sinh viên</span>}
          </Link>

          <div
            className={`pt-2 border-t border-slate-800/80 flex items-center ${
              sidebarCollapsed ? "justify-center" : "justify-between px-2"
            }`}
          >
            <div className="flex items-center space-x-2.5 overflow-hidden">
              {user?.avatar_url ? (
                <img
                  src={getAssetUrl(user.avatar_url)}
                  alt={user.full_name}
                  className="w-8 h-8 rounded-full object-cover border border-slate-700 shrink-0"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
                  {user?.full_name ? user.full_name.charAt(0).toUpperCase() : "A"}
                </div>
              )}
              {!sidebarCollapsed && (
                <div className="truncate">
                  <p className="text-xs font-semibold text-white truncate">{user?.full_name}</p>
                  <p className="text-[10px] text-amber-400 font-medium">Quản trị viên</p>
                </div>
              )}
            </div>

            {!sidebarCollapsed && (
              <button
                onClick={handleLogout}
                title="Đăng xuất"
                className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-lg transition"
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 max-w-full overflow-hidden">
        {/* Top Header Bar */}
        <header className="bg-white border-b border-slate-200 px-4 sm:px-6 py-3 hidden md:flex items-center justify-between sticky top-0 z-30 shadow-xs">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition"
              title={sidebarCollapsed ? "Mở rộng thanh menu" : "Thu gọn thanh menu"}
            >
              {sidebarCollapsed ? (
                <PanelLeftOpen className="w-4 h-4 text-slate-600" />
              ) : (
                <PanelLeftClose className="w-4 h-4 text-slate-600" />
              )}
            </button>

            <div className="flex items-center space-x-2 text-xs font-medium text-slate-600">
              <span className="text-slate-400">DocShare AI</span>
              <span className="text-slate-300">/</span>
              <span className="text-slate-700 font-semibold">Cổng Quản Trị Hệ Thống</span>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1.5 px-3 py-1 bg-amber-50 text-amber-800 rounded-full border border-amber-200 text-xs font-semibold">
              <Shield className="w-3.5 h-3.5 text-amber-600" />
              <span>Chế độ Quản trị viên</span>
            </div>

            <Link
              to="/"
              className="text-xs font-medium text-slate-600 hover:text-blue-600 transition flex items-center space-x-1"
            >
              <span>Xem trang chính</span>
            </Link>
          </div>
        </header>

        {/* Render child pages */}
        <main className="flex-1 p-3 sm:p-5 lg:p-6 overflow-y-auto overflow-x-hidden min-w-0">
          <Outlet />
        </main>
      </div>

      {/* Mobile backdrop */}
      {mobileMenuOpen && (
        <div
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-40 md:hidden"
        />
      )}
    </div>
  );
};
