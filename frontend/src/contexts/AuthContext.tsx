import React, { createContext, useContext, useState, useEffect } from "react";
import { User, LoginPayload, RegisterPayload, UpdateProfilePayload } from "../types/auth";
import { authService } from "../services/authService";

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (data: LoginPayload) => Promise<void>;
  register: (data: RegisterPayload) => Promise<void>;
  updateUser: (data: UpdateProfilePayload) => Promise<User>;
  uploadAvatar: (file: File) => Promise<string>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem("docshare_token"));
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem("docshare_token");
      if (storedToken) {
        try {
          const userData = await authService.getMe();
          setUser(userData);
          setToken(storedToken);
        } catch {
          localStorage.removeItem("docshare_token");
          localStorage.removeItem("docshare_user");
          setUser(null);
          setToken(null);
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (data: LoginPayload) => {
    const res = await authService.login(data);
    localStorage.setItem("docshare_token", res.access_token);
    localStorage.setItem("docshare_user", JSON.stringify(res.user));
    setToken(res.access_token);
    setUser(res.user);
  };

  const register = async (data: RegisterPayload) => {
    await authService.register(data);
  };

  const updateUser = async (data: UpdateProfilePayload) => {
    const updated = await authService.updateProfile(data);
    setUser(updated);
    localStorage.setItem("docshare_user", JSON.stringify(updated));
    return updated;
  };

  const uploadAvatar = async (file: File) => {
    const res = await authService.uploadAvatar(file);
    setUser(res.user);
    localStorage.setItem("docshare_user", JSON.stringify(res.user));
    return res.avatar_url;
  };

  const logout = () => {
    localStorage.removeItem("docshare_token");
    localStorage.removeItem("docshare_user");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        updateUser,
        uploadAvatar,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
