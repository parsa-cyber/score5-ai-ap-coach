"use client";

import type { Attempt, LearnerProfile } from "@/types";

const PROFILE_KEY = "score5.profile";
const ATTEMPTS_KEY = "score5.attempts";
const STREAK_KEY = "score5.streak";

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
}
