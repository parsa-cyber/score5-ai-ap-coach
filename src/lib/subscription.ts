export type Plan = "free" | "pro";
export type SubscriptionStatus = "none" | "active" | "trialing" | "past_due" | "canceled" | "incomplete" | string;

export type SubscriptionProfile = {
  plan: Plan;
  subscription_status: SubscriptionStatus;
  current_period_end: string | null;
  stripe_customer_id?: string | null;
};

export const FREE_LIMITS = {
  practice_answer: 10,
  ai_tutor: 5,
  frq_grade: 1,
  screenshot_analyze: 2,
} as const;

export type UsageFeature = keyof typeof FREE_LIMITS;

export function isProSubscription(profile?: Partial<SubscriptionProfile> | null) {
  if (!profile) return false;
  const status = profile.subscription_status || "none";
  const activeStatus = status === "active" || status === "trialing";
  if (profile.plan !== "pro" || !activeStatus) return false;
  if (!profile.current_period_end) return true;
  return new Date(profile.current_period_end).getTime() > Date.now();
}

export function planLabel(profile?: Partial<SubscriptionProfile> | null) {
  return isProSubscription(profile) ? "Pro" : "Free";
}
