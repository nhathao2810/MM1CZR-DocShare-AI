import React, { useState, useRef } from "react";
import { useAuth } from "../contexts/AuthContext";
import { authService } from "../services/authService";
import { getAssetUrl } from "../services/api";
import {
  User as UserIcon,
  Mail,
  Shield,
  Calendar,
  KeyRound,
  CheckCircle,
  AlertCircle,
  Save,
  Camera
} from "lucide-react";

export const Profile: React.FC = () => {
  const { user, updateUser, uploadAvatar } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Tab state: "info" | "password"
  const [activeTab, setActiveTab] = useState<"info" | "password">("info");

  // Profile Form State
  const [fullName, setFullName] = useState(user?.full_name || "");
  const [profileMsg, setProfileMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [profileLoading, setProfileLoading] = useState(false);

  // Avatar Upload State
  const [avatarLoading, setAvatarLoading] = useState(false);
  const [avatarMsg, setAvatarMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Password Form State
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordMsg, setPasswordMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [passwordLoading, setPasswordLoading] = useState(false);

  if (!user) return null;

  // Xử lý tải ảnh đại diện từ máy tính khi bấm vào biểu tượng Camera
  const handleAvatarFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!validTypes.includes(file.type)) {
      setAvatarMsg({ type: "error", text: "Vui lòng chọn tệp ảnh hợp lệ (PNG, JPG, WEBP, GIF)." });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setAvatarMsg({ type: "error", text: "Dung lượng ảnh không được vượt quá 5MB." });
      return;
    }

    setAvatarLoading(true);
    setAvatarMsg(null);

    try {
      await uploadAvatar(file);
      setAvatarMsg({ type: "success", text: "Ảnh đại diện đã được cập nhật thành công!" });
    } catch (err: any) {
      setAvatarMsg({
        type: "error",
        text: err.response?.data?.detail || "Không thể tải ảnh lên. Vui lòng thử lại.",
      });
    } finally {
      setAvatarLoading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileMsg(null);
    setProfileLoading(true);

    try {
      await updateUser({
        full_name: fullName,
      });
      setProfileMsg({ type: "success", text: "Cập nhật thông tin cá nhân thành công!" });
    } catch (err: any) {
      setProfileMsg({
        type: "error",
        text: err.response?.data?.detail || "Không thể cập nhật hồ sơ. Vui lòng thử lại.",
      });
    } finally {
      setProfileLoading(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordMsg(null);

    if (newPassword !== confirmPassword) {
      setPasswordMsg({ type: "error", text: "Mật khẩu mới và xác nhận mật khẩu không khớp!" });
      return;
    }

    if (newPassword.length < 6) {
      setPasswordMsg({ type: "error", text: "Mật khẩu mới phải có tối thiểu 6 ký tự!" });
      return;
    }

    setPasswordLoading(true);

    try {
      const res = await authService.changePassword({
        old_password: oldPassword,
        new_password: newPassword,
      });
      setPasswordMsg({ type: "success", text: res.message || "Đổi mật khẩu thành công!" });
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      setPasswordMsg({
        type: "error",
        text: err.response?.data?.detail || "Đổi mật khẩu thất bại. Kiểm tra lại mật khẩu cũ.",
      });
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* User Overview Header Card */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6 text-center sm:text-left">
            {/* Avatar with Camera Icon Overlay (Duy nhất 1 nơi đổi avatar) */}
            <div className="relative group">
              {user.avatar_url ? (
                <img
                  src={getAssetUrl(user.avatar_url)}
                  alt={user.full_name}
                  className="w-24 h-24 rounded-full object-cover border-4 border-blue-50 shadow-md"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white text-3xl font-bold flex items-center justify-center border-4 border-blue-50 shadow-md">
                  {user.full_name.charAt(0).toUpperCase()}
                </div>
              )}

              {/* Upload trigger button */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={avatarLoading}
                title="Thay đổi ảnh đại diện"
                className="absolute bottom-0 right-0 p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-md transition transform group-hover:scale-110 cursor-pointer"
              >
                <Camera className="w-4 h-4" />
              </button>

              <input
                type="file"
                ref={fileInputRef}
                onChange={handleAvatarFileChange}
                accept="image/png, image/jpeg, image/webp, image/gif"
                className="hidden"
              />
            </div>

            {/* User Meta Info */}
            <div className="flex-1">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-slate-900">{user.full_name}</h1>
                  <p className="text-slate-500 text-sm flex items-center justify-center sm:justify-start space-x-1.5 mt-1">
                    <Mail className="w-4 h-4 text-slate-400" />
                    <span>{user.email}</span>
                  </p>
                </div>

                <div className="flex items-center justify-center space-x-2 mt-3 sm:mt-0">
                  {user.role === "ADMIN" ? (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">
                      <Shield className="w-3.5 h-3.5 mr-1" /> Quản trị viên
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
                      <UserIcon className="w-3.5 h-3.5 mr-1" /> Thành viên
                    </span>
                  )}

                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Đang hoạt động
                  </span>
                </div>
              </div>

              {/* Avatar upload notice */}
              {avatarMsg && (
                <div
                  className={`mt-3 p-3 rounded-xl text-xs flex items-center space-x-2 ${
                    avatarMsg.type === "success"
                      ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                      : "bg-red-50 text-red-800 border border-red-200"
                  }`}
                >
                  {avatarMsg.type === "success" ? (
                    <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
                  )}
                  <span>{avatarMsg.text}</span>
                </div>
              )}

              {avatarLoading && (
                <p className="text-xs text-blue-600 font-medium mt-2 animate-pulse">
                  Đang tải và cập nhật ảnh đại diện lên máy chủ...
                </p>
              )}

              <div className="mt-4 pt-4 border-t border-slate-100 flex items-center text-xs text-slate-500 space-x-4 justify-center sm:justify-start">
                <span className="flex items-center space-x-1.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>Ngày tham gia: {new Date(user.created_at).toLocaleDateString("vi-VN")}</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-2 border-b border-slate-200 pb-2">
          <button
            onClick={() => setActiveTab("info")}
            className={`px-4 py-2 text-sm font-semibold rounded-xl transition flex items-center space-x-2 ${
              activeTab === "info"
                ? "bg-blue-600 text-white shadow-sm"
                : "text-slate-600 hover:bg-slate-200/60"
            }`}
          >
            <UserIcon className="w-4 h-4" />
            <span>Chỉnh sửa hồ sơ</span>
          </button>

          <button
            onClick={() => setActiveTab("password")}
            className={`px-4 py-2 text-sm font-semibold rounded-xl transition flex items-center space-x-2 ${
              activeTab === "password"
                ? "bg-blue-600 text-white shadow-sm"
                : "text-slate-600 hover:bg-slate-200/60"
            }`}
          >
            <KeyRound className="w-4 h-4" />
            <span>Đổi mật khẩu</span>
          </button>
        </div>

        {/* Tab 1: Profile Information */}
        {activeTab === "info" && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
            <h2 className="text-lg font-bold text-slate-900 mb-1">Cập nhật thông tin cá nhân</h2>
            <p className="text-sm text-slate-500 mb-6">Thay đổi họ và tên hiển thị trên hệ thống của bạn</p>

            {profileMsg && (
              <div
                className={`mb-6 p-4 rounded-xl text-sm flex items-start space-x-2 ${
                  profileMsg.type === "success"
                    ? "bg-emerald-50 border border-emerald-200 text-emerald-800"
                    : "bg-red-50 border border-red-200 text-red-800"
                }`}
              >
                {profileMsg.type === "success" ? (
                  <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-emerald-600" />
                ) : (
                  <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-red-600" />
                )}
                <span>{profileMsg.text}</span>
              </div>
            )}

            <form onSubmit={handleUpdateProfile} className="space-y-5 max-w-md">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Địa chỉ Email</label>
                <input
                  type="email"
                  disabled
                  value={user.email}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-100 text-slate-500 text-sm cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Họ và tên hiển thị</label>
                <div className="relative">
                  <UserIcon className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Nhập họ và tên đầy đủ"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={profileLoading}
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium rounded-xl shadow-sm transition flex items-center space-x-2 text-sm"
                >
                  <Save className="w-4 h-4" />
                  <span>{profileLoading ? "Đang lưu..." : "Lưu thay đổi"}</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Tab 2: Change Password */}
        {activeTab === "password" && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
            <h2 className="text-lg font-bold text-slate-900 mb-1">Đổi mật khẩu tài khoản</h2>
            <p className="text-sm text-slate-500 mb-6">Mật khẩu mới yêu cầu tối thiểu 6 ký tự để bảo vệ tài khoản</p>

            {passwordMsg && (
              <div
                className={`mb-6 p-4 rounded-xl text-sm flex items-start space-x-2 ${
                  passwordMsg.type === "success"
                    ? "bg-emerald-50 border border-emerald-200 text-emerald-800"
                    : "bg-red-50 border border-red-200 text-red-800"
                }`}
              >
                {passwordMsg.type === "success" ? (
                  <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-emerald-600" />
                ) : (
                  <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-red-600" />
                )}
                <span>{passwordMsg.text}</span>
              </div>
            )}

            <form onSubmit={handleChangePassword} className="space-y-4 max-w-md">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Mật khẩu hiện tại</label>
                <input
                  type="password"
                  required
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Mật khẩu mới</label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Tối thiểu 6 ký tự"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Xác nhận mật khẩu mới</label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Nhập lại mật khẩu mới"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={passwordLoading}
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium rounded-xl shadow-sm transition flex items-center space-x-2 text-sm"
                >
                  <KeyRound className="w-4 h-4" />
                  <span>{passwordLoading ? "Đang xử lý..." : "Xác nhận đổi mật khẩu"}</span>
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
