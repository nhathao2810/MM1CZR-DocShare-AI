export interface User {
  id: string;
  email: string;
  full_name: string;
  role: "USER" | "ADMIN";
  status: "ACTIVE" | "BANNED";
  avatar_url?: string | null;
  created_at: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: User;
}

export interface RegisterPayload {
  email: string;
  password: string;
  full_name: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface UpdateProfilePayload {
  full_name?: string;
  avatar_url?: string | null;
}

export interface ChangePasswordPayload {
  old_password: string;
  new_password: string;
}
