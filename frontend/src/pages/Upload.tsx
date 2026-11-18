import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { categoryService } from "../services/categoryService";
import { documentService } from "../services/documentService";
import { Category } from "../types/category";
import { Document } from "../types/document";
import {
  UploadCloud,
  FileText,
  CheckCircle2,
  AlertCircle,
  X,
  BookOpen,
  Info,
  ShieldCheck,
} from "lucide-react";

export const Upload: React.FC = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form states
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [categoryId, setCategoryId] = useState<number | "">("");
  const [description, setDescription] = useState("");

  // UI / Status states
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [dragOver, setDragOver] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isUploading, setIsUploading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successDoc, setSuccessDoc] = useState<Document | null>(null);

  // Load danh mục môn học khi mở trang
  useEffect(() => {
    const fetchCats = async () => {
      try {
        const data = await categoryService.getCategories();
        setCategories(data);
        if (data.length > 0) {
          setCategoryId(data[0].id);
        }
      } catch (err) {
        console.error("Không thể tải danh mục:", err);
      } finally {
        setLoadingCategories(false);
      }
    };
    fetchCats();
  }, []);

  // Validate & chọn file
  const handleFileSelect = (selectedFile: File) => {
    setErrorMsg(null);
    const maxSizeBytes = 20 * 1024 * 1024;
    const allowedExts = ["pdf", "docx", "txt"];
    const ext = selectedFile.name.split(".").pop()?.toLowerCase() || "";

    if (!allowedExts.includes(ext)) {
      setErrorMsg("Chỉ hỗ trợ tệp định dạng .pdf, .docx, .txt!");
      return;
    }

    if (selectedFile.size > maxSizeBytes) {
      setErrorMsg("Dung lượng tệp vượt quá 20MB. Vui lòng chọn tệp nhỏ hơn!");
      return;
    }

    setFile(selectedFile);
    // Tự động gợi ý tiêu đề từ tên tệp (bỏ phần đuôi mở rộng)
    if (!title) {
      const suggestedTitle = selectedFile.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ");
      setTitle(suggestedTitle.charAt(0).toUpperCase() + suggestedTitle.slice(1));
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const getFileBadgeColor = (filename: string) => {
    const ext = filename.split(".").pop()?.toLowerCase();
    if (ext === "pdf") return "bg-red-50 text-red-600 border-red-200";
    if (ext === "docx") return "bg-blue-50 text-blue-600 border-blue-200";
    return "bg-slate-50 text-slate-600 border-slate-200";
  };

  // Submit form upload
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!file) {
      setErrorMsg("Vui lòng chọn một tệp tài liệu để đăng tải!");
      return;
    }
    if (!title.trim()) {
      setErrorMsg("Vui lòng nhập tiêu đề cho tài liệu!");
      return;
    }
    if (!categoryId) {
      setErrorMsg("Vui lòng chọn danh mục môn học tương ứng!");
      return;
    }

    try {
      setIsUploading(true);
      setUploadProgress(0);

      const createdDoc = await documentService.uploadDocument(
        {
          title: title.trim(),
          category_id: Number(categoryId),
          description: description.trim() || undefined,
          file,
        },
        (percent) => {
          setUploadProgress(percent);
        }
      );

      setSuccessDoc(createdDoc);
    } catch (err: any) {
      setErrorMsg(err.response?.data?.detail || "Đã xảy ra lỗi khi đăng tải tệp tin. Vui lòng thử lại!");
    } finally {
      setIsUploading(false);
    }
  };

  const handleResetForm = () => {
    setFile(null);
    setTitle("");
    setDescription("");
    setErrorMsg(null);
    setSuccessDoc(null);
    setUploadProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Page Heading */}
      <div className="mb-8 text-center sm:text-left">
        <div className="inline-flex items-center space-x-2 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-semibold mb-3 border border-blue-200">
          <BookOpen className="w-3.5 h-3.5 text-blue-600" />
          <span>Chia sẻ tài nguyên học tập</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight">
          Đăng Tải Tài Liệu Học Tập
        </h1>
        <p className="mt-2 text-sm text-slate-600 max-w-2xl">
          Chia sẻ giáo trình, bài giảng, đề thi và tài liệu học thuật cùng cộng đồng sinh viên.
        </p>
      </div>

      {/* Error Alert */}
      {errorMsg && (
        <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-sm flex items-start space-x-3 shadow-xs">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-semibold">Không thể đăng tải tài liệu</p>
            <p className="text-xs text-red-700 mt-0.5">{errorMsg}</p>
          </div>
          <button onClick={() => setErrorMsg(null)} className="text-red-400 hover:text-red-700">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* SUCCESS MODAL / OVERLAY */}
      {successDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl text-center space-y-5 animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto shadow-sm">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <div>
              <span className="inline-block px-3 py-1 bg-amber-50 text-amber-700 border border-amber-200 text-xs font-bold rounded-full mb-2">
                Trạng thái: Đang chờ kiểm duyệt
              </span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-800">
                Đăng Tải Tài Liệu Thành Công!
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                Tài liệu <strong>"{successDoc.title}"</strong> đã được tải lên thành công ({successDoc.page_count} trang). Tài liệu sẽ được kiểm duyệt và hiển thị trên hệ thống.
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-left text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-500">Tên tệp gốc:</span>
                <span className="font-medium text-slate-800 truncate max-w-[200px]">{successDoc.file_name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Dung lượng:</span>
                <span className="font-medium text-slate-800">{formatFileSize(successDoc.file_size)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Môn học:</span>
                <span className="font-medium text-blue-600">{successDoc.category?.name || "Danh mục chung"}</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={handleResetForm}
                className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold shadow-sm transition"
              >
                Tải lên tài liệu khác
              </button>
              <Link
                to="/my-documents"
                className="flex-1 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-semibold transition flex items-center justify-center"
              >
                Xem tài liệu của tôi
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Main Form Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Form Controls */}
        <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-6 bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs">
          {/* File Upload Dropzone */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Tệp tài liệu <span className="text-red-500">*</span>
            </label>

            {!file ? (
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
                  dragOver
                    ? "border-blue-500 bg-blue-50/70 scale-[0.99]"
                    : "border-slate-300 hover:border-blue-400 hover:bg-slate-50/60"
                }`}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={(e) => e.target.files && e.target.files[0] && handleFileSelect(e.target.files[0])}
                  accept=".pdf,.docx,.txt"
                  className="hidden"
                />
                <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-xs">
                  <UploadCloud className="w-7 h-7" />
                </div>
                <p className="text-sm font-semibold text-slate-800">
                  Kéo thả tệp vào đây hoặc <span className="text-blue-600 underline">chọn tệp từ máy tính</span>
                </p>
                <p className="text-xs text-slate-500 mt-1.5">
                  Định dạng hỗ trợ: <strong>.PDF, .DOCX, .TXT</strong> (Dung lượng tối đa: <strong>20MB</strong>)
                </p>
              </div>
            ) : (
              <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50 flex items-center justify-between shadow-xs">
                <div className="flex items-center space-x-3 overflow-hidden">
                  <div className={`p-2.5 rounded-xl border ${getFileBadgeColor(file.name)} shrink-0`}>
                    <FileText className="w-6 h-6" />
                  </div>
                  <div className="truncate">
                    <p className="text-sm font-bold text-slate-800 truncate">{file.name}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{formatFileSize(file.size)}</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setFile(null)}
                  className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition ml-3"
                  title="Gỡ bỏ tệp này"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>

          {/* Document Title */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Tiêu đề tài liệu <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="VD: Giáo trình Cấu trúc dữ liệu và Giải thuật..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              Đặt tiêu đề ngắn gọn, rõ ràng theo đúng nội dung tài liệu.
            </p>
          </div>

          {/* Category Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Danh mục môn học <span className="text-red-500">*</span>
            </label>
            {loadingCategories ? (
              <div className="text-xs text-slate-500 animate-pulse">Đang tải danh sách môn học...</div>
            ) : (
              <select
                required
                value={categoryId}
                onChange={(e) => setCategoryId(Number(e.target.value))}
                className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition text-slate-800 font-medium"
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Mô tả tóm tắt (Không bắt buộc)
            </label>
            <textarea
              rows={3}
              placeholder="Ghi chú thêm về nội dung, tác giả, tài liệu ôn tập hoặc lưu ý khi học..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
            ></textarea>
          </div>

          {/* Progress Bar when Uploading */}
          {isUploading && (
            <div className="space-y-2 pt-2">
              <div className="flex justify-between text-xs font-semibold text-slate-600">
                <span className="flex items-center space-x-1.5">
                  <span className="w-2 h-2 rounded-full bg-blue-600 animate-ping"></span>
                  <span>Đang tải tài liệu lên hệ thống...</span>
                </span>
                <span>{uploadProgress}%</span>
              </div>
              <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 transition-all duration-300 rounded-full"
                  style={{ width: `${Math.max(uploadProgress, 15)}%` }}
                ></div>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <div className="pt-3">
            <button
              type="submit"
              disabled={isUploading || !file || !title.trim()}
              className="w-full py-3.5 px-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-sm rounded-xl shadow-md shadow-blue-500/20 transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center space-x-2"
            >
              <UploadCloud className="w-5 h-5" />
              <span>{isUploading ? "Đang xử lý..." : "Đăng tải tài liệu"}</span>
            </button>
          </div>
        </form>

        {/* Right Column: Guidelines */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="font-bold text-slate-800 text-sm flex items-center space-x-2">
              <Info className="w-4 h-4 text-blue-600" />
              <span>Quy định đăng tải học liệu</span>
            </h3>
            <ul className="text-xs text-slate-600 space-y-3">
              <li className="flex items-start space-x-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-1.5 shrink-0"></span>
                <span>
                  <strong>Định dạng hợp lệ:</strong> Hỗ trợ tệp <code>.pdf</code>, <code>.docx</code>, <code>.txt</code> dung lượng tối đa <strong>20MB</strong>.
                </span>
              </li>
              <li className="flex items-start space-x-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-1.5 shrink-0"></span>
                <span>
                  <strong>Tiêu đề & Môn học:</strong> Đặt tên tệp rõ ràng, đúng môn học để sinh viên dễ dàng tra cứu.
                </span>
              </li>
              <li className="flex items-start space-x-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-1.5 shrink-0"></span>
                <span>
                  <strong>Kiểm duyệt nội dung:</strong> Tài liệu sau khi đăng sẽ được kiểm duyệt nhanh chóng trước khi hiển thị công khai trên hệ thống.
                </span>
              </li>
              <li className="flex items-start space-x-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-1.5 shrink-0"></span>
                <span>
                  <strong>Bản quyền & Văn hóa:</strong> Vui lòng chia sẻ tài liệu học tập văn minh, không tải lên tài liệu mật hoặc nội dung vi phạm pháp luật.
                </span>
              </li>
            </ul>
          </div>

          <div className="bg-blue-50/70 p-6 rounded-2xl border border-blue-100 text-xs text-blue-800 space-y-2">
            <div className="flex items-center space-x-2 font-bold text-blue-900">
              <ShieldCheck className="w-4 h-4 text-blue-600" />
              <span>Chất lượng tài nguyên</span>
            </div>
            <p className="leading-relaxed text-blue-700">
              Mỗi tài liệu được chia sẻ sẽ góp phần xây dựng kho tài nguyên học thuật phong phú và chất lượng cho sinh viên toàn trường.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
