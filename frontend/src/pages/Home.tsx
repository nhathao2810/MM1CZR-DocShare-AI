import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { categoryService } from "../services/categoryService";
import { Category } from "../types/category";
import {
  Search,
  BookOpen,
  Database,
  Code,
  Cpu,
  ArrowRight,
  BrainCircuit,
  Eye,
  DownloadCloud,
  Star,
  ShieldCheck,
  CheckCircle2,
  FileText,
  BookmarkCheck,
  GraduationCap,
  Layers,
  Sparkles,
} from "lucide-react";

export const Home: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchCats = async () => {
      try {
        const data = await categoryService.getCategories();
        setCategories(data);
      } catch (err) {
        console.error("Lỗi khi tải danh mục môn học:", err);
      } finally {
        setLoadingCategories(false);
      }
    };
    fetchCats();
  }, []);

  // Icon ánh xạ tương ứng theo danh mục môn học
  const getCategoryIcon = (slug: string) => {
    if (slug.includes("web") || slug.includes("lap-trinh")) return Code;
    if (slug.includes("du-lieu") || slug.includes("sql")) return Database;
    if (slug.includes("tri-tue") || slug.includes("ai") || slug.includes("may")) return Cpu;
    if (slug.includes("mang") || slug.includes("an-toan")) return ShieldCheck;
    if (slug.includes("toan")) return Layers;
    return BookOpen;
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* =========================================================================
          1. HERO SECTION & 2-COLUMN HERO BANNER VỚI ẢNH MINH HỌA & FLOATING BADGES
      ========================================================================= */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-100/70 via-indigo-50/40 to-slate-50 py-16 sm:py-24 px-4 sm:px-6 lg:px-8 border-b border-slate-200">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-100/60 via-indigo-50/40 to-blue-100/60 pointer-events-none"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(59,130,246,0.2),rgba(255,255,255,0))] pointer-events-none"></div>

        <div className="relative max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* CỘT TRÁI: Tiêu đề, Slogan, Ô tìm kiếm */}
            <div className="lg:col-span-7 text-center lg:text-left space-y-6">
              <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-blue-100 border border-blue-200 text-blue-800 text-xs font-semibold shadow-xs">
                <BookOpen className="w-4 h-4 text-blue-600" />
                <span>Nền tảng chia sẻ và tra cứu học liệu số</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.15]">
                Khám phá & Chia sẻ <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700">
                  Tài liệu Học thuật Số
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                Tìm kiếm tài liệu học tập thông minh bằng câu hỏi tự nhiên tiếng Việt, tóm tắt nhanh nội dung chính và đọc giáo trình, bài giảng trực tuyến dễ dàng.
              </p>

              {/* Ô TÌM KIẾM */}
              <div className="max-w-xl mx-auto lg:mx-0 pt-2">
                <div className="relative flex items-center shadow-md rounded-2xl bg-white border border-slate-300 p-1.5 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent transition">
                  <Search className="w-5 h-5 text-slate-400 ml-3.5 shrink-0" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Nhập câu hỏi hoặc môn học cần tra cứu..."
                    className="w-full pl-3 pr-4 py-3 bg-transparent text-sm sm:text-base text-slate-800 focus:outline-none placeholder-slate-400"
                  />
                  <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold text-sm rounded-xl transition shadow-sm flex items-center space-x-1.5 shrink-0">
                    <span>Tìm kiếm</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                {/* Danh sách môn học gợi ý động */}
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 mt-4 text-xs text-slate-500">
                  <span className="font-semibold text-slate-400">Môn học gợi ý:</span>
                  {categories.slice(0, 5).map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setSearchQuery(cat.name)}
                      className="px-2.5 py-1 rounded-lg bg-white/90 hover:bg-blue-50 hover:text-blue-600 text-slate-600 border border-slate-200 transition shadow-2xs"
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Lời chào mừng nếu đã đăng nhập */}
              {isAuthenticated && user && (
                <div className="p-4 rounded-2xl bg-white/90 border border-blue-200 shadow-sm max-w-xl mx-auto lg:mx-0 flex items-center justify-between text-left backdrop-blur-xs">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold text-base shadow-xs">
                      {user.full_name ? user.full_name.charAt(0).toUpperCase() : "U"}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-800 leading-tight">
                        Chào mừng trở lại, <span className="text-blue-600">{user.full_name}</span>!
                      </p>
                      <p className="text-xs text-slate-500">Tiếp tục hành trình học tập và nghiên cứu của bạn</p>
                    </div>
                  </div>
                  <Link
                    to="/profile"
                    className="text-xs font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition"
                  >
                    Xem hồ sơ
                  </Link>
                </div>
              )}
            </div>

            {/* CỘT PHẢI: BANNER ẢNH MINH HỌA HỌC THUẬT & FLOATING CARDS */}
            <div className="lg:col-span-5 relative flex items-center justify-center">
              <div className="relative w-full max-w-md lg:max-w-none">
                <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white/80 bg-slate-900 group">
                  <img
                    src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1000&q=80"
                    alt="Sinh viên nghiên cứu tài liệu học tập"
                    className="w-full h-80 sm:h-96 object-cover opacity-90 group-hover:scale-105 transition duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-900/20 to-transparent"></div>

                  <div className="absolute bottom-5 left-5 right-5 text-white">
                    <div className="flex items-center space-x-2 text-xs font-semibold text-blue-300 mb-1">
                      <GraduationCap className="w-4 h-4" />
                      <span>Không gian học tập số thông minh</span>
                    </div>
                    <p className="text-sm font-bold text-white leading-snug">
                      Kết nối sinh viên, giáo trình & tri thức học thuật đại học
                    </p>
                  </div>
                </div>

                {/* Floating Card 1: Tóm tắt nội dung */}
                <div className="absolute -top-5 -left-5 bg-white/95 backdrop-blur-md p-3.5 rounded-2xl shadow-xl border border-blue-100 flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-xs">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div className="text-left pr-2">
                    <p className="text-xs font-bold text-slate-800">Tóm tắt học thuật</p>
                    <p className="text-[11px] text-emerald-600 font-semibold">Nhanh chóng & cô đọng</p>
                  </div>
                </div>

                {/* Floating Card 2: Tra cứu thông minh */}
                <div className="absolute -bottom-5 -right-5 bg-white/95 backdrop-blur-md p-3.5 rounded-2xl shadow-xl border border-indigo-100 flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-600 text-white flex items-center justify-center shadow-xs">
                    <BrainCircuit className="w-5 h-5" />
                  </div>
                  <div className="text-left pr-2">
                    <p className="text-xs font-bold text-slate-800">Tra cứu thông minh</p>
                    <p className="text-[11px] text-blue-600 font-semibold">Theo ngữ nghĩa câu hỏi</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          2. CHỈ SỐ THỐNG KÊ HOẠT ĐỘNG
      ========================================================================= */}
      <section className="bg-white border-b border-slate-200 py-8 px-4 sm:px-6 lg:px-8 shadow-xs">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="p-3 border-r border-slate-100 last:border-none">
            <p className="text-3xl sm:text-4xl font-black text-blue-600">3,500+</p>
            <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">Giáo trình & Đề cương</p>
          </div>
          <div className="p-3 border-r border-slate-100 last:border-none">
            <p className="text-3xl sm:text-4xl font-black text-indigo-600">10,000+</p>
            <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">Sinh viên tham gia</p>
          </div>
          <div className="p-3 border-r border-slate-100 last:border-none">
            <p className="text-3xl sm:text-4xl font-black text-emerald-600">45,000+</p>
            <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">Lượt tra cứu học tập</p>
          </div>
          <div className="p-3">
            <p className="text-3xl sm:text-4xl font-black text-amber-500">100%</p>
            <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">Kiểm duyệt chất lượng</p>
          </div>
        </div>
      </section>

      {/* =========================================================================
          3. TRẢI NGHIỆM ĐỌC TRỰC TUYẾN
      ========================================================================= */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-8 sm:p-12 text-white shadow-xl relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            <div className="lg:col-span-7 space-y-4">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-400 border border-blue-500/30">
                <FileText className="w-3.5 h-3.5 mr-1.5" /> Trình đọc tài liệu trực tuyến
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-white leading-tight">
                Đọc thử trực tuyến tiện lợi & <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-300">
                  Nắm bắt kiến thức cốt lõi nhanh chóng
                </span>
              </h2>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-xl">
                Hỗ trợ xem trước tài liệu trực tiếp trên trình duyệt, không cần tải về máy tính. Giúp sinh viên tiết kiệm thời gian và dễ dàng lựa chọn tài liệu phù hợp nhất cho môn học.
              </p>
              <div className="pt-2 flex flex-wrap gap-4 text-xs font-medium text-slate-300">
                <span className="flex items-center space-x-1.5 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Điều hướng phân trang mượt mà</span>
                </span>
                <span className="flex items-center space-x-1.5 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Thu phóng và tìm kiếm nội dung</span>
                </span>
                <span className="flex items-center space-x-1.5 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Hỗ trợ tệp PDF, Word, Văn bản</span>
                </span>
              </div>
            </div>

            {/* Preview mockup */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="bg-slate-800/90 rounded-2xl p-5 border border-slate-700 shadow-2xl w-full max-w-sm">
                <div className="flex items-center space-x-2 border-b border-slate-700 pb-3 mb-3">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                  <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                  <span className="text-xs text-slate-400 ml-2 font-mono">giao-trinh-hoc-tap.pdf</span>
                </div>
                <div className="space-y-2.5">
                  <div className="h-4 bg-slate-700 rounded w-3/4 animate-pulse"></div>
                  <div className="h-3 bg-slate-700/60 rounded w-full"></div>
                  <div className="h-3 bg-slate-700/60 rounded w-5/6"></div>
                  <div className="p-3 bg-blue-950/60 rounded-xl border border-blue-800/40 text-blue-200 text-xs mt-3">
                    <p className="font-bold flex items-center space-x-1 text-blue-400 mb-1">
                      <BookmarkCheck className="w-3.5 h-3.5" />
                      <span>Tóm tắt nội dung chính:</span>
                    </p>
                    Tài liệu cung cấp kiến thức nền tảng và bài tập thực hành trọng tâm, giúp sinh viên ôn tập và chuẩn bị tốt cho các kỳ thi.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          4. DANH MỤC MÔN HỌC (HIỂN THỊ ĐỘNG TỪ CSDL)
      ========================================================================= */}
      <section className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <h2 className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-1">Phân loại học phần</h2>
            <p className="text-2xl sm:text-3xl font-extrabold text-slate-900">Danh mục môn học</p>
          </div>
          <Link
            to="/upload"
            className="inline-flex items-center space-x-1 text-sm font-semibold text-blue-600 hover:text-blue-700 transition"
          >
            <span>Đóng góp tài liệu môn học</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loadingCategories ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="bg-white p-6 rounded-2xl border border-slate-200 animate-pulse space-y-3">
                <div className="w-12 h-12 bg-slate-200 rounded-xl"></div>
                <div className="h-5 bg-slate-200 rounded w-2/3"></div>
                <div className="h-3 bg-slate-100 rounded w-full"></div>
              </div>
            ))}
          </div>
        ) : categories.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-slate-200">
            <BookOpen className="w-12 h-12 text-slate-300 mx-auto" />
            <p className="mt-2 text-sm text-slate-500 font-medium">Chưa có danh mục môn học nào.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((cat) => {
              const IconComponent = getCategoryIcon(cat.slug);
              return (
                <div
                  key={cat.id}
                  onClick={() => setSearchQuery(cat.name)}
                  className="bg-white p-6 rounded-2xl border border-slate-200 hover:border-blue-400 hover:shadow-md transition cursor-pointer group flex flex-col justify-between"
                >
                  <div>
                    <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition flex items-center justify-center mb-4 shadow-2xs">
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <h3 className="font-bold text-slate-900 text-base group-hover:text-blue-600 transition">
                      {cat.name}
                    </h3>
                    <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                      {cat.description || "Tài liệu bài giảng, đề thi và giáo trình tổng hợp."}
                    </p>
                  </div>

                  <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-blue-600">
                    <span>Xem tài liệu</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* =========================================================================
          5. BANNER KÊU GỌI ĐÓNG GÓP HỌC LIỆU (CTA)
      ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 w-full">
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 rounded-3xl p-8 sm:p-12 text-white text-center shadow-xl relative overflow-hidden">
          <div className="relative max-w-2xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-3">
              Bạn có tài liệu học tập bổ ích muốn chia sẻ?
            </h2>
            <p className="text-blue-100 text-sm sm:text-base mb-6 leading-relaxed">
              Cùng nhau xây dựng kho tài nguyên học thuật mở chất lượng cao. Mỗi tài liệu được đóng góp sẽ giúp đỡ các thế hệ sinh viên tiếp nối học tập hiệu quả hơn.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-3 sm:space-y-0 sm:space-x-4">
              <Link
                to="/upload"
                className="w-full sm:w-auto px-7 py-3 bg-white text-blue-600 font-bold text-sm rounded-xl hover:bg-blue-50 transition shadow-md"
              >
                Đăng tải tài liệu ngay
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
