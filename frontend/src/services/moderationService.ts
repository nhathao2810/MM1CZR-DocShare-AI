import { api } from "./api";
import { Document } from "../types/document";

export interface ModerationStats {
  total_documents: number;
  pending_count: number;
  approved_count: number;
  rejected_count: number;
}

export interface ModerationFilterParams {
  status?: string;
  category_id?: number;
  q?: string;
}

export const moderationService = {
  // Lấy thống kê số lượng tài liệu theo trạng thái kiểm duyệt
  getStats: async (): Promise<ModerationStats> => {
    const res = await api.get<ModerationStats>("/admin/moderation/stats");
    return res.data;
  },

  // Lấy danh sách tài liệu kiểm duyệt
  getDocuments: async (params?: ModerationFilterParams): Promise<Document[]> => {
    const res = await api.get<Document[]>("/admin/moderation/documents", { params });
    return res.data;
  },

  // Phê duyệt tài liệu
  approveDocument: async (documentId: string): Promise<Document> => {
    const res = await api.patch<Document>(`/admin/moderation/documents/${documentId}/approve`);
    return res.data;
  },

  // Từ chối tài liệu kèm lý do
  rejectDocument: async (documentId: string, reason: string): Promise<Document> => {
    const res = await api.patch<Document>(`/admin/moderation/documents/${documentId}/reject`, { reason });
    return res.data;
  },
};
