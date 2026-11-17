import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { adminService } from "../../services/adminService";
import { AdminStats } from "../../types/category";
import {
  Users,
  FolderTree,
  ShieldCheck,
  UserCheck,
  PlusCircle,
  FileText,
  Sparkles,
  ArrowRight,
  Server,
  Database,
  CheckCircle2,
} from "lucide-react";

export const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await adminService.getStats();
        setStats(data);
      } catch (err) {
        console.error("Lỗi khi tải thống kê:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-slate-900 rounded-2xl p-6 sm:p-8 text-white shadow-md relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-semibold text-blue-100 mb-3 border border-white/20">
            <Sparkles className="w-3.5 h-3.5 text-blue-300" />
            <span>DocShare AI Management</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Trung Tâm Quản Trị Hệ Thống
          </h1>
          <p className="mt-2 text-sm text-blue-100 leading-relaxed">
            Giám sát danh mục môn học, thành viên và các tài liệu chia sẻ trên hệ thống DocShare AI.
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Users */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Tổng thành viên</p>
            <p className="text-2xl font-extrabold text-slate-800 mt-1">
              {loading ? "..." : stats?.total_users ?? 0}
            </p>
            <span className="text-[11px] text-slate-400 mt-1 block">Tài khoản đã đăng ký</span>
          </div>
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
            <Users className="w-6 h-6" />
          </div>
        </div>

        {/* Active Users */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Đang hoạt động</p>
            <p className="text-2xl font-extrabold text-emerald-600 mt-1">
              {loading ? "..." : stats?.active_users ?? 0}
            </p>
            <span className="text-[11px] text-slate-400 mt-1 block">Trạng thái ACTIVE</span>
          </div>
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <UserCheck className="w-6 h-6" />
          </div>
        </div>

        {/* Categories */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Danh mục môn học</p>
            <p className="text-2xl font-extrabold text-indigo-600 mt-1">
              {loading ? "..." : stats?.total_categories ?? 0}
            </p>
            <span className="text-[11px] text-slate-400 mt-1 block">Môn học hiện có</span>
          </div>
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
            <FolderTree className="w-6 h-6" />
          </div>
        </div>

        {/* Admin Accounts */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Quản trị viên</p>
            <p className="text-2xl font-extrabold text-amber-600 mt-1">
              {loading ? "..." : stats?.admin_users ?? 0}
            </p>
            <span className="text-[11px] text-slate-400 mt-1 block">Tài khoản Admin</span>
          </div>
          <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
            <ShieldCheck className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Quick Actions & System Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-xs lg:col-span-1 space-y-4">
          <h2 className="text-base font-bold text-slate-800 flex items-center space-x-2">
            <span>Thao tác quản trị</span>
          </h2>
          <div className="space-y-2.5">
            <Link
              to="/admin/categories"
              className="flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:border-blue-300 hover:bg-blue-50/50 transition group"
            >
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 text-blue-600 rounded-lg group-hover:scale-105 transition">
                  <PlusCircle className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-800">Quản lý môn học</p>
                  <p className="text-xs text-slate-500">Thêm, sửa, xóa danh mục môn</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition" />
            </Link>

            <Link
              to="/admin/users"
              className="flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/50 transition group"
            >
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg group-hover:scale-105 transition">
                  <Users className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-800">Quản lý người dùng</p>
                  <p className="text-xs text-slate-500">Khóa tài khoản hoặc đổi vai trò</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-1 transition" />
            </Link>

            <Link
              to="/admin/moderation"
              className="flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:border-amber-300 hover:bg-amber-50/50 transition group"
            >
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-amber-100 text-amber-600 rounded-lg group-hover:scale-105 transition">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-800">Kiểm duyệt học liệu</p>
                  <p className="text-xs text-slate-500">Duyệt bài đăng của sinh viên</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-amber-600 group-hover:translate-x-1 transition" />
            </Link>
          </div>
        </div>

        {/* System Overview */}
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-xs lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-800 flex items-center space-x-2">
              <Server className="w-4 h-4 text-blue-600" />
              <span>Trạng thái dịch vụ & Hệ thống</span>
            </h2>
            <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center space-x-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              <span>Đang hoạt động ổn định</span>
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1.5">
              <div className="flex items-center space-x-2 text-xs font-bold text-slate-700">
                <Database className="w-4 h-4 text-blue-600" />
                <span>Cơ sở dữ liệu PostgreSQL</span>
              </div>
              <p className="text-xs text-slate-500">
                Kết nối máy chủ cơ sở dữ liệu hoạt động bình thường, dữ liệu người dùng và danh mục được đồng bộ tức thì.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1.5">
              <div className="flex items-center space-x-2 text-xs font-bold text-slate-700">
                <FileText className="w-4 h-4 text-indigo-600" />
                <span>Kho lưu trữ tài liệu học tập</span>
              </div>
              <p className="text-xs text-slate-500">
                Thư mục lưu trữ tài liệu tải lên được cấu trúc theo thời gian (năm/tháng), hỗ trợ các tệp .pdf, .docx, .txt.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1.5 sm:col-span-2">
              <div className="flex items-center space-x-2 text-xs font-bold text-slate-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Quy chuẩn vận hành quản trị</span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Tài liệu do sinh viên tải lên sẽ ở trạng thái chờ duyệt. Quản trị viên sử dụng menu <strong>Kiểm duyệt học liệu</strong> để kiểm tra nội dung và phê duyệt tài liệu trước khi xuất bản ra trang chủ.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
