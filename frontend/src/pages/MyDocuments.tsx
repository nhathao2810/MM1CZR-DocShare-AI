import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { documentService, MyDocFilterParams } from "../services/documentService";
import { Document, MyDocStats } from "../types/document";
import { getAssetUrl } from "../services/api";
import {
  FileText,
  UploadCloud,
  Clock,
  CheckCircle2,
  XCircle,
  Search,
  Trash2,
  ExternalLink,
  AlertTriangle,
  FolderOpen,
  Info,
  X,
  Plus,
} from "lucide-react";

export const MyDocuments: React.FC = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [stats, setStats] = useState<MyDocStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  // Modals
  const [rejectionModal, setRejectionModal] = useState<{ title: string; reason?: string | null } | null>(null);
  const [deleteModal, setDeleteModal] = useState<Document | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [notification, setNotification] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const params: MyDocFilterParams = {};
      if (activeTab !== "ALL") {
        params.status = activeTab;
      }
      if (searchQuery.trim()) {
        params.q = searchQuery.trim();
      }

      const [docsData, statsData] = await Promise.all([
        documentService.getMyDocuments(params),
        documentService.getMyStats(),
      ]);

      setDocuments(docsData);
      setStats(statsData);
    } catch (err: any) {
      console.error("Lỗi khi tải tài liệu cá nhân:", err);
      showNotice("error", "Không thể tải danh sách tài liệu. Vui lòng thử lại!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchData();
  };

  const showNotice = (type: "success" | "error", message: string) => {
    setNotification({ type, message });
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteModal) return;
    try {
      setIsDeleting(true);
      await documentService.deleteDocument(deleteModal.id);
      showNotice("success", `Đã xóa tài liệu "${deleteModal.title}" thành công!`);
      setDeleteModal(null);
      fetchData();
    } catch (err: any) {
      showNotice("error", err.response?.data?.detail || "Không thể xóa tài liệu này.");
    } finally {
      setIsDeleting(false);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const getFileBadgeColor = (type: string) => {
    const ext = type.toLowerCase();
    if (ext === "pdf") return "bg-red-50 text-red-600 border-red-200";
    if (ext === "docx" || ext === "doc") return "bg-blue-50 text-blue-600 border-blue-200";
    return "bg-slate-50 text-slate-600 border-slate-200";
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Notification Toast */}
      {notification && (
        <div
          className={`p-4 rounded-xl flex items-center space-x-3 text-sm font-medium border shadow-xs animate-in fade-in duration-200 ${
            notification.type === "success"
              ? "bg-emerald-50 text-emerald-800 border-emerald-200"
              : "bg-red-50 text-red-800 border-red-200"
          }`}
        >
          {notification.type === "success" ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          ) : (
            <AlertTriangle className="w-5 h-5 text-red-600 shrink-0" />
          )}
          <span>{notification.message}</span>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-semibold mb-2 border border-blue-200">
            <FolderOpen className="w-3.5 h-3.5 text-blue-600" />
            <span>Khu vực cá nhân</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight">
            Tài Liệu Của Tôi
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Theo dõi tiến độ kiểm duyệt và quản lý các tài liệu học tập bạn đã đóng góp cho hệ thống.
          </p>
        </div>

        <Link
          to="/upload"
          className="inline-flex items-center space-x-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold shadow-sm transition active:scale-95 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Đăng tài liệu mới</span>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Tổng đã tải lên</p>
          <p className="text-2xl font-black text-slate-800 mt-1">{stats?.total_uploaded ?? 0}</p>
          <span className="text-[11px] text-slate-400 mt-0.5 block">Tài liệu học tập</span>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
          <p className="text-xs font-semibold text-amber-700 uppercase tracking-wider">Đang chờ duyệt</p>
          <p className="text-2xl font-black text-amber-600 mt-1">{stats?.pending_count ?? 0}</p>
          <span className="text-[11px] text-amber-600/70 mt-0.5 block">Ban quản trị đang xem</span>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
          <p className="text-xs font-semibold text-emerald-700 uppercase tracking-wider">Đã xuất bản</p>
          <p className="text-2xl font-black text-emerald-600 mt-1">{stats?.approved_count ?? 0}</p>
          <span className="text-[11px] text-emerald-600/70 mt-0.5 block">Công khai cho sinh viên</span>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
          <p className="text-xs font-semibold text-rose-700 uppercase tracking-wider">Bị từ chối</p>
          <p className="text-2xl font-black text-rose-600 mt-1">{stats?.rejected_count ?? 0}</p>
          <span className="text-[11px] text-rose-600/70 mt-0.5 block">Cần chỉnh sửa lại</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Tabs Filter */}
        <div className="flex flex-wrap items-center gap-1.5 border-b md:border-b-0 pb-3 md:pb-0 border-slate-100">
          {[
            { key: "ALL", label: "Tất cả" },
            { key: "PENDING", label: "Chờ duyệt", count: stats?.pending_count },
            { key: "APPROVED", label: "Đã xuất bản", count: stats?.approved_count },
            { key: "REJECTED", label: "Bị từ chối", count: stats?.rejected_count },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition flex items-center space-x-1.5 ${
                activeTab === tab.key
                  ? "bg-slate-900 text-white shadow-xs"
                  : "bg-slate-50 text-slate-600 hover:bg-slate-100"
              }`}
            >
              <span>{tab.label}</span>
              {typeof tab.count === "number" && tab.count > 0 && (
                <span
                  className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                    activeTab === tab.key ? "bg-white/20 text-white" : "bg-slate-200 text-slate-700"
                  }`}
                >
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <form onSubmit={handleSearchSubmit} className="flex items-center space-x-2 w-full md:w-80">
          <div className="relative w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Tìm theo tiêu đề tài liệu..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold rounded-xl transition shrink-0"
          >
            Tìm
          </button>
        </form>
      </div>

      {/* Document List */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-3 text-sm text-slate-500 font-medium">Đang tải danh sách bài đăng...</p>
          </div>
        ) : documents.length === 0 ? (
          <div className="p-12 sm:p-16 text-center space-y-4">
            <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto shadow-xs">
              <UploadCloud className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-800">Chưa có tài liệu nào</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                {activeTab === "ALL"
                  ? "Bạn chưa đăng tải tài liệu học tập nào lên hệ thống. Hãy bắt đầu chia sẻ ngay!"
                  : "Không có tài liệu nào thuộc trạng thái này."}
              </p>
            </div>
            <Link
              to="/upload"
              className="inline-flex items-center space-x-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-sm transition"
            >
              <Plus className="w-4 h-4" />
              <span>Đăng tải tài liệu đầu tiên</span>
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 border-b border-slate-200 text-xs uppercase font-bold text-slate-500 tracking-wider">
                <tr>
                  <th className="px-5 py-3.5">Tài liệu học tập</th>
                  <th className="px-5 py-3.5">Môn học</th>
                  <th className="px-5 py-3.5">Dung lượng & Trang</th>
                  <th className="px-5 py-3.5">Trạng thái duyệt</th>
                  <th className="px-5 py-3.5">Ngày đăng</th>
                  <th className="px-5 py-3.5 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {documents.map((doc) => (
                  <tr key={doc.id} className="hover:bg-slate-50/70 transition">
                    {/* Title & File info */}
                    <td className="px-5 py-4 max-w-sm">
                      <div className="flex items-start space-x-3">
                        <div className={`p-2.5 rounded-xl border ${getFileBadgeColor(doc.file_type)} shrink-0 mt-0.5`}>
                          <FileText className="w-5 h-5" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-slate-800 text-sm truncate" title={doc.title}>
                            {doc.title}
                          </p>
                          <p className="text-xs text-slate-400 font-mono truncate mt-0.5">{doc.file_name}</p>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="px-5 py-4">
                      <span className="inline-block px-2.5 py-1 bg-slate-100 text-slate-700 rounded-lg text-xs font-medium">
                        {doc.category?.name || "Danh mục chung"}
                      </span>
                    </td>

                    {/* Size & Page count */}
                    <td className="px-5 py-4 text-xs text-slate-600 whitespace-nowrap">
                      <p className="font-semibold">{formatFileSize(doc.file_size)}</p>
                      <p className="text-slate-400 mt-0.5">{doc.page_count} trang</p>
                    </td>

                    {/* Status Badge */}
                    <td className="px-5 py-4 whitespace-nowrap">
                      {doc.status === "PENDING" && (
                        <span className="inline-flex items-center space-x-1.5 px-3 py-1 bg-amber-50 text-amber-700 border border-amber-200 rounded-full text-xs font-semibold">
                          <Clock className="w-3.5 h-3.5 text-amber-600" />
                          <span>Chờ duyệt</span>
                        </span>
                      )}
                      {doc.status === "APPROVED" && (
                        <span className="inline-flex items-center space-x-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-xs font-semibold">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Đã xuất bản</span>
                        </span>
                      )}
                      {doc.status === "REJECTED" && (
                        <div className="flex items-center space-x-2">
                          <span className="inline-flex items-center space-x-1.5 px-3 py-1 bg-rose-50 text-rose-700 border border-rose-200 rounded-full text-xs font-semibold">
                            <XCircle className="w-3.5 h-3.5 text-rose-600" />
                            <span>Bị từ chối</span>
                          </span>
                          <button
                            onClick={() =>
                              setRejectionModal({
                                title: doc.title,
                                reason: doc.rejection_reason,
                              })
                            }
                            className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition"
                            title="Xem lý do từ chối"
                          >
                            <Info className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </td>

                    {/* Upload Date */}
                    <td className="px-5 py-4 text-xs text-slate-500 whitespace-nowrap">
                      {new Date(doc.created_at).toLocaleDateString("vi-VN")}
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-4 text-right space-x-1.5 whitespace-nowrap">
                      <a
                        href={getAssetUrl(doc.file_url)}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg inline-flex items-center transition"
                        title="Mở xem tài liệu"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>

                      <button
                        onClick={() => setDeleteModal(doc)}
                        className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                        title="Xóa tài liệu này"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* REJECTION REASON MODAL */}
      {rejectionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-base text-slate-800 flex items-center space-x-2 text-rose-600">
                <XCircle className="w-5 h-5" />
                <span>Lý do từ chối bài đăng</span>
              </h3>
              <button
                onClick={() => setRejectionModal(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <p className="text-xs text-slate-500 font-medium">Tài liệu:</p>
              <p className="text-sm font-bold text-slate-800 mt-0.5">{rejectionModal.title}</p>
            </div>

            <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-900 leading-relaxed">
              <p className="font-semibold mb-1">Ghi chú từ Quản trị viên:</p>
              <p>{rejectionModal.reason || "Tài liệu chưa đáp ứng tiêu chuẩn học thuật hoặc định dạng chưa phù hợp."}</p>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setRejectionModal(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl space-y-4">
            <div className="flex items-center space-x-3 text-red-600">
              <div className="p-3 bg-red-100 rounded-xl">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-slate-800">Xác nhận xóa tài liệu</h3>
                <p className="text-xs text-slate-500">Tài liệu và tệp lưu trữ sẽ bị xóa vĩnh viễn.</p>
              </div>
            </div>

            <p className="text-sm text-slate-600">
              Bạn có chắc chắn muốn xóa bài đăng{" "}
              <strong className="text-slate-900 font-semibold">"{deleteModal.title}"</strong>? Hành động này không thể hoàn tác.
            </p>

            <div className="flex items-center justify-end space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setDeleteModal(null)}
                className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition"
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                onClick={handleDeleteConfirm}
                disabled={isDeleting}
                className="px-5 py-2 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 rounded-xl shadow-sm transition disabled:opacity-50"
              >
                {isDeleting ? "Đang xóa..." : "Xóa bài đăng"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

