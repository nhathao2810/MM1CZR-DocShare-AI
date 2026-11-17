import React from "react";
import { Link } from "react-router-dom";
import { FileCheck2, ArrowLeft, Clock, ShieldCheck } from "lucide-react";

export const AdminModeration: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-800 flex items-center space-x-2.5">
          <FileCheck2 className="w-6 h-6 text-blue-600" />
          <span>Kiểm Duyệt Học Liệu & Bài Đăng</span>
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Khu vực phê duyệt tài liệu do sinh viên tải lên trước khi xuất bản công khai lên hệ thống.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-8 sm:p-12 text-center max-w-xl mx-auto shadow-xs">
        <div className="p-4 bg-blue-50 text-blue-600 rounded-2xl w-16 h-16 mx-auto flex items-center justify-center mb-4">
          <Clock className="w-8 h-8" />
        </div>
        <h2 className="text-lg font-bold text-slate-800">Khu Vực Kiểm Duyệt Tài Liệu</h2>
        <p className="text-sm text-slate-600 mt-2 leading-relaxed">
          Hiện tại các tài liệu vừa tải lên đang được lưu trữ an toàn. Giao diện phê duyệt chi tiết sẽ sớm được hoàn tất để Quản trị viên duyệt và xuất bản tài liệu ra trang chủ.
        </p>

        <div className="mt-6 flex justify-center space-x-3">
          <Link
            to="/admin"
            className="inline-flex items-center space-x-2 px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-semibold transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Quay lại Tổng quan</span>
          </Link>
          <Link
            to="/admin/categories"
            className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold transition"
          >
            <span>Quản lý danh mục</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
