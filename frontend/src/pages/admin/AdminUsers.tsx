import React, { useEffect, useState } from "react";
import { adminService, UserFilterParams } from "../../services/adminService";
import { User } from "../../types/auth";
import { useAuth } from "../../contexts/AuthContext";
import { getAssetUrl } from "../../services/api";
import {
  Users,
  Search,
  Shield,
  ShieldCheck,
  UserCheck,
  Lock,
  Unlock,
  AlertTriangle,
  CheckCircle,
  Filter,
} from "lucide-react";

export const AdminUsers: React.FC = () => {
  const { user: currentAdmin } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("");

  // Confirmation Modals
  const [statusModal, setStatusModal] = useState<{ user: User; newStatus: "ACTIVE" | "BANNED" } | null>(null);
  const [roleModal, setRoleModal] = useState<{ user: User; newRole: "USER" | "ADMIN" } | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const params: UserFilterParams = {};
      if (searchQuery.trim()) params.q = searchQuery.trim();
      if (roleFilter) params.role = roleFilter;
      if (statusFilter) params.status = statusFilter;

      const data = await adminService.getUsers(params);
      setUsers(data);
    } catch (err: any) {
      showNotice("error", err.response?.data?.detail || "Không thể tải danh sách thành viên");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [roleFilter, statusFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchUsers();
  };

  const showNotice = (type: "success" | "error", message: string) => {
    setNotification({ type, message });
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  // Confirm Status change
  const handleConfirmStatus = async () => {
    if (!statusModal) return;
    try {
      setActionLoading(true);
      await adminService.updateUserStatus(statusModal.user.id, statusModal.newStatus);
      showNotice(
        "success",
        `Đã ${statusModal.newStatus === "BANNED" ? "khóa" : "mở khóa"} tài khoản '${statusModal.user.full_name}' thành công!`
      );
      setStatusModal(null);
      fetchUsers();
    } catch (err: any) {
      showNotice("error", err.response?.data?.detail || "Lỗi khi cập nhật trạng thái tài khoản");
    } finally {
      setActionLoading(false);
    }
  };

  // Confirm Role change
  const handleConfirmRole = async () => {
    if (!roleModal) return;
    try {
      setActionLoading(true);
      await adminService.updateUserRole(roleModal.user.id, roleModal.newRole);
      showNotice(
        "success",
        `Đã cập nhật vai trò của '${roleModal.user.full_name}' thành ${roleModal.newRole === "ADMIN" ? "Quản trị viên" : "Thành viên"
        }!`
      );
      setRoleModal(null);
      fetchUsers();
    } catch (err: any) {
      showNotice("error", err.response?.data?.detail || "Lỗi khi thay đổi vai trò tài khoản");
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Notification Toast */}
      {notification && (
        <div
          className={`p-4 rounded-xl flex items-center space-x-3 text-sm font-medium border shadow-xs animate-in fade-in duration-200 ${notification.type === "success"
              ? "bg-emerald-50 text-emerald-800 border-emerald-200"
              : "bg-red-50 text-red-800 border-red-200"
            }`}
        >
          {notification.type === "success" ? (
            <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
          ) : (
            <AlertTriangle className="w-5 h-5 text-red-600 shrink-0" />
          )}
          <span>{notification.message}</span>
        </div>
      )}

      {/* Header Bar */}
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-800 flex items-center space-x-2.5">
          <Users className="w-6 h-6 text-blue-600" />
          <span>Quản Lý Tài Khoản Người Dùng</span>
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Giám sát danh sách thành viên, cấp quyền Quản trị viên hoặc khóa các tài khoản vi phạm chính sách học thuật.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-md flex items-center space-x-2">
          <div className="relative w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Tìm theo họ tên hoặc email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold rounded-lg transition"
          >
            Tìm
          </button>
        </form>

        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1.5 text-xs text-slate-500">
            <Filter className="w-3.5 h-3.5" />
            <span>Lọc:</span>
          </div>

          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Tất cả vai trò</option>
            <option value="USER">Thành viên (USER)</option>
            <option value="ADMIN">Quản trị viên (ADMIN)</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Tất cả trạng thái</option>
            <option value="ACTIVE">Hoạt động (ACTIVE)</option>
            <option value="BANNED">Đã khóa (BANNED)</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-3 text-sm text-slate-500">Đang tải danh sách người dùng...</p>
          </div>
        ) : users.length === 0 ? (
          <div className="p-12 text-center">
            <Users className="w-12 h-12 text-slate-300 mx-auto" />
            <p className="mt-3 text-base font-semibold text-slate-700">Không tìm thấy người dùng phù hợp</p>
            <p className="text-xs text-slate-500 mt-1">Vui lòng thử tìm kiếm với từ khóa khác.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 border-b border-slate-200 text-xs uppercase font-bold text-slate-500 tracking-wider">
                <tr>
                  <th className="px-5 py-3.5">Thành viên</th>
                  <th className="px-5 py-3.5">Email</th>
                  <th className="px-5 py-3.5">Vai trò</th>
                  <th className="px-5 py-3.5">Trạng thái</th>
                  <th className="px-5 py-3.5">Ngày tham gia</th>
                  <th className="px-5 py-3.5 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.map((u) => {
                  const isCurrentAdmin = currentAdmin?.id === u.id;
                  return (
                    <tr key={u.id} className="hover:bg-slate-50/70 transition">
                      <td className="px-5 py-4">
                        <div className="flex items-center space-x-3">
                          {u.avatar_url ? (
                            <img
                              src={getAssetUrl(u.avatar_url)}
                              alt={u.full_name}
                              className="w-9 h-9 rounded-full object-cover border border-slate-200"
                            />
                          ) : (
                            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                              {u.full_name ? u.full_name.charAt(0).toUpperCase() : "U"}
                            </div>
                          )}
                          <div>
                            <p className="font-semibold text-slate-800 leading-tight flex items-center space-x-1.5">
                              <span>{u.full_name}</span>
                              {isCurrentAdmin && (
                                <span className="text-[10px] font-bold bg-blue-100 text-blue-700 px-1.5 py-0.2 rounded">
                                  Bạn
                                </span>
                              )}
                            </p>
                            <span className="text-xs text-slate-400 font-mono">ID: {u.id.slice(0, 8)}...</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-xs font-mono text-slate-700">{u.email}</td>
                      <td className="px-5 py-4">
                        {u.role === "ADMIN" ? (
                          <span className="inline-flex items-center space-x-1 text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                            <Shield className="w-3 h-3 text-amber-600" />
                            <span>Quản trị viên</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center space-x-1 text-xs font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full">
                            <UserCheck className="w-3 h-3 text-slate-500" />
                            <span>Thành viên</span>
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-4">
                        {u.status === "ACTIVE" ? (
                          <span className="inline-flex items-center space-x-1 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                            <span>Hoạt động</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center space-x-1 text-xs font-semibold text-red-700 bg-red-50 px-2.5 py-0.5 rounded-full border border-red-200">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                            <span>Đã khóa</span>
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-4 text-xs text-slate-500">
                        {new Date(u.created_at).toLocaleDateString("vi-VN")}
                      </td>
                      <td className="px-5 py-4 text-right space-x-1.5 whitespace-nowrap">
                        {/* Change Role Button */}
                        <button
                          onClick={() =>
                            setRoleModal({
                              user: u,
                              newRole: u.role === "ADMIN" ? "USER" : "ADMIN",
                            })
                          }
                          disabled={isCurrentAdmin}
                          className="px-2.5 py-1 text-xs font-semibold rounded-lg border border-slate-200 hover:border-blue-400 hover:bg-blue-50 text-slate-700 hover:text-blue-600 transition disabled:opacity-40 disabled:hover:border-slate-200 disabled:hover:bg-transparent disabled:hover:text-slate-700"
                          title={
                            isCurrentAdmin
                              ? "Bạn không thể tự đổi vai trò của chính mình"
                              : u.role === "ADMIN"
                                ? "Hạ cấp về Thành viên thường"
                                : "Thăng cấp lên Quản trị viên"
                          }
                        >
                          {u.role === "ADMIN" ? "Gỡ Admin" : "Lên Admin"}
                        </button>

                        {/* Toggle Status Button */}
                        {u.status === "ACTIVE" ? (
                          <button
                            onClick={() => setStatusModal({ user: u, newStatus: "BANNED" })}
                            disabled={isCurrentAdmin}
                            className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition disabled:opacity-40 disabled:hover:text-slate-500 disabled:hover:bg-transparent"
                            title={
                              isCurrentAdmin
                                ? "Không thể tự khóa tài khoản của chính mình"
                                : "Khóa tài khoản người dùng này"
                            }
                          >
                            <Lock className="w-4 h-4" />
                          </button>
                        ) : (
                          <button
                            onClick={() => setStatusModal({ user: u, newStatus: "ACTIVE" })}
                            className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition"
                            title="Mở khóa tài khoản người dùng này"
                          >
                            <Unlock className="w-4 h-4" />
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* STATUS MODAL (Khóa / Mở khóa) */}
      {statusModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl space-y-4">
            <div className="flex items-center space-x-3 text-amber-600">
              <div className="p-3 bg-amber-100 rounded-xl">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-slate-800">
                  {statusModal.newStatus === "BANNED" ? "Khóa tài khoản người dùng" : "Mở khóa tài khoản"}
                </h3>
                <p className="text-xs text-slate-500">Thay đổi trạng thái truy cập hệ thống.</p>
              </div>
            </div>

            <p className="text-sm text-slate-600 leading-relaxed">
              Bạn có chắc chắn muốn {statusModal.newStatus === "BANNED" ? "khóa" : "mở khóa lại"} tài khoản{" "}
              <strong className="text-slate-900 font-semibold">{statusModal.user.full_name}</strong> (
              <span className="font-mono text-xs">{statusModal.user.email}</span>)?
              {statusModal.newStatus === "BANNED" && (
                <span className="block mt-2 text-xs text-red-600">
                  * Người dùng bị khóa sẽ không thể đăng nhập hoặc thực hiện bất kỳ thao tác nào trên hệ thống.
                </span>
              )}
            </p>

            <div className="flex items-center justify-end space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setStatusModal(null)}
                className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={handleConfirmStatus}
                disabled={actionLoading}
                className={`px-5 py-2 text-sm font-semibold text-white rounded-lg shadow-sm transition disabled:opacity-50 ${statusModal.newStatus === "BANNED"
                    ? "bg-red-600 hover:bg-red-700"
                    : "bg-emerald-600 hover:bg-emerald-700"
                  }`}
              >
                {actionLoading
                  ? "Đang xử lý..."
                  : statusModal.newStatus === "BANNED"
                    ? "Khóa tài khoản"
                    : "Mở khóa ngay"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ROLE MODAL (Đổi vai trò) */}
      {roleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl space-y-4">
            <div className="flex items-center space-x-3 text-blue-600">
              <div className="p-3 bg-blue-100 rounded-xl">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-slate-800">Thay đổi vai trò người dùng</h3>
                <p className="text-xs text-slate-500">Phân quyền quản trị hệ thống.</p>
              </div>
            </div>

            <p className="text-sm text-slate-600 leading-relaxed">
              Bạn đang chuyển vai trò của{" "}
              <strong className="text-slate-900 font-semibold">{roleModal.user.full_name}</strong> thành{" "}
              <strong className="text-blue-600 font-bold">
                {roleModal.newRole === "ADMIN" ? "Quản trị viên (ADMIN)" : "Thành viên (USER)"}
              </strong>
              .
            </p>

            <div className="flex items-center justify-end space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setRoleModal(null)}
                className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={handleConfirmRole}
                disabled={actionLoading}
                className="px-5 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition disabled:opacity-50"
              >
                {actionLoading ? "Đang xử lý..." : "Xác nhận đổi quyền"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

