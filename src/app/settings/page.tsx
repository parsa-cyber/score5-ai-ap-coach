"use client";

import { useRouter } from "next/navigation";
import { Nav } from "@/components/Nav";
import { Card } from "@/components/Card";
import { resetDemoData } from "@/lib/storage";

export default function SettingsPage() {
  const router = useRouter();
  return (
    <main>
      <Nav />
      <section className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        <Card>
          <h1 className="text-3xl font-black">Settings</h1>
          <p className="mt-2 text-slate-600">Reset demo/localStorage data while testing.</p>
          <button onClick={() => { resetDemoData(); router.push("/onboarding"); }} className="mt-6 rounded-full bg-red-600 px-6 py-3 font-black text-white">Reset demo data</button>
        </Card>
      </section>
    </main>
  );
}
