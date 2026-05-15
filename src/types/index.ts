export type Role = "owner" | "admin" | "moderator" | "mc" | "user" | "guest";

export type DebateStatus = "scheduled" | "live" | "paused" | "ended";
export type SessionType = "viewer" | "education" | "enjoy";
export type Position = "pro" | "kontra";
export type VoteType = "pro" | "kontra";
export type VoteCategory =
  | "most_logical"
  | "most_convincing"
  | "most_data_based"
  | "most_emotional";
export type MediaType = "image" | "video" | "pdf" | "article" | "link" | "chart";

export interface User {
  id: number;
  email: string;
  display_name: string | null;
  avatar_url: string | null;
  role: Role;
}

export interface Debate {
  id: number;
  title: string;
  motion: string | null;
  description: string | null;
  status: DebateStatus;
  session_type: SessionType;
  current_phase: string;
  tiktok_live_url: string | null;
  started_at: string | null;
  ended_at: string | null;
  created_by: number | null;
  created_at: string;
}

export interface Speaker {
  id: number;
  debate_id: number;
  user_id: number | null;
  display_name: string;
  title: string | null;
  avatar_url: string | null;
  position: Position;
  speaking_order: number;
  total_speaking_time: number;
  is_speaking: boolean;
  is_active: boolean;
}

export interface Comment {
  id: number;
  debate_id: number;
  user_id: number | null;
  display_name: string | null;
  content: string;
  likes_count: number;
  is_highlighted: boolean;
  created_at: string;
}

export interface VoteStats {
  pro: number;
  kontra: number;
  total: number;
  categories: Record<VoteCategory, number>;
}

export interface AiSummary {
  id: number;
  debate_id: number;
  summary_type: string;
  content: Record<string, unknown>;
  created_at: string;
}
