import { api } from "./api";
import { Document, DocumentUploadPayload } from "../types/document";

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
};

