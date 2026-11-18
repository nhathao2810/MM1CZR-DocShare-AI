import { api } from "./api";
import { Document, DocumentUploadPayload, MyDocStats } from "../types/document";

export interface MyDocFilterParams {
  status?: string;
  q?: string;
}

export const documentService = {
  // Đăng tải tài liệu mới kèm theo dõi tiến trình upload (%)
  uploadDocument: async (
    payload: DocumentUploadPayload,
    onProgress?: (percent: number) => void
  ): Promise<Document> => {
    const formData = new FormData();
    formData.append("title", payload.title);
    formData.append("category_id", payload.category_id.toString());
    if (payload.description) {
      formData.append("description", payload.description);
    }
    formData.append("file", payload.file);

    const res = await api.post<Document>("/documents/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress: (progressEvent) => {
        if (progressEvent.total && onProgress) {
          const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(percent);
        }
      },
    });
    return res.data;
  },

  // Lấy chi tiết tài liệu theo ID
  getDocument: async (documentId: string): Promise<Document> => {
    const res = await api.get<Document>(`/documents/${documentId}`);
    return res.data;
  },

  // Lấy danh sách tài liệu của chính sinh viên đang đăng nhập
  getMyDocuments: async (params?: MyDocFilterParams): Promise<Document[]> => {
    const res = await api.get<Document[]>("/documents/my-documents", { params });
    return res.data;
  },

  // Thống kê số lượng bài đăng cá nhân
  getMyStats: async (): Promise<MyDocStats> => {
    const res = await api.get<MyDocStats>("/documents/my-stats");
    return res.data;
  },

  // Xóa tài liệu của mình
  deleteDocument: async (documentId: string): Promise<{ message: string; id: string }> => {
    const res = await api.delete<{ message: string; id: string }>(`/documents/${documentId}`);
    return res.data;
  },
};
