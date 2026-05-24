"use client";

import { useEffect, useState } from "react";
import { Download, Smartphone } from "lucide-react";
import { Nav } from "@/components/Nav";
import { Card } from "@/components/Card";

type BeforeInstallPromptEvent = Event & { prompt: () => Promise<void>; userChoice: Promise<{ outcome: string }> };

export default function InstallPage() {
  const [promptEvent, setPromptEvent] = useState<BeforeInstallPromptEvent | null>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [installed, setInstalled] = useState(false);
  useEffect(() => {
    setIsIOS(/iphone|ipad|ipod/i.test(navigator.userAgent));
    setInstalled(window.matchMedia("(display-mode: standalone)").matches || (navigator as Navigator & { standalone?: boolean }).standalone === true);
    const handler = (e: Event) => { e.preventDefault(); setPromptEvent(e as BeforeInstallPromptEvent); };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);
  async function install() { if (!promptEvent) return; await promptEvent.prompt(); setPromptEvent(null); }
  return <main><Nav/><section className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8"><p className="text-sm font-black uppercase tracking-[0.2em] text-brand-700">Install app</p><h1 className="mt-2 text-4xl font-black tracking-tight text-slate-950">Add Score5 to your home screen.</h1><Card className="mt-8"><Smartphone className="text-brand-600"/><h2 className="mt-3 text-2xl font-black">{installed ? "Score5 is installed" : "Install Score5"}</h2>{isIOS ? <div className="mt-4 rounded-2xl bg-slate-50 p-5 text-slate-700"><p className="font-black">iPhone/iPad instructions</p><ol className="mt-2 list-decimal space-y-2 pl-5"><li>Open Score5 in Safari.</li><li>Tap the Share button.</li><li>Tap Add to Home Screen.</li><li>Tap Add.</li></ol><p className="mt-3 text-sm text-slate-500">Apple does not allow websites to trigger one-click Home Screen install, so iOS requires these manual steps.</p></div> : <button onClick={install} disabled={!promptEvent} className="mt-5 inline-flex items-center gap-2 rounded-full bg-slate-950 px-5 py-3 font-black text-white disabled:opacity-40"><Download size={16}/>{promptEvent ? "Install Score5" : "Install prompt unavailable"}</button>}</Card></section></main>;
}
