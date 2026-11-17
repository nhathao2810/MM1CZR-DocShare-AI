import { api } from "./api";
import { User } from "../types/auth";
import { AdminStats } from "../types/category";

export interface UserFilterParams {
  q?: string;
  role?: string;
  status?: string;
}

export const adminService = {
  // Lấy số liệu thống kê tổng quan
  getStats: async (): Promise<AdminStats> => {
    const res = await api.get<AdminStats>("/admin/stats");
    return res.data;
  },

  // Lấy danh sách người dùng có tìm kiếm & bộ lọc
  getUsers: async (params?: UserFilterParams): Promise<User[]> => {
    const res = await api.get<User[]>("/admin/users", { params });
    return res.data;
  },

  // Cập nhật trạng thái tài khoản (Khóa / Mở khóa)
  updateUserStatus: async (userId: string, status: "ACTIVE" | "BANNED"): Promise<User> => {
    const res = await api.patch<User>(`/admin/users/${userId}/status`, { status });
    return res.data;
  },

  // Thay đổi vai trò người dùng (USER <-> ADMIN)
  updateUserRole: async (userId: string, role: "USER" | "ADMIN"): Promise<User> => {
    const res = await api.patch<User>(`/admin/users/${userId}/role`, { role });
    return res.data;
  },
};

