import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import {
  Search,
  Sparkles,
  BookOpen,
  Database,
  Code,
  Cpu,
  ArrowRight,
  TrendingUp,
  BrainCircuit,
  Eye,
  DownloadCloud,
  Star,
  ShieldCheck,
  CheckCircle2,
  FileText,
  Zap,
  BookmarkCheck,
  GraduationCap
} from "lucide-react";

export const Home: React.FC = () => {
  const { user, isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* =========================================================================
          1. HERO SECTION & 2-COLUMN HERO BANNER VỚI ẢNH MINH HỌA & FLOATING BADGES
      ========================================================================= */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-100/70 via-indigo-50/40 to-slate-50 py-16 sm:py-24 px-4 sm:px-6 lg:px-8 border-b border-slate-200">
        {/* Lớp nền gradient mềm mại trải đều 100% toàn bộ chiều ngang màn hình (Full-width) */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-100/60 via-indigo-50/40 to-blue-100/60 pointer-events-none"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(59,130,246,0.2),rgba(255,255,255,0))] pointer-events-none"></div>
        <div className="relative max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* CỘT TRÁI: Tiêu đề, Slogan, Ô tìm kiếm & Thống kê */}
            <div className="lg:col-span-7 text-center lg:text-left space-y-6">
              <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-blue-100 border border-blue-200 text-blue-800 text-xs font-semibold shadow-sm">
                <Sparkles className="w-4 h-4 text-blue-600 animate-pulse" />
                <span>Nền tảng chia sẻ học liệu mở tích hợp Trí tuệ Nhân tạo</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.15]">
                Khám phá & Chia sẻ <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700">
                  Tài liệu Học thuật Số
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                Tìm kiếm tài liệu thông minh bằng câu hỏi tự nhiên tiếng Việt (Semantic Search), xem tóm tắt học thuật tự động bằng <strong>Google Gemini 1.5 Flash</strong> và đọc tài liệu trực tuyến an toàn.
              </p>

              {/* Ô TÌM KIẾM NGỮ NGHĨA */}
              <div className="max-w-xl mx-auto lg:mx-0 pt-2">
                <div className="relative flex items-center shadow-lg rounded-2xl bg-white border border-slate-300/80 p-1.5 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent transition">
                  <Search className="w-5 h-5 text-slate-400 ml-3.5 flex-shrink-0" />
                  <input
                    type="text"
                    placeholder="Nhập câu hỏi (VD: 'Kiến trúc mô hình Client-Server hoạt động ra sao?')..."
                    className="w-full pl-3 pr-4 py-3 bg-transparent text-sm sm:text-base text-slate-800 focus:outline-none placeholder-slate-400"
                  />
                  <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold text-sm rounded-xl transition shadow flex items-center space-x-1.5 flex-shrink-0">
                    <span>Tìm kiếm</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                {/* Từ khóa gợi ý */}
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 mt-4 text-xs text-slate-500">
                  <span className="font-semibold text-slate-400">Gợi ý:</span>
                  {[
                    "Lập trình ReactJS",
                    "Hệ quản trị PostgreSQL",
                    "Mô hình Generative AI",
                    "Cấu trúc dữ liệu",
                    "Toán cao cấp A1",
                  ].map((tag, idx) => (
                    <button
                      key={idx}
                      className="px-2.5 py-1 rounded-lg bg-white/90 hover:bg-blue-50 hover:text-blue-600 text-slate-600 border border-slate-200 transition shadow-2xs"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              {/* Lời chào mừng nếu đã đăng nhập */}
              {isAuthenticated && user && (
                <div className="p-4 rounded-2xl bg-white/90 border border-blue-200 shadow-sm max-w-xl mx-auto lg:mx-0 flex items-center justify-between text-left backdrop-blur-sm">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold text-base shadow-sm">
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
                {/* Khung ảnh chính với bo góc và viền sáng */}
                <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white/80 bg-slate-900 group">
                  <img
                    src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1000&q=80"
                    alt="Sinh viên nghiên cứu tài liệu học tập"
                    className="w-full h-80 sm:h-96 object-cover opacity-90 group-hover:scale-105 transition duration-700"
                  />
                  {/* Lớp phủ gradient mờ */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-900/20 to-transparent"></div>

                  {/* Chú thích trên ảnh */}
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

                {/* Floating Card 1: Gemini AI Summary (Góc trên bên trái) */}
                <div className="absolute -top-6 -left-6 bg-white/95 backdrop-blur-md p-3.5 rounded-2xl shadow-xl border border-blue-100 flex items-center space-x-3 animate-bounce [animation-duration:4s]">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-md">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div className="text-left pr-2">
                    <p className="text-xs font-bold text-slate-800">Tóm tắt Gemini AI</p>
                    <p className="text-[11px] text-emerald-600 font-semibold flex items-center space-x-1">
                      <Zap className="w-3 h-3 fill-emerald-500" />
                      <span>40 trang chỉ trong 3.2s</span>
                    </p>
                  </div>
                </div>

                {/* Floating Card 2: Semantic Vector Match (Góc dưới bên phải) */}
                <div className="absolute -bottom-6 -right-6 bg-white/95 backdrop-blur-md p-3.5 rounded-2xl shadow-xl border border-indigo-100 flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-600 text-white flex items-center justify-center shadow-md">
                    <BrainCircuit className="w-5 h-5" />
                  </div>
                  <div className="text-left pr-2">
                    <p className="text-xs font-bold text-slate-800">ChromaDB Vector</p>
                    <p className="text-[11px] text-blue-600 font-semibold">Độ tương đồng 98.6%</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          2. CHỈ SỐ THỐNG KÊ HOẠT ĐỘNG (STATS BAR)
      ========================================================================= */}
      <section className="bg-white border-b border-slate-200 py-8 px-4 sm:px-6 lg:px-8 shadow-xs">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="p-3 border-r border-slate-100 last:border-none">
            <p className="text-3xl sm:text-4xl font-black text-blue-600">3,500+</p>
            <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">Giáo trình & Đề cương</p>
          </div>
          <div className="p-3 border-r border-slate-100 last:border-none">
            <p className="text-3xl sm:text-4xl font-black text-indigo-600">10,000+</p>
            <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">Sinh viên Đại học</p>
          </div>
          <div className="p-3 border-r border-slate-100 last:border-none">
            <p className="text-3xl sm:text-4xl font-black text-emerald-600">45,000+</p>
            <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">Lượt đọc trực tuyến</p>
          </div>
          <div className="p-3">
            <p className="text-3xl sm:text-4xl font-black text-amber-500">100%</p>
            <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">Tự động hóa AI</p>
          </div>
        </div>
      </section>

      {/* =========================================================================
          3. BANNER TRẢI NGHIỆM ĐỌC TRỰC TUYẾN & TÓM TẮT AI (FEATURE BANNER ĐỒNG BỘ)
      ========================================================================= */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-8 sm:p-12 text-white shadow-xl relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            <div className="lg:col-span-7 space-y-4">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-400 border border-blue-500/30">
                <FileText className="w-3.5 h-3.5 mr-1.5" /> Trình đọc PDF.js trực tiếp trên trình duyệt
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-white leading-tight">
                Đọc thử trực tuyến an toàn & <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-300">
                  Nắm bắt kiến thức cốt lõi không cần tải về
                </span>
              </h2>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-xl">
                Tích hợp công nghệ hiển thị trang chuẩn PDF.js giúp sinh viên xem thử tài liệu ngay lập tức, tiết kiệm bộ nhớ máy tính. Kết hợp với bản tóm tắt tự động do Google Gemini khởi tạo.
              </p>
              <div className="pt-2 flex flex-wrap gap-4 text-xs font-medium text-slate-300">
                <span className="flex items-center space-x-1.5 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Điều hướng trang mượt mà</span>
                </span>
                <span className="flex items-center space-x-1.5 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Thu phóng và tìm trong trang</span>
                </span>
                <span className="flex items-center space-x-1.5 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Hỗ trợ PDF, Word, Txt</span>
                </span>
              </div>
            </div>

            {/* Mockup Preview minh họa */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="bg-slate-800/90 rounded-2xl p-4 border border-slate-700 shadow-2xl w-full max-w-sm">
                <div className="flex items-center space-x-2 border-b border-slate-700 pb-3 mb-3">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                  <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                  <span className="text-xs text-slate-400 ml-2 font-mono">giao-trinh-tri-tue-nhan-tao.pdf</span>
                </div>
                <div className="space-y-2.5">
                  <div className="h-4 bg-slate-700 rounded w-3/4 animate-pulse"></div>
                  <div className="h-3 bg-slate-700/60 rounded w-full"></div>
                  <div className="h-3 bg-slate-700/60 rounded w-5/6"></div>
                  <div className="p-3 bg-blue-950/60 rounded-xl border border-blue-800/40 text-blue-200 text-xs mt-3">
                    <p className="font-bold flex items-center space-x-1 text-blue-400 mb-1">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Executive Summary (AI Gemini):</span>
                    </p>
                    Tài liệu hệ thống hóa 5 phương pháp học máy có giám sát (Supervised Learning) và kỹ thuật nhúng vector cho cơ sở dữ liệu tri thức.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          4. TÍNH NĂNG NỔI BẬT CỦA HỆ THỐNG
      ========================================================================= */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-2">Ưu thế vượt trội</h2>
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Giải quyết triệt để rào cản tìm kiếm học liệu truyền thống
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-7 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-5">
              <BrainCircuit className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Tìm kiếm Ngữ nghĩa AI</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Loại bỏ cách tìm kiếm từ khóa cứng nhắc. Hệ thống nhúng câu hỏi thành vector đa chiều và so khớp ngữ nghĩa thông minh trong ChromaDB.
            </p>
          </div>

          <div className="bg-white p-7 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-5">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Tóm tắt Tự động bằng Gemini</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Mô hình Google Gemini 1.5 Flash tự động đọc hiểu và tạo bản tóm tắt học thuật súc tích, giúp bạn nắm bắt cốt lõi tài liệu chỉ trong vài giây.
            </p>
          </div>

          <div className="bg-white p-7 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-5">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Kiểm duyệt Nghiêm ngặt</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Mọi tài liệu chia sẻ đều trải qua quy trình thẩm định nội dung của Ban Quản trị, bảo đảm tính học thuật, chính xác và ngăn chặn tài liệu rác.
            </p>
          </div>
        </div>
      </section>

      {/* =========================================================================
          5. TÀI LIỆU TIÊU BIỂU VỪA CẬP NHẬT (SHOWCASE)
      ========================================================================= */}
      <section className="bg-slate-100/70 py-16 px-4 sm:px-6 lg:px-8 border-y border-slate-200">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between sm:items-end mb-8">
            <div>
              <h2 className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-1">Học liệu chất lượng cao</h2>
              <p className="text-2xl font-extrabold text-slate-900">Tài liệu học tập mới cập nhật</p>
            </div>
            <button className="text-sm font-semibold text-blue-600 hover:text-blue-700 flex items-center space-x-1 mt-2 sm:mt-0">
              <span>Xem toàn bộ tài liệu</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "Giáo trình Cấu trúc Dữ liệu & Giải thuật nâng cao",
                category: "Khoa học Máy tính",
                type: "PDF",
                size: "4.8 MB",
                author: "TS. Nguyễn Hoàng Nam",
                views: 1240,
                downloads: 480,
                rating: 4.9,
                summary: "Tổng hợp các giải thuật đồ thị, cây tìm kiếm nhị phân cân bằng (AVL, Red-Black) và ứng dụng thực tiễn trong tối ưu hóa cơ sở dữ liệu."
              },
              {
                title: "Nghiên cứu Kiến trúc Vi dịch vụ Microservices & API Gateway",
                category: "Kỹ thuật Phần mềm",
                type: "PDF",
                size: "3.2 MB",
                author: "Nhóm Nghiên cứu KTPM",
                views: 950,
                downloads: 320,
                rating: 4.8,
                summary: "Phân tích so sánh giữa kiến trúc nguyên khối Monolith và Microservices, cơ chế xác thực JWT tập trung và triển khai CI/CD."
              },
              {
                title: "Đề cương Ôn tập & Bài tập Hệ quản trị CSDL PostgreSQL",
                category: "Cơ sở Dữ liệu",
                type: "DOCX",
                size: "2.1 MB",
                author: "Bộ môn Hệ thống Thông tin",
                views: 1850,
                downloads: 790,
                rating: 5.0,
                summary: "Tuyển tập 100 câu hỏi ôn tập lý thuyết chuẩn hóa quan hệ 3NF/BCNF, tối ưu hóa chỉ mục Indexing và kỹ thuật lập trình Stored Procedure."
              }
            ].map((doc, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-100">
                      {doc.category}
                    </span>
                    <span className="text-xs font-bold text-slate-500 uppercase bg-slate-100 px-2 py-0.5 rounded">
                      {doc.type} · {doc.size}
                    </span>
                  </div>

                  <h3 className="font-bold text-base text-slate-900 leading-snug hover:text-blue-600 transition cursor-pointer mb-2">
                    {doc.title}
                  </h3>

                  <p className="text-xs text-slate-500 line-clamp-3 mb-4 leading-relaxed bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <span className="font-semibold text-blue-600">Tóm tắt AI: </span>
                    {doc.summary}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <div className="flex items-center space-x-3">
                    <span className="flex items-center space-x-1">
                      <Eye className="w-3.5 h-3.5 text-slate-400" />
                      <span>{doc.views}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <DownloadCloud className="w-3.5 h-3.5 text-slate-400" />
                      <span>{doc.downloads}</span>
                    </span>
                  </div>

                  <div className="flex items-center space-x-1 text-amber-500 font-bold">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>{doc.rating}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          6. DANH MỤC CHUYÊN NGÀNH NỔI BẬT
      ========================================================================= */}
      <section className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-10">
          <h2 className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-1">Cấu trúc học phần</h2>
          <p className="text-2xl font-extrabold text-slate-900">Danh mục chuyên ngành nổi bật</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
          {[
            { name: "Lập trình Web", icon: Code, count: "140+ tài liệu", desc: "HTML5, Tailwind, ReactJS, FastAPI, REST API" },
            { name: "Cơ sở Dữ liệu", icon: Database, count: "115+ tài liệu", desc: "PostgreSQL, Thiết kế CSDL, Chỉ mục GIN, NoSQL" },
            { name: "Trí tuệ Nhân tạo", icon: Cpu, count: "90+ tài liệu", desc: "Machine Learning, LLM Gemini, ChromaDB Embeddings" },
            { name: "Khoa học Máy tính", icon: BookOpen, count: "125+ tài liệu", desc: "Giải thuật, Kiến trúc máy tính, Mạng truyền thông" },
          ].map((cat, i) => (
            <div
              key={i}
              className="bg-white p-6 rounded-2xl border border-slate-200 hover:border-blue-400 hover:shadow-md transition cursor-pointer group"
            >
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition flex items-center justify-center mb-4">
                <cat.icon className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-900 text-base group-hover:text-blue-600 transition">{cat.name}</h3>
              <p className="text-xs text-slate-500 mt-1.5 mb-3 leading-relaxed">{cat.desc}</p>
              <span className="inline-block text-xs font-semibold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full">
                {cat.count}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* =========================================================================
          7. BANNER KÊU GỌI ĐÓNG GÓP HỌC LIỆU (CTA)
      ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 rounded-3xl p-8 sm:p-12 text-white text-center shadow-xl relative overflow-hidden">
          <div className="relative max-w-2xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-3">
              Bạn có tài liệu học tập bổ ích muốn chia sẻ?
            </h2>
            <p className="text-blue-100 text-sm sm:text-base mb-6 leading-relaxed">
              Cùng xây dựng kho tài nguyên học thuật mở thông minh. Tài liệu của bạn sẽ được AI tự động phân tích, tóm tắt và hỗ trợ sinh viên toàn trường tra cứu.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-3 sm:space-y-0 sm:space-x-4">
              <Link
                to={isAuthenticated ? "/profile" : "/register"}
                className="w-full sm:w-auto px-7 py-3 bg-white text-blue-600 font-bold text-sm rounded-xl hover:bg-blue-50 transition shadow-md"
              >
                {isAuthenticated ? "Khám phá tủ sách học tập" : "Tham gia cộng đồng ngay"}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
