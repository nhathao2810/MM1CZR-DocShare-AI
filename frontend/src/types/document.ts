export type DocumentStatus = "PENDING" | "APPROVED" | "REJECTED";

export interface DocumentCategory {
  id: number;
  name: string;
  slug: string;
  icon?: string;
}

export interface DocumentUploader {
  id: string;
  full_name: string;
  email: string;
  avatar_url?: string | null;
}

export interface Document {
  id: string;
  title: string;
  description?: string | null;
  category_id: number;
  uploader_id: string;
  file_url: string;
  file_name: string;
  file_type: string;
  file_size: number;
  page_count: number;
  status: DocumentStatus;
  rejection_reason?: string | null;
  extracted_text?: string | null;
  created_at: string;
  updated_at: string;
  category?: DocumentCategory;
  uploader?: DocumentUploader;
}

export interface DocumentUploadPayload {
  title: string;
  category_id: number;
  description?: string;
  file: File;
}

