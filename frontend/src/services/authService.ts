import { api } from "./api";
import {
  AuthResponse,
  LoginPayload,
  RegisterPayload,
  UpdateProfilePayload,
  ChangePasswordPayload,
  User
} from "../types/auth";

export const authService = {
  async register(data: RegisterPayload): Promise<User> {
    const res = await api.post<User>("/auth/register", data);
    return res.data;
  },

  async login(data: LoginPayload): Promise<AuthResponse> {
    const res = await api.post<AuthResponse>("/auth/login", data);
    return res.data;
  },

  async getMe(): Promise<User> {
    const res = await api.get<User>("/auth/me");
    return res.data;
  },

  async updateProfile(data: UpdateProfilePayload): Promise<User> {
    const res = await api.put<User>("/auth/me", data);
    return res.data;
  },

  async uploadAvatar(file: File): Promise<{ message: string; avatar_url: string; user: User }> {
    const formData = new FormData();
    formData.append("file", file);
    const res = await api.post<{ message: string; avatar_url: string; user: User }>(
      "/auth/upload-avatar",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return res.data;
  },

  async changePassword(data: ChangePasswordPayload): Promise<{ message: string }> {
    const res = await api.put<{ message: string }>("/auth/change-password", data);
    return res.data;
  },
};
