import React from "react";
import { BrowserRouter as Router, Routes, Route, Outlet } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { AdminRoute } from "./components/AdminRoute";
import { AdminLayout } from "./components/admin/AdminLayout";
import { Home } from "./pages/Home";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { Profile } from "./pages/Profile";
import { Upload } from "./pages/Upload";
import { AdminDashboard } from "./pages/admin/AdminDashboard";
import { AdminCategories } from "./pages/admin/AdminCategories";
import { AdminUsers } from "./pages/admin/AdminUsers";
import { AdminModeration } from "./pages/admin/AdminModeration";

// Layout cho người dùng thông thường
const ClientLayout: React.FC = () => (
  <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
    <Navbar />
    <main className="flex-1">
      <Outlet />
    </main>
    <Footer />
  </div>
);

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Các trang dành cho người dùng và khách */}
          <Route element={<ClientLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/upload"
              element={
                <ProtectedRoute>
                  <Upload />
                </ProtectedRoute>
              }
            />
          </Route>

          {/* Toàn bộ các trang Quản trị viên (Bảo vệ bằng AdminRoute & AdminLayout) */}
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminLayout />
              </AdminRoute>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="categories" element={<AdminCategories />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="moderation" element={<AdminModeration />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}
