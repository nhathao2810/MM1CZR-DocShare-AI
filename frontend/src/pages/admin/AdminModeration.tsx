import React, { useEffect, useState } from "react";
import { moderationService, ModerationStats, ModerationFilterParams } from "../../services/moderationService";
import { categoryService } from "../../services/categoryService";
import { Document } from "../../types/document";
import { Category } from "../../types/category";
import { getAssetUrl } from "../../services/api";
import { AdminPagination } from "../../components/admin/AdminPagination";
import {
  FileCheck2,
  Clock,
  CheckCircle2,
  XCircle,
  Search,
  ExternalLink,
  Eye,
  Check,
  X,
  Filter,
  FileText,
  AlertCircle,
  RotateCcw,
} from "lucide-react";

export const AdminModeration: React.FC = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [stats, setStats] = useState<ModerationStats | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [activeTab, setActiveTab] = useState<string>("PENDING");
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | "">("");
  const [searchQuery, setSearchQuery] = useState("");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Modals & Actions
  const [previewDoc, setPreviewDoc] = useState<Document | null>(null);
  const [rejectModalDoc, setRejectModalDoc] = useState<Document | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const [notification, setNotification] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // Quick rejection templates
  const quickReasons = [
    "Tài liệu bị mờ, scan lệch hoặc lỗi hiển thị font chữ.",
    "Tài liệu không thuộc nội dung môn học đã chọn.",
    "Nội dung quá sơ sài, thiếu phần mở đầu hoặc không đầy đủ.",
    "Tài liệu chứa thông tin không phù hợp với quy định chia sẻ học liệu.",
  ];

  const fetchStats = async () => {
    try {
      const data = await moderationService.getStats();
      setStats(data);
    } catch {
      // Ignored
    }
  };

  const fetchCategories = async () => {
    try {
      const data = await categoryService.getCategories();
      setCategories(data);
    } catch {
      // Ignored
    }
  };

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const params: ModerationFilterParams = {
        status: activeTab,
      };
      if (selectedCategoryId !== "") {
        params.category_id = Number(selectedCategoryId);
      }
      if (searchQuery.trim()) {
        params.q = searchQuery.trim();
      }

      const data = await moderationService.getDocuments(params);
      setDocuments(data);
      setCurrentPage(1);
    } catch (err: any) {
      showNotice("error", err.response?.data?.detail || "Không thể tải danh sách tài liệu kiểm duyệt");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchDocuments();
  }, [activeTab, selectedCategoryId]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchDocuments();
  };

  const handleResetFilters = () => {
    setActiveTab("PENDING");
    setSelectedCategoryId("");
    setSearchQuery("");
  };

  const showNotice = (type: "success" | "error", message: string) => {
    setNotification({ type, message });
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  // 1-Click Approve
  const handleApprove = async (doc: Document) => {
    try {
      setActionLoading(true);
      await moderationService.approveDocument(doc.id);
      showNotice("success", `Đã phê duyệt tài liệu "${doc.title}" thành công!`);
      if (previewDoc && previewDoc.id === doc.id) {
        setPreviewDoc(null);
      }
      fetchDocuments();
      fetchStats();
    } catch (err: any) {
      showNotice("error", err.response?.data?.detail || "Lỗi khi phê duyệt tài liệu");
    } finally {
      setActionLoading(false);
    }
  };

  // Open Reject Modal
  const handleOpenReject = (doc: Document) => {
    setRejectModalDoc(doc);
    setRejectReason("");
  };

  // Submit Reject
  const handleSubmitReject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rejectModalDoc || !rejectReason.trim()) return;

    try {
      setActionLoading(true);
      await moderationService.rejectDocument(rejectModalDoc.id, rejectReason.trim());
      showNotice("success", `Đã từ chối tài liệu "${rejectModalDoc.title}"`);
      setRejectModalDoc(null);
      if (previewDoc && previewDoc.id === rejectModalDoc.id) {
        setPreviewDoc(null);
      }
      fetchDocuments();
      fetchStats();
    } catch (err: any) {
      showNotice("error", err.response?.data?.detail || "Lỗi khi từ chối tài liệu");
    } finally {
      setActionLoading(false);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const getFileBadgeColor = (type?: string) => {
    switch (type?.toLowerCase()) {
      case "pdf":
        return "bg-rose-50 text-rose-700 border-rose-200";
      case "docx":
        return "bg-blue-50 text-blue-700 border-blue-200";
      default:
        return "bg-slate-50 text-slate-700 border-slate-200";
    }
  };

  const tabs = [
    { key: "PENDING", label: "Chờ duyệt", count: stats?.pending_count },
    { key: "APPROVED", label: "Đã duyệt", count: stats?.approved_count },
    { key: "REJECTED", label: "Bị từ chối", count: stats?.rejected_count },
    { key: "ALL", label: "Tất cả học liệu", count: stats?.total_documents },
  ];

  // Paginated documents slice
  const paginatedDocuments = documents.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="space-y-5">
      {/* Toast Notification */}
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
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
          )}
          <span>{notification.message}</span>
        </div>
      )}

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-800 flex items-center space-x-2.5">
            <FileCheck2 className="w-6 h-6 text-blue-600" />
            <span>Kiểm Duyệt Học Liệu Sinh Viên</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Xem trước nội dung bóc tách, phê duyệt học liệu chuẩn hoặc gửi lý do từ chối về cho sinh viên.
          </p>
        </div>
        <div className="text-xs font-semibold px-3 py-1.5 bg-slate-100 text-slate-700 rounded-lg self-start sm:self-auto border border-slate-200">
          Tổng danh sách: <span className="font-bold text-blue-600">{documents.length}</span> tài liệu
        </div>
      </div>

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Pending */}
        <div className="p-4 rounded-2xl bg-white border border-amber-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Đang chờ duyệt</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline space-x-2 mt-2">
            <p className="text-2xl font-black text-amber-600">{stats?.pending_count ?? 0}</p>
            {(stats?.pending_count ?? 0) > 0 && (
              <span className="text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                Cần xử lý
              </span>
            )}
          </div>
        </div>

        {/* Approved */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Đã phê duyệt</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-emerald-600 mt-2">{stats?.approved_count ?? 0}</p>
        </div>

        {/* Rejected */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Bị từ chối</span>
            <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <XCircle className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-rose-600 mt-2">{stats?.rejected_count ?? 0}</p>
        </div>

        {/* Total Documents */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Tổng tài liệu tải lên</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-800 mt-2">{stats?.total_documents ?? 0}</p>
        </div>
      </div>

      {/* FILTER & SEARCH CARD (2-Tier Layout to prevent clipping) */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3.5">
        {/* Tier 1: Status Tab Buttons */}
        <div className="flex items-center space-x-1 sm:space-x-2 overflow-x-auto custom-scrollbar pb-1">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => {
                setActiveTab(tab.key);
                setCurrentPage(1);
              }}
              className={`px-3 sm:px-4 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-2 shrink-0 ${
                activeTab === tab.key
                  ? "bg-slate-900 text-white shadow-xs"
                  : "bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              <span>{tab.label}</span>
              {typeof tab.count === "number" && (
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    activeTab === tab.key
                      ? "bg-white/20 text-white"
                      : "bg-slate-200 text-slate-700"
                  }`}
                >
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Tier 2: Category Filter & Search Bar */}
        <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Category Filter */}
          <div className="flex items-center space-x-2">
            <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <select
              value={selectedCategoryId}
              onChange={(e) => {
                setSelectedCategoryId(e.target.value ? Number(e.target.value) : "");
                setCurrentPage(1);
              }}
              className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Tất cả môn học</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>

            {(selectedCategoryId !== "" || searchQuery) && (
              <button
                onClick={handleResetFilters}
                className="text-xs text-slate-400 hover:text-slate-600 flex items-center space-x-1 pl-1"
                title="Đặt lại bộ lọc"
              >
                <RotateCcw className="w-3 h-3" />
                <span className="hidden sm:inline">Xóa lọc</span>
              </button>
            )}
          </div>

          {/* Search Form */}
          <form onSubmit={handleSearchSubmit} className="flex items-center space-x-2">
            <div className="relative w-full sm:w-72">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Tìm tiêu đề, file, người đăng..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
              />
            </div>
            <button
              type="submit"
              className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold rounded-xl transition shrink-0"
            >
              Tìm
            </button>
          </form>
        </div>
      </div>

      {/* Moderation Queue Table Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-3 text-sm text-slate-500 font-medium">Đang tải danh sách kiểm duyệt...</p>
          </div>
        ) : documents.length === 0 ? (
          <div className="p-12 sm:p-16 text-center space-y-3">
            <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-2xl flex items-center justify-center mx-auto">
              <FileCheck2 className="w-8 h-8" />
            </div>
            <h3 className="text-base font-bold text-slate-800">Không có tài liệu nào trong hàng đợi</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              {activeTab === "PENDING"
                ? "Tất cả tài liệu đã được kiểm duyệt xong. Hiện không có bài đăng nào cần duyệt."
                : "Không tìm thấy tài liệu phù hợp với bộ lọc hiện tại."}
            </p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto custom-scrollbar">
              <table className="w-full min-w-[1100px] text-left text-sm text-slate-600">
                <thead className="bg-slate-50 border-b border-slate-200 text-xs uppercase font-bold text-slate-500 tracking-wider">
                  <tr>
                    <th className="px-4 py-3.5 text-center w-14">STT</th>
                    <th className="px-5 py-3.5 min-w-[280px]">Tài liệu học tập</th>
                    <th className="px-5 py-3.5 min-w-[190px]">Người đăng tải</th>
                    <th className="px-5 py-3.5 min-w-[150px]">Môn học</th>
                    <th className="px-5 py-3.5 min-w-[130px]">Dung lượng / Trang</th>
                    <th className="px-5 py-3.5 min-w-[120px]">Trạng thái</th>
                    <th className="px-5 py-3.5 text-right min-w-[220px]">Hành động kiểm duyệt</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {paginatedDocuments.map((doc, index) => {
                    const stt = (currentPage - 1) * pageSize + index + 1;
                    return (
                      <tr key={doc.id} className="hover:bg-slate-50/70 transition">
                        {/* STT */}
                        <td className="px-4 py-4 text-center font-bold text-xs text-slate-400">
                          {stt}
                        </td>

                        {/* Document title and original name */}
                        <td className="px-5 py-4 max-w-xs">
                          <div className="flex items-start space-x-3">
                            <div className={`p-2.5 rounded-xl border ${getFileBadgeColor(doc.file_type)} shrink-0 mt-0.5`}>
                              <FileText className="w-5 h-5" />
                            </div>
                            <div className="min-w-0">
                              <p className="font-bold text-slate-800 text-sm truncate" title={doc.title}>
                                {doc.title}
                              </p>
                              <p className="text-xs text-slate-400 font-mono truncate mt-0.5">{doc.file_name}</p>
                              {doc.rejection_reason && (
                                <p className="text-[11px] text-rose-600 font-medium mt-1 truncate" title={doc.rejection_reason}>
                                  Lý do từ chối: {doc.rejection_reason}
                                </p>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* Uploader */}
                        <td className="px-5 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-2.5">
                            {doc.uploader?.avatar_url ? (
                              <img
                                src={getAssetUrl(doc.uploader.avatar_url)}
                                alt={doc.uploader.full_name}
                                className="w-7 h-7 rounded-full object-cover border border-slate-200 shrink-0"
                              />
                            ) : (
                              <div className="w-7 h-7 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-xs shrink-0">
                                {doc.uploader?.full_name ? doc.uploader.full_name.charAt(0).toUpperCase() : "U"}
                              </div>
                            )}
                            <div className="min-w-0">
                              <p className="font-semibold text-slate-800 text-xs leading-tight truncate">
                                {doc.uploader?.full_name || "Thành viên"}
                              </p>
                              <p className="text-[11px] text-slate-400 font-mono truncate">{doc.uploader?.email}</p>
                            </div>
                          </div>
                        </td>

                        {/* Category */}
                        <td className="px-5 py-4 whitespace-nowrap">
                          <span className="inline-block px-2.5 py-1 bg-blue-50 text-blue-700 rounded-lg text-xs font-semibold border border-blue-100">
                            {doc.category?.name || "Chưa phân loại"}
                          </span>
                        </td>

                        {/* Size and pages */}
                        <td className="px-5 py-4 whitespace-nowrap text-xs text-slate-600">
                          <p className="font-semibold">{formatFileSize(doc.file_size)}</p>
                          <p className="text-slate-400 mt-0.5">{doc.page_count} trang</p>
                        </td>

                        {/* Status */}
                        <td className="px-5 py-4 whitespace-nowrap">
                          {doc.status === "PENDING" && (
                            <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 bg-amber-50 text-amber-700 border border-amber-200 rounded-full text-xs font-semibold">
                              <Clock className="w-3 h-3 text-amber-600" />
                              <span>Chờ duyệt</span>
                            </span>
                          )}
                          {doc.status === "APPROVED" && (
                            <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-xs font-semibold">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                              <span>Đã duyệt</span>
                            </span>
                          )}
                          {doc.status === "REJECTED" && (
                            <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 bg-rose-50 text-rose-700 border border-rose-200 rounded-full text-xs font-semibold">
                              <XCircle className="w-3 h-3 text-rose-600" />
                              <span>Bị từ chối</span>
                            </span>
                          )}
                        </td>

                        {/* Actions */}
                        <td className="px-5 py-4 text-right space-x-1 whitespace-nowrap">
                          {/* Preview Extracted Text */}
                          <button
                            onClick={() => setPreviewDoc(doc)}
                            className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition inline-flex items-center space-x-1"
                            title="Xem trước nội dung văn bản bóc tách"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Xem chữ</span>
                          </button>

                          {/* Open raw file in new tab */}
                          <a
                            href={getAssetUrl(doc.file_url)}
                            target="_blank"
                            rel="noreferrer"
                            className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg inline-flex items-center transition"
                            title="Mở file gốc"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>

                          {/* Approve button (if not already approved) */}
                          {doc.status !== "APPROVED" && (
                            <button
                              onClick={() => handleApprove(doc)}
                              disabled={actionLoading}
                              className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-xs transition inline-flex items-center space-x-1 disabled:opacity-50"
                              title="Phê duyệt tài liệu này"
                            >
                              <Check className="w-3.5 h-3.5" />
                              <span>Duyệt</span>
                            </button>
                          )}

                          {/* Reject button (if not already rejected) */}
                          {doc.status !== "REJECTED" && (
                            <button
                              onClick={() => handleOpenReject(doc)}
                              disabled={actionLoading}
                              className="px-2.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-lg text-xs font-semibold transition inline-flex items-center space-x-1 disabled:opacity-50"
                              title="Từ chối tài liệu này"
                            >
                              <X className="w-3.5 h-3.5" />
                              <span>Từ chối</span>
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            <AdminPagination
              currentPage={currentPage}
              totalItems={documents.length}
              pageSize={pageSize}
              onPageChange={setCurrentPage}
              onPageSizeChange={(newSize) => {
                setPageSize(newSize);
                setCurrentPage(1);
              }}
            />
          </>
        )}
      </div>

      {/* TEXT PREVIEW MODAL */}
      {previewDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
              <div className="flex items-center space-x-3 overflow-hidden pr-4">
                <div className={`p-2 rounded-xl border ${getFileBadgeColor(previewDoc.file_type)} shrink-0`}>
                  <FileText className="w-5 h-5" />
                </div>
                <div className="truncate">
                  <h3 className="font-bold text-slate-800 text-sm truncate" title={previewDoc.title}>
                    {previewDoc.title}
                  </h3>
                  <p className="text-xs text-slate-500 flex items-center space-x-2 mt-0.5">
                    <span>Môn: {previewDoc.category?.name}</span>
                    <span>•</span>
                    <span>{previewDoc.page_count} trang</span>
                    <span>•</span>
                    <span>{formatFileSize(previewDoc.file_size)}</span>
                  </p>
                </div>
              </div>

              <button
                onClick={() => setPreviewDoc(null)}
                className="text-slate-400 hover:text-slate-700 p-1.5 rounded-xl hover:bg-slate-200 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content: Raw Extracted Text */}
            <div className="p-6 overflow-y-auto flex-1 space-y-4">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-500 border-b border-slate-100 pb-2">
                <span className="flex items-center space-x-1.5 text-blue-600">
                  <FileText className="w-4 h-4" />
                  <span>Nội dung văn bản bóc tách tự động từ tệp</span>
                </span>
                <span>
                  {previewDoc.extracted_text
                    ? `${previewDoc.extracted_text.split(/\s+/).length} từ • ${previewDoc.extracted_text.length} ký tự`
                    : "0 từ"}
                </span>
              </div>

              {previewDoc.extracted_text && previewDoc.extracted_text.trim() ? (
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 font-sans text-xs sm:text-sm text-slate-700 whitespace-pre-wrap leading-relaxed max-h-96 overflow-y-auto select-text">
                  {previewDoc.extracted_text}
                </div>
              ) : (
                <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-300">
                  <AlertCircle className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                  <p className="text-xs font-semibold text-slate-600">
                    Không bóc tách được văn bản từ tệp này (có thể là tệp ảnh scan không có lớp chữ).
                  </p>
                </div>
              )}
            </div>

            {/* Modal Footer Controls */}
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
              <a
                href={getAssetUrl(previewDoc.file_url)}
                target="_blank"
                rel="noreferrer"
                className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center space-x-1"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Mở file gốc trên tab mới</span>
              </a>

              <div className="flex items-center space-x-2">
                {previewDoc.status !== "APPROVED" && (
                  <button
                    onClick={() => handleApprove(previewDoc)}
                    disabled={actionLoading}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-xs transition flex items-center space-x-1.5 disabled:opacity-50"
                  >
                    <Check className="w-4 h-4" />
                    <span>Phê duyệt ngay</span>
                  </button>
                )}

                {previewDoc.status !== "REJECTED" && (
                  <button
                    onClick={() => handleOpenReject(previewDoc)}
                    disabled={actionLoading}
                    className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-semibold transition flex items-center space-x-1.5 disabled:opacity-50"
                  >
                    <X className="w-4 h-4" />
                    <span>Từ chối</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* REJECT MODAL WITH REASON */}
      {rejectModalDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-base text-slate-800 flex items-center space-x-2 text-rose-600">
                <XCircle className="w-5 h-5" />
                <span>Từ chối phê duyệt tài liệu</span>
              </h3>
              <button
                onClick={() => setRejectModalDoc(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <p className="text-xs text-slate-500 font-medium">Tài liệu bị từ chối:</p>
              <p className="text-sm font-bold text-slate-800 mt-0.5 truncate">{rejectModalDoc.title}</p>
            </div>

            {/* Quick Reason Template Pills */}
            <div>
              <p className="text-xs font-semibold text-slate-600 mb-1.5">Gợi ý lý do nhanh:</p>
              <div className="flex flex-wrap gap-1.5">
                {quickReasons.map((template, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setRejectReason(template)}
                    className="px-2.5 py-1 text-[11px] bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition text-left"
                  >
                    {template}
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleSubmitReject} className="space-y-4 pt-1">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nhập lý do cụ thể <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Ghi rõ lý do để sinh viên nắm được và chỉnh sửa..."
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 focus:bg-white transition"
                ></textarea>
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setRejectModalDoc(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={actionLoading || !rejectReason.trim()}
                  className="px-5 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-xs transition disabled:opacity-50"
                >
                  {actionLoading ? "Đang xử lý..." : "Xác nhận từ chối"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
