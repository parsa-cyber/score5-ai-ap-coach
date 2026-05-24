import { questions } from "@/data/questions";
import { buildStarterQuestion, buildStarterQuestions, unitsForCourse } from "@/data/courses";
import type { Attempt, Course, MistakeType, Question } from "@/types";

export function accuracy(attempts: Attempt[]) {
  if (attempts.length === 0) return 0;
  return Math.round((attempts.filter((a) => a.correct).length / attempts.length) * 100);
}

function attemptsForCourse(attempts: Attempt[], course?: Course) {
  if (!course) return attempts;
  return attempts.filter((a) => !a.course || a.course === course);
}

export function accuracyForUnit(attempts: Attempt[], unit: string, course?: Course) {
  const relevant = attemptsForCourse(attempts, course).filter((a) => a.unit === unit);
  if (relevant.length === 0) return null;
  return accuracy(relevant);
}

export function unitStats(attempts: Attempt[], course?: Course) {
  const courseAttempts = attemptsForCourse(attempts, course);
  return unitsForCourse(course).map((unit) => {
    const relevant = courseAttempts.filter((a) => a.unit === unit);
    return {
      unit,
      attempts: relevant.length,
      accuracy: relevant.length ? accuracy(relevant) : 0,
      mastered: relevant.length >= 3 && accuracy(relevant) >= 80,
    };
  });
}

export function weakestUnits(attempts: Attempt[], limit = 3, course?: Course) {
  const withAttempts = unitStats(attempts, course).filter((s) => s.attempts > 0);
  if (withAttempts.length === 0) {
    return unitsForCourse(course).slice(0, limit);
  }
  return withAttempts.sort((a, b) => a.accuracy - b.accuracy).slice(0, limit).map((s) => s.unit);
}

export function strongestUnit(attempts: Attempt[], course?: Course) {
  const withAttempts = unitStats(attempts, course).filter((s) => s.attempts > 0);
  if (withAttempts.length === 0) return unitsForCourse(course)[0] || "Diagnostic needed";
  return withAttempts.sort((a, b) => b.accuracy - a.accuracy)[0].unit;
}

export function estimatedScore(attempts: Attempt[]) {
  const acc = accuracy(attempts);
  const practiceVolumeBonus = Math.min(6, Math.floor(attempts.length / 8));
  const readiness = Math.max(0, Math.min(100, acc + practiceVolumeBonus));
  if (attempts.length < 5) return { score: 3, readiness: 48, label: "Diagnostic needed" };
  if (readiness >= 86) return { score: 5, readiness, label: "5 range" };
  if (readiness >= 70) return { score: 4, readiness, label: "4 range" };
  if (readiness >= 52) return { score: 3, readiness, label: "3 range" };
  if (readiness >= 35) return { score: 2, readiness, label: "2 range" };
  return { score: 1, readiness, label: "1 range" };
}

export function mistakeBreakdown(attempts: Attempt[]) {
  const wrong = attempts.filter((a) => !a.correct);
  const counts = new Map<MistakeType, number>();
  wrong.forEach((a) => counts.set(a.mistakeType, (counts.get(a.mistakeType) || 0) + 1));
  return Array.from(counts.entries())
    .map(([type, count]) => ({ type, count, percent: wrong.length ? Math.round((count / wrong.length) * 100) : 0 }))
    .sort((a, b) => b.count - a.count);
}

export function recommendedQuestions(
  attempts: Attempt[],
  mode: "quick" | "weakness" | "mistakes",
  unit?: string,
  course: Course = "AP Physics 1: Algebra-Based"
): Question[] {
  const courseQuestions = questions.filter((q) => q.course === course || (course === "AP Physics 1: Algebra-Based" && q.course === "AP Physics 1"));

  if (mode === "mistakes") {
    const missedIds = Array.from(new Set(attempts.filter((a) => !a.correct && (!a.course || a.course === course)).map((a) => a.questionId)));
    const missed = missedIds.map((id) => courseQuestions.find((q) => q.id === id)).filter(Boolean).slice(0, 8) as Question[];
    return missed.length ? missed : buildStarterQuestions(course, unit, 5);
  }

  if (unit) {
    const byUnit = courseQuestions.filter((q) => q.unit === unit).slice(0, 10);
    return byUnit.length ? byUnit : buildStarterQuestions(course, unit, 5);
  }

  if (mode === "weakness") {
    const weak = weakestUnits(attempts, 2, course);
    const weakQuestions = courseQuestions.filter((q) => weak.includes(q.unit)).slice(0, 8);
    return weakQuestions.length ? weakQuestions : weak.flatMap((u) => buildStarterQuestions(course, u, 3)).slice(0, 8);
  }

  const attempted = new Set(attempts.map((a) => a.questionId));
  const fresh = courseQuestions.filter((q) => !attempted.has(q.id));
  const selected = (fresh.length ? fresh : courseQuestions).slice(0, 5);
  return selected.length ? selected : buildStarterQuestions(course, undefined, 5);
}

export function buildTodayMission(attempts: Attempt[], course?: Course) {
  const weak = weakestUnits(attempts, 2, course);
  return [
    `8 ${weak[0] || "high-yield"} practice questions`,
    `4 ${weak[1] || "mixed review"} questions`,
    "1 short FRQ / written response rewrite",
    "Review 3 mistakes",
  ];
}
