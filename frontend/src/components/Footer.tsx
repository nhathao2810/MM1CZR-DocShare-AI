import React from "react";
import { Link } from "react-router-dom";
import { BookOpen, ShieldCheck, HelpCircle, FileCheck, Mail } from "lucide-react";

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
              Nền tảng quản lý và chia sẻ tài nguyên học tập thông minh. Kết nối sinh viên, giáo trình và tài liệu học thuật chất lượng cao.
            </p>

            <div className="flex items-center space-x-4 text-xs text-slate-400 pt-2">
              <span className="inline-flex items-center space-x-1.5 text-slate-300">
                <ShieldCheck className="w-4 h-4 text-blue-400" />
                <span>Kiểm duyệt chất lượng</span>
              </span>
              <span className="inline-flex items-center space-x-1.5 text-slate-300">
                <FileCheck className="w-4 h-4 text-emerald-400" />
                <span>Tài liệu mở miễn phí</span>
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
                <Link to="/" className="hover:text-blue-400 transition">Đề cương & Đề thi mẫu</Link>
              </li>
              <li>
                <Link to="/" className="hover:text-blue-400 transition">Bài tập lớn & Đồ án</Link>
              </li>
              <li>
                <Link to="/" className="hover:text-blue-400 transition">Tài liệu tham khảo chuyên ngành</Link>
              </li>
            </ul>
          </div>

          {/* Cột 4: Chuyên ngành học tập */}
          <div>
            <h3 className="text-white text-sm font-bold uppercase tracking-wider mb-4">Danh mục chuyên ngành</h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/" className="hover:text-blue-400 transition">Lập trình Web & Di động</Link>
              </li>
              <li>
                <Link to="/" className="hover:text-blue-400 transition">Cơ sở dữ liệu & Hệ thống</Link>
              </li>
              <li>
                <Link to="/" className="hover:text-blue-400 transition">Trí tuệ nhân tạo & Học máy</Link>
              </li>
              <li>
                <Link to="/" className="hover:text-blue-400 transition">Mạng máy tính & An toàn thông tin</Link>
              </li>
            </ul>
          </div>

          {/* Cột 5: Quy định & Chính sách */}
          <div>
            <h3 className="text-white text-sm font-bold uppercase tracking-wider mb-4">Chính sách & Hỗ trợ</h3>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li>
                <Link to="/" className="hover:text-blue-400 transition">Điều khoản sử dụng</Link>
              </li>
              <li>
                <Link to="/" className="hover:text-blue-400 transition">Chính sách bảo mật</Link>
              </li>
              <li>
                <Link to="/" className="hover:text-blue-400 transition">Quy định bản quyền học liệu</Link>
              </li>
              <li>
                <Link to="/" className="hover:text-blue-400 transition">Báo cáo vi phạm nội dung</Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Dòng bản quyền cuối trang */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 space-y-4 sm:space-y-0">
          <p>© 2026 DocShare AI. Nền tảng chia sẻ và tìm kiếm học liệu số thông minh.</p>
          <p className="flex items-center space-x-1">
            <span>Cộng đồng học tập & chia sẻ tri thức đại học</span>
          </p>
        </div>
      </div>
    </footer>
  );
};
