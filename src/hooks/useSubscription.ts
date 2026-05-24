"use client";

import { useEffect, useMemo, useState } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { isProSubscription, type SubscriptionProfile } from "@/lib/subscription";

type BillingState = {
  loading: boolean;
  signedIn: boolean;
  email: string | null;
  userId: string | null;
  profile: SubscriptionProfile;
  isPro: boolean;
  refresh: () => Promise<void>;
};

const freeProfile: SubscriptionProfile = {
  plan: "free",
  subscription_status: "none",
  current_period_end: null,
};

export function useSubscription(): BillingState {
  const supabase = useMemo(() => getSupabaseBrowserClient(), []);
  const [loading, setLoading] = useState(true);
  const [signedIn, setSignedIn] = useState(false);
  const [email, setEmail] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [profile, setProfile] = useState<SubscriptionProfile>(freeProfile);

  async function refresh() {
    if (!supabase) {
      setLoading(false);
      setSignedIn(false);
      setProfile(freeProfile);
      return;
    }

    setLoading(true);
    const { data: userData } = await supabase.auth.getUser();
    const user = userData.user;

    if (!user) {
      setSignedIn(false);
      setEmail(null);
      setUserId(null);
      setProfile(freeProfile);
      setLoading(false);
      return;
    }

    setSignedIn(true);
    setEmail(user.email ?? null);
    setUserId(user.id);

    const { data } = await supabase
      .from("profiles")
      .select("plan, subscription_status, current_period_end, stripe_customer_id")
      .eq("id", user.id)
      .maybeSingle();

    setProfile({
      plan: data?.plan === "pro" ? "pro" : "free",
      subscription_status: data?.subscription_status || "none",
      current_period_end: data?.current_period_end || null,
      stripe_customer_id: data?.stripe_customer_id || null,
    });
    setLoading(false);
  }

  useEffect(() => {
    refresh();
    if (!supabase) return;
    const { data } = supabase.auth.onAuthStateChange(() => refresh());
    return () => data.subscription.unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [supabase]);

  return {
    loading,
    signedIn,
    email,
    userId,
    profile,
    isPro: isProSubscription(profile),
    refresh,
  };
}
