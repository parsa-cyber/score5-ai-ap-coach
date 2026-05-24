"use client";

import type { Attempt, LearnerProfile } from "@/types";

const PROFILE_KEY = "score5.profile";
const ATTEMPTS_KEY = "score5.attempts";
const STREAK_KEY = "score5.streak";

const USAGE_KEY = "score5.dailyUsage";

type DailyUsage = { date: string; counts: Record<string, number> };

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

function getUsageState(): DailyUsage {
  if (typeof window === "undefined") return { date: todayKey(), counts: {} };
  const today = todayKey();
  const parsed = safeParse<DailyUsage>(localStorage.getItem(USAGE_KEY), { date: today, counts: {} });
  if (parsed.date !== today) {
    const fresh = { date: today, counts: {} };
    localStorage.setItem(USAGE_KEY, JSON.stringify(fresh));
    return fresh;
  }
  return parsed;
}

export function getDailyUsage(feature: string) {
  return getUsageState().counts[feature] || 0;
}

export function incrementDailyUsage(feature: string) {
  if (typeof window === "undefined") return 0;
  const state = getUsageState();
  state.counts[feature] = (state.counts[feature] || 0) + 1;
  localStorage.setItem(USAGE_KEY, JSON.stringify(state));
  return state.counts[feature];
}

export function getRemainingDailyUsage(feature: string, limit: number) {
  return Math.max(0, limit - getDailyUsage(feature));
}

const defaultProfile: LearnerProfile = {
  name: "Parsa",
  course: "AP Physics 1: Algebra-Based",
  targetScore: 5,
  examDate: "2026-05-14",
  minutesPerDay: 35,
  hardestTopics: ["Torque", "Fluids", "Energy explanations"],
  onboarded: false,
};

function safeParse<T>(raw: string | null, fallback: T): T {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function getProfile(): LearnerProfile {
  if (typeof window === "undefined") return defaultProfile;
  return safeParse<LearnerProfile>(localStorage.getItem(PROFILE_KEY), defaultProfile);
}

export function saveProfile(profile: LearnerProfile) {
  if (typeof window === "undefined") return;
  localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
}

export function getAttempts(): Attempt[] {
  if (typeof window === "undefined") return [];
  return safeParse<Attempt[]>(localStorage.getItem(ATTEMPTS_KEY), []);
}

export function saveAttempts(attempts: Attempt[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(ATTEMPTS_KEY, JSON.stringify(attempts));
}

export function addAttempt(attempt: Attempt) {
  const attempts = getAttempts();
  saveAttempts([attempt, ...attempts].slice(0, 500));
  touchStreak();
}

export function touchStreak() {
  if (typeof window === "undefined") return;
  const raw = safeParse<{ lastDate: string; count: number }>(localStorage.getItem(STREAK_KEY), { lastDate: "", count: 0 });
  const today = new Date().toISOString().slice(0, 10);
  if (raw.lastDate === today) return;
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
  const count = raw.lastDate === yesterday ? raw.count + 1 : 1;
  localStorage.setItem(STREAK_KEY, JSON.stringify({ lastDate: today, count }));
}

export function getStreak() {
  if (typeof window === "undefined") return 0;
  return safeParse<{ lastDate: string; count: number }>(localStorage.getItem(STREAK_KEY), { lastDate: "", count: 0 }).count;
}

export function resetDemoData() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(PROFILE_KEY);
  localStorage.removeItem(ATTEMPTS_KEY);
  localStorage.removeItem(STREAK_KEY);
  localStorage.removeItem(USAGE_KEY);
}


const DIAGNOSTIC_RESULT_KEY = "score5.diagnosticResult";
const REFERRAL_KEY = "score5.referrals";
const REMINDERS_KEY = "score5.reminders";

export type DiagnosticResult = {
  course: string;
  score: number;
  readiness: number;
  weakUnits: string[];
  createdAt: string;
};

export type ReferralState = { code: string; invites: number; proRewardDays: number };

export type ReminderSettings = { enabled: boolean; email: string; course: string; examDate: string; frequency: "daily" | "weekly" | "off" };

export function saveDiagnosticResult(result: DiagnosticResult) {
  if (typeof window === "undefined") return;
  localStorage.setItem(DIAGNOSTIC_RESULT_KEY, JSON.stringify(result));
}

export function getDiagnosticResult(): DiagnosticResult | null {
  if (typeof window === "undefined") return null;
  return safeParse<DiagnosticResult | null>(localStorage.getItem(DIAGNOSTIC_RESULT_KEY), null);
}

export function getMistakeAttempts(course?: string) {
  return getAttempts().filter((attempt) => (!course || !attempt.course || attempt.course === course) && !attempt.correct);
}

function makeReferralCode() {
  const profile = getProfile();
  const base = (profile.name || "score5").toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, 8) || "score5";
  const suffix = Math.random().toString(36).slice(2, 6);
  return `${base}${suffix}`;
}

export function getReferralState(): ReferralState {
  if (typeof window === "undefined") return { code: "score5demo", invites: 0, proRewardDays: 0 };
  const existing = safeParse<ReferralState | null>(localStorage.getItem(REFERRAL_KEY), null);
  if (existing?.code) return existing;
  const fresh = { code: makeReferralCode(), invites: 0, proRewardDays: 0 };
  localStorage.setItem(REFERRAL_KEY, JSON.stringify(fresh));
  return fresh;
}

export function addReferralInvite() {
  if (typeof window === "undefined") return getReferralState();
  const state = getReferralState();
  const invites = state.invites + 1;
  const proRewardDays = invites >= 10 ? 30 : invites >= 3 ? 7 : 0;
  const next = { ...state, invites, proRewardDays };
  localStorage.setItem(REFERRAL_KEY, JSON.stringify(next));
  return next;
}

export function getReminderSettings(): ReminderSettings {
  if (typeof window === "undefined") return { enabled: false, email: "", course: defaultProfile.course, examDate: defaultProfile.examDate, frequency: "weekly" };
  return safeParse<ReminderSettings>(localStorage.getItem(REMINDERS_KEY), {
    enabled: false,
    email: "",
    course: getProfile().course,
    examDate: getProfile().examDate,
    frequency: "weekly",
  });
}

export function saveReminderSettings(settings: ReminderSettings) {
  if (typeof window === "undefined") return;
  localStorage.setItem(REMINDERS_KEY, JSON.stringify(settings));
}
