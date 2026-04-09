const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// ─── Types ────────────────────────────────────────────────────
export interface TokenResponse {
  access_token: string;
  user_id: string;
  role: "student" | "parent";
  name: string;
}

export interface StudentProfile {
  id: string;
  user_id: string;
  age?: number;
  class_level?: string;
  city?: string;
  interests?: string[];
  skills?: string[];
  personality?: string;
  risk_level?: string;
  parent_pressure?: string;
  budget_level?: string;
  confusion?: string;
}

export interface ParentProfile {
  id: string;
  user_id: string;
  expectations?: string;
  concerns?: string;
  budget?: string;
}

export interface Message {
  id: string;
  conversation_id: string;
  sender: "user" | "ai";
  message: string;
  metadata?: Record<string, unknown>;
  created_at: string;
}

export interface ConversationItem {
  id: string;
  user_id: string;
  title?: string;
  created_at: string;
}

export interface ChatResponse {
  conversation_id: string;
  user_message: Message;
  ai_message: Message;
}

export interface ConversationHistory {
  conversation: ConversationItem;
  messages: Message[];
  page: number;
  total_pages: number;
  total_messages: number;
}

export interface Career {
  title: string;
  why_fit: string;
  skills: string[];
  india_scope: string;
  government_opportunities?: string;
  challenges: string;
  roadmap: {
    short_term: string;
    mid_term: string;
    long_term: string;
  };
  backup_plan: string;
}

export interface CareerRecommendation {
  id: string;
  user_id: string;
  careers: Career[];
  created_at: string;
}

export interface Progress {
  id: string;
  user_id: string;
  goal: string;
  status: "pending" | "completed";
  deadline?: string;
  created_at?: string;
}

export interface InviteCode {
  code: string;
  role: string;
  expires_at: string;
}

// ─── Helpers ─────────────────────────────────────────────────

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("access_token");
}

async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });

  if (!res.ok) {
    let detail = `HTTP ${res.status}`;
    try {
      const err = await res.json();
      detail = err.detail || JSON.stringify(err);
    } catch {}
    throw new Error(detail);
  }

  const text = await res.text();
  if (!text) return undefined as T;
  return JSON.parse(text) as T;
}

// ─── Auth ────────────────────────────────────────────────────

export const authApi = {
  signup: (data: { name: string; email: string; password: string; role: string }) =>
    request<TokenResponse>("/auth/signup", { method: "POST", body: JSON.stringify(data) }),

  login: (data: { email: string; password: string }) =>
    request<TokenResponse>("/auth/login", { method: "POST", body: JSON.stringify(data) }),
};

// ─── Profile ─────────────────────────────────────────────────

export const profileApi = {
  getStudent: () => request<StudentProfile>("/profile/student"),

  upsertStudent: (data: Partial<StudentProfile>) =>
    request<StudentProfile>("/profile/student", { method: "POST", body: JSON.stringify(data) }),

  getParent: () => request<ParentProfile>("/profile/parent"),

  upsertParent: (data: Partial<ParentProfile>) =>
    request<ParentProfile>("/profile/parent", { method: "POST", body: JSON.stringify(data) }),

  getChildProfile: (studentId: string) =>
    request<StudentProfile>(`/profile/student/${studentId}`),
};

// ─── Chat ────────────────────────────────────────────────────

export const chatApi = {
  start: (language: "en" | "hi" = "en") =>
    request<{ greeting: string; language: string }>(`/chat/start?language=${language}`),

  send: (data: { message: string; conversation_id?: string; language?: string }) =>
    request<ChatResponse>("/chat/send", { method: "POST", body: JSON.stringify(data) }),

  history: (conversationId: string, page = 1) =>
    request<ConversationHistory>(`/chat/history/${conversationId}?page=${page}&page_size=50`),

  conversations: () => request<ConversationItem[]>("/chat/conversations"),
};

// ─── Recommendations ─────────────────────────────────────────

export const recommendationsApi = {
  get: () => request<CareerRecommendation[]>("/recommendations"),

  getForChild: (studentId: string) =>
    request<CareerRecommendation[]>(`/recommendations?student_id=${studentId}`),
};

// ─── Progress ────────────────────────────────────────────────

export const progressApi = {
  list: () => request<Progress[]>("/progress"),

  create: (data: { goal: string; deadline?: string }) =>
    request<Progress>("/progress", { method: "POST", body: JSON.stringify(data) }),

  update: (id: string, data: { status?: string }) =>
    request<Progress>(`/progress/${id}`, { method: "PATCH", body: JSON.stringify(data) }),

  delete: (id: string) =>
    request<void>(`/progress/${id}`, { method: "DELETE" }),
};

// ─── Invite ──────────────────────────────────────────────────

export const inviteApi = {
  create: (role: "student" | "parent") =>
    request<InviteCode>("/invite/create", { method: "POST", body: JSON.stringify({ role }) }),

  join: (code: string) =>
    request<{ message: string }>("/invite/join", { method: "POST", body: JSON.stringify({ code }) }),

  children: () => request<{ student_id: string; name: string; email: string }[]>("/invite/children"),
};
