import React from "react";
import { Link } from "react-router-dom";
import { BookOpen, Sparkles, Heart, FileText, Shield, Award, Terminal } from "lucide-react";

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
          {/* Cột 1 & 2: Giới thiệu thương hiệu */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center space-x-2.5 text-white">
              <div className="p-2 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-xl">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <span className="font-extrabold text-2xl tracking-tight">
                DocShare <span className="text-blue-400">AI</span>
              </span>
            </Link>

            <p className="text-slate-400 text-sm leading-relaxed pr-4">
              Hệ thống quản lý, chia sẻ tài nguyên học tập và tìm kiếm tài liệu thông minh ứng dụng Trí tuệ nhân tạo. 
              Nền tảng học liệu mở phục vụ sinh viên, giảng viên và cộng đồng nghiên cứu đại học.
            </p>

            <div className="flex items-center space-x-2 text-xs text-slate-400 pt-2">
              <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-slate-800 border border-slate-700 text-blue-400 font-medium">
                <Sparkles className="w-3.5 h-3.5 mr-1" /> Google Gemini 1.5
              </span>
              <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-slate-800 border border-slate-700 text-emerald-400 font-medium">
                <Terminal className="w-3.5 h-3.5 mr-1" /> ChromaDB Vector
              </span>
            </div>
          </div>

          {/* Cột 3: Khám phá học liệu */}
          <div>
            <h3 className="text-white text-sm font-bold uppercase tracking-wider mb-4">Khám phá học liệu</h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/" className="hover:text-blue-400 transition">Giáo trình & Bài giảng</Link>
              </li>
              <li>
                <Link to="/" className="hover:text-blue-400 transition">Đề cương & Ngân hàng đề thi</Link>
              </li>
              <li>
                <Link to="/" className="hover:text-blue-400 transition">Luận văn & Đồ án mẫu</Link>
              </li>
              <li>
                <Link to="/" className="hover:text-blue-400 transition">Tài liệu tham khảo chuyên ngành</Link>
              </li>
            </ul>
          </div>

          {/* Cột 4: Chuyên ngành nổi bật */}
          <div>
            <h3 className="text-white text-sm font-bold uppercase tracking-wider mb-4">Chuyên ngành</h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/" className="hover:text-blue-400 transition">Công nghệ thông tin</Link>
              </li>
              <li>
                <Link to="/" className="hover:text-blue-400 transition">Khoa học dữ liệu & Trí tuệ nhân tạo</Link>
              </li>
              <li>
                <Link to="/" className="hover:text-blue-400 transition">Kỹ thuật phần mềm & Mạng MT</Link>
              </li>
              <li>
                <Link to="/" className="hover:text-blue-400 transition">Toán tin & Khoa học máy tính</Link>
              </li>
            </ul>
          </div>

          {/* Cột 5: Đề tài & Tiêu chuẩn */}
          <div>
            <h3 className="text-white text-sm font-bold uppercase tracking-wider mb-4">Thông tin đề tài</h3>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li className="flex items-start space-x-2">
                <Shield className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                <span>Kiểm duyệt học thuật minh bạch</span>
              </li>
              <li className="flex items-start space-x-2">
                <FileText className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                <span>Trực quan hóa PDF.js bảo mật</span>
              </li>
              <li className="flex items-start space-x-2">
                <Award className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
                <span>Đồ án Tốt nghiệp Đại học</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Dòng bản quyền cuối trang */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 space-y-4 sm:space-y-0">
          <p>© 2026 DocShare AI. Nền tảng chia sẻ tài nguyên học tập thông minh.</p>
          <p className="flex items-center space-x-1">
            <span>Phát triển phục vụ mục tiêu học thuật & nghiên cứu khoa học</span>
          </p>
        </div>
      </div>
    </footer>
  );
};
