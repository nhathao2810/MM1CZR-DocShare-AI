import { api } from "./api";
import { Category, CategoryCreatePayload, CategoryUpdatePayload } from "../types/category";

export const categoryService = {
  // Lấy danh sách danh mục (công khai)
  getCategories: async (): Promise<Category[]> => {
    const res = await api.get<Category[]>("/categories");
    return res.data;
  },

  // Lấy chi tiết danh mục
  getCategory: async (idOrSlug: string | number): Promise<Category> => {
    const res = await api.get<Category>(`/categories/${idOrSlug}`);
    return res.data;
  },

  // Thêm danh mục mới (Admin)
  createCategory: async (payload: CategoryCreatePayload): Promise<Category> => {
    const res = await api.post<Category>("/categories", payload);
    return res.data;
  },

  // Cập nhật danh mục (Admin)
  updateCategory: async (id: number, payload: CategoryUpdatePayload): Promise<Category> => {
    const res = await api.put<Category>(`/categories/${id}`, payload);
    return res.data;
  },

  // Xóa danh mục (Admin)
  deleteCategory: async (id: number): Promise<{ message: string; id: number }> => {
    const res = await api.delete<{ message: string; id: number }>(`/categories/${id}`);
    return res.data;
  },
};

