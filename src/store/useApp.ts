import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { demoDocs, demoQuizzes, demoUser } from "@/mock/data";
import type {
  ChatMessage,
  ChatSession,
  QuizAttempt,
  SavedSummary,
  StudyDoc,
  User,
} from "@/types";

export const uid = () => Math.random().toString(36).slice(2, 10);

interface AppState {
  hydrated: boolean;
  users: User[];
  currentUserId: string | null;
  docs: StudyDoc[];
  chats: ChatSession[];
  quizzes: QuizAttempt[];
  summaries: SavedSummary[];
  studyDays: string[];
  questionsAsked: number;

  login: (email: string, password: string) => { ok: boolean; error?: string };
  register: (u: Omit<User, "id" | "plan" | "preferences">) => { ok: boolean; error?: string };
  logout: () => void;
  updateUser: (patch: Partial<User>) => void;
  updatePreferences: (patch: Partial<User["preferences"]>) => void;

  addDoc: (doc: Omit<StudyDoc, "id" | "createdAt" | "studyCount">) => StudyDoc;
  renameDoc: (id: string, name: string) => void;
  deleteDoc: (id: string) => void;
  deleteAllDocs: () => void;
  touchDoc: (id: string) => void;

  newChat: (docId: string) => ChatSession;
  appendMessage: (sessionId: string, msg: ChatMessage) => void;
  rateMessage: (sessionId: string, msgId: string, rating: "up" | "down") => void;

  addQuiz: (q: QuizAttempt) => void;
  addSummary: (s: SavedSummary) => void;
  deleteSummary: (id: string) => void;
  markStudied: () => void;
}

const today = () => new Date().toISOString().slice(0, 10);

export const useApp = create<AppState>()(
  persist(
    (set, get) => ({
      hydrated: false,
      users: [demoUser],
      currentUserId: null,
      docs: demoDocs,
      chats: [],
      quizzes: demoQuizzes,
      summaries: [],
      studyDays: Array.from({ length: 5 }, (_, i) =>
        new Date(Date.now() - i * 86400000).toISOString().slice(0, 10),
      ),
      questionsAsked: 147,

      login: (email, password) => {
        const user = get().users.find(
          (u) => u.email.toLowerCase() === email.trim().toLowerCase(),
        );
        if (!user) return { ok: false, error: "No account found with that email." };
        if (user.password !== password) return { ok: false, error: "Incorrect password." };
        set({ currentUserId: user.id });
        get().markStudied();
        return { ok: true };
      },

      register: (u) => {
        if (get().users.some((x) => x.email.toLowerCase() === u.email.toLowerCase()))
          return { ok: false, error: "An account with this email already exists." };
        const user: User = {
          ...u,
          id: uid(),
          plan: "free",
          preferences: {
            quizCount: 10,
            examStyle: "WAEC",
            responseStyle: "Simple English",
            dailyReminder: false,
            reminderTime: "18:00",
            weeklyEmail: false,
          },
        };
        set((s) => ({ users: [...s.users, user], currentUserId: user.id }));
        get().markStudied();
        return { ok: true };
      },

      logout: () => set({ currentUserId: null }),

      updateUser: (patch) =>
        set((s) => ({
          users: s.users.map((u) => (u.id === s.currentUserId ? { ...u, ...patch } : u)),
        })),

      updatePreferences: (patch) =>
        set((s) => ({
          users: s.users.map((u) =>
            u.id === s.currentUserId ? { ...u, preferences: { ...u.preferences, ...patch } } : u,
          ),
        })),

      addDoc: (doc) => {
        const full: StudyDoc = {
          ...doc,
          text: doc.text.slice(0, 60000),
          id: uid(),
          createdAt: new Date().toISOString(),
          studyCount: 0,
        };
        set((s) => ({ docs: [full, ...s.docs] }));
        return full;
      },

      renameDoc: (id, name) =>
        set((s) => ({ docs: s.docs.map((d) => (d.id === id ? { ...d, name } : d)) })),

      deleteDoc: (id) =>
        set((s) => ({
          docs: s.docs.filter((d) => d.id !== id),
          chats: s.chats.filter((c) => c.docId !== id),
        })),

      deleteAllDocs: () => set({ docs: [], chats: [] }),

      touchDoc: (id) =>
        set((s) => ({
          docs: s.docs.map((d) =>
            d.id === id
              ? { ...d, lastStudiedAt: new Date().toISOString(), studyCount: d.studyCount + 1 }
              : d,
          ),
        })),

      newChat: (docId) => {
        const session: ChatSession = {
          id: uid(),
          docId,
          messages: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        set((s) => ({ chats: [session, ...s.chats] }));
        return session;
      },

      appendMessage: (sessionId, msg) =>
        set((s) => ({
          questionsAsked: s.questionsAsked + (msg.role === "user" ? 1 : 0),
          chats: s.chats.map((c) =>
            c.id === sessionId
              ? { ...c, messages: [...c.messages, msg], updatedAt: new Date().toISOString() }
              : c,
          ),
        })),

      rateMessage: (sessionId, msgId, rating) =>
        set((s) => ({
          chats: s.chats.map((c) =>
            c.id === sessionId
              ? {
                  ...c,
                  messages: c.messages.map((m) => (m.id === msgId ? { ...m, rating } : m)),
                }
              : c,
          ),
        })),

      addQuiz: (q) => set((s) => ({ quizzes: [q, ...s.quizzes] })),
      addSummary: (x) => set((s) => ({ summaries: [x, ...s.summaries] })),
      deleteSummary: (id) => set((s) => ({ summaries: s.summaries.filter((x) => x.id !== id) })),

      markStudied: () =>
        set((s) =>
          s.studyDays.includes(today()) ? s : { studyDays: [today(), ...s.studyDays] },
        ),
    }),
    {
      name: "studypal-store",
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        if (state) state.hydrated = true;
      },
    },
  ),
);

export const useCurrentUser = () =>
  useApp((s) => s.users.find((u) => u.id === s.currentUserId) ?? null);

export function streakFrom(days: string[]): number {
  const set = new Set(days);
  let streak = 0;
  const d = new Date();
  if (!set.has(d.toISOString().slice(0, 10))) d.setDate(d.getDate() - 1);
  for (;;) {
    if (!set.has(d.toISOString().slice(0, 10))) break;
    streak++;
    d.setDate(d.getDate() - 1);
  }
  return streak;
}
