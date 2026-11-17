export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string | null;
  icon?: string | null;
  created_at: string;
  updated_at: string;
}

export interface CategoryCreatePayload {
  name: string;
  description?: string;
  icon?: string;
}

export interface CategoryUpdatePayload {
  name?: string;
  description?: string;
  icon?: string;
}

export interface AdminStats {
  total_users: number;
  active_users: number;
  banned_users: number;
  admin_users: number;
  total_categories: number;
}

