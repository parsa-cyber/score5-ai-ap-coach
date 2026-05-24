"use client";

import { useEffect, useRef, useState } from "react";
import {
  Camera,
  Hand,
  ImagePlus,
  Loader2,
  MonitorUp,
  Sparkles,
  UploadCloud,
} from "lucide-react";
import { Card } from "@/components/Card";
import { apCourses, getCourseInfo } from "@/data/courses";
import { getProfile, saveProfile, getRemainingDailyUsage, incrementDailyUsage } from "@/lib/storage";
import type { Course } from "@/types";
import { useSubscription } from "@/hooks/useSubscription";
import { FREE_LIMITS } from "@/lib/subscription";
import Link from "next/link";

const sampleFeedback = `I can analyze screenshots of AP problems, handwritten FRQ work, graphs, diagrams, or essay drafts. I will identify the course topic, explain the reasoning, point out likely mistakes, and suggest the next practice step.`;

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

async function captureScreenFrame(): Promise<string> {
  const stream = await navigator.mediaDevices.getDisplayMedia({ video: true });
  const video = document.createElement("video");
  video.srcObject = stream;
  await video.play();

  const canvas = document.createElement("canvas");
  const track = stream.getVideoTracks()[0];
  const settings = track.getSettings();
  canvas.width = settings.width || video.videoWidth || 1280;
  canvas.height = settings.height || video.videoHeight || 720;

  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Could not read the screen capture.");
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
  stream.getTracks().forEach((t) => t.stop());
  return canvas.toDataURL("image/png");
}

function captureVideoFrame(video: HTMLVideoElement) {
  const canvas = document.createElement("canvas");
  canvas.width = video.videoWidth || 1280;
  canvas.height = video.videoHeight || 720;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Could not capture camera frame.");
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
  return canvas.toDataURL("image/png");
}

function waitForVideoReady(video: HTMLVideoElement) {
  if (video.readyState >= 2 && video.videoWidth > 0) return Promise.resolve();
  return new Promise<void>((resolve) => {
    const done = () => resolve();
    video.addEventListener("loadedmetadata", done, { once: true });
    video.addEventListener("canplay", done, { once: true });
    window.setTimeout(done, 1200);
  });
}

function getTinyFrame(video: HTMLVideoElement) {
  const canvas = document.createElement("canvas");
  canvas.width = 96;
  canvas.height = 72;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) return null;
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
  return ctx.getImageData(0, 0, canvas.width, canvas.height);
}

function motionScore(previous: ImageData, current: ImageData) {
  const width = current.width;
  const height = current.height;
  const left = Math.floor(width * 0.2);
  const right = Math.floor(width * 0.8);
  const top = Math.floor(height * 0.18);
  const bottom = Math.floor(height * 0.82);
  let changed = 0;
  let total = 0;

  for (let y = top; y < bottom; y += 2) {
    for (let x = left; x < right; x += 2) {
      const i = (y * width + x) * 4;
      const diff =
        Math.abs(current.data[i] - previous.data[i]) +
        Math.abs(current.data[i + 1] - previous.data[i + 1]) +
        Math.abs(current.data[i + 2] - previous.data[i + 2]);
      if (diff > 70) changed += 1;
      total += 1;
    }
  }
  return total ? changed / total : 0;
}

export default function ScreenshotsPage() {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const gestureStopRef = useRef<(() => void) | null>(null);
  const countdownStartedRef = useRef(false);
  const [course, setCourse] = useState<Course>("AP Physics 1: Algebra-Based");
  const [image, setImage] = useState<string>("");
  const [question, setQuestion] = useState(
    "Explain this screenshot for my selected AP class. Identify the topic, solve or grade it if possible, and tell me what mistake to avoid.",
  );
  const [answer, setAnswer] = useState(sampleFeedback);
  const [loading, setLoading] = useState(false);
  const billing = useSubscription();
  const remainingScreenshots = billing.isPro ? Infinity : getRemainingDailyUsage("screenshot_analyze", FREE_LIMITS.screenshot_analyze);
  const [error, setError] = useState("");
  const [cameraOn, setCameraOn] = useState(false);
  const [gestureOn, setGestureOn] = useState(false);
  const [gestureStatus, setGestureStatus] = useState("Camera off");
  const [countdown, setCountdown] = useState<number | null>(null);

  useEffect(() => {
    const profile = getProfile();
    setCourse(profile.course);
    return () => {
      gestureStopRef.current?.();
      streamRef.current?.getTracks().forEach((track) => track.stop());
    };
  }, []);

  function changeCourse(nextCourse: Course) {
    const profile = getProfile();
    saveProfile({ ...profile, course: nextCourse });
    setCourse(nextCourse);
  }

  async function handleFile(file?: File) {
    if (!file) return;
    setError("");
    if (!file.type.startsWith("image/")) {
      setError("Upload a PNG, JPG, or other image file.");
      return;
    }
    const dataUrl = await fileToDataUrl(file);
    setImage(dataUrl);
  }

  async function handleCapture() {
    setError("");
    try {
      const dataUrl = await captureScreenFrame();
      setImage(dataUrl);
    } catch {
      setError(
        "Screen capture was cancelled or blocked. You can still upload a screenshot file instead.",
      );
    }
  }

  async function startCamera() {
    setError("");
    try {
      if (!navigator.mediaDevices?.getUserMedia) {
        setError("Camera capture is not available in this browser.");
        return false;
      }
      if (!window.isSecureContext && location.hostname !== "localhost") {
        setError(
          "Camera and gesture capture require HTTPS on phones. Use localhost on your Mac, or deploy to Vercel/HTTPS before testing from a phone.",
        );
        return false;
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: "environment" },
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setCameraOn(true);
      setGestureStatus("Camera ready. Use Capture photo or enable palm/wave gesture.");
      return true;
    } catch {
      setError(
        "Camera permission was blocked or unavailable. Check browser permissions, or upload a screenshot instead.",
      );
      return false;
    }
  }

  function stopCamera() {
    gestureStopRef.current?.();
    gestureStopRef.current = null;
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    setCameraOn(false);
    setGestureOn(false);
    setGestureStatus("Camera off");
    countdownStartedRef.current = false;
    setCountdown(null);
  }

  function takeCameraPhoto() {
    if (!videoRef.current) return;
    try {
      setImage(captureVideoFrame(videoRef.current));
      setGestureStatus("Photo captured.");
    } catch {
      setError("Could not capture camera photo.");
    }
  }

  function startCountdownCapture() {
    if (!videoRef.current || countdownStartedRef.current) return;
    countdownStartedRef.current = true;
    setGestureStatus("Gesture detected. Capturing in 3...");
    let n = 3;
    setCountdown(n);
    const timer = window.setInterval(() => {
      n -= 1;
      setCountdown(n > 0 ? n : null);
      if (n <= 0) {
        window.clearInterval(timer);
        takeCameraPhoto();
        setGestureStatus("Gesture photo captured. Wave/open your palm again to retake.");
        window.setTimeout(() => {
          countdownStartedRef.current = false;
        }, 2000);
      } else {
        setGestureStatus(`Gesture detected. Capturing in ${n}...`);
      }
    }, 1000);
  }

  async function enableGestureCapture() {
    setError("");
    const cameraReady = streamRef.current ? true : await startCamera();
    const video = videoRef.current;
    if (!cameraReady || !video || !streamRef.current) return;

    await waitForVideoReady(video);
    gestureStopRef.current?.();
    setGestureOn(true);
    setGestureStatus(
      "Gesture mode on. Wave an open palm inside the guide box to start the 3-second countdown.",
    );

    let previous: ImageData | null = null;
    let quietFrames = 0;
    let lastTrigger = 0;

    const interval = window.setInterval(() => {
      if (!videoRef.current || videoRef.current.readyState < 2) return;
      const current = getTinyFrame(videoRef.current);
      if (!current) return;
      if (previous && !countdownStartedRef.current) {
        const score = motionScore(previous, current);
        if (score < 0.025) quietFrames += 1;
        else quietFrames = 0;

        const now = Date.now();
        if (score > 0.11 && quietFrames < 5 && now - lastTrigger > 4500) {
          lastTrigger = now;
          startCountdownCapture();
        } else if (score > 0.055) {
          setGestureStatus("Movement detected. Wave/open your palm clearly in the guide box.");
        } else if (!countdownStartedRef.current) {
          setGestureStatus("Gesture mode on. Wave an open palm inside the guide box.");
        }
      }
      previous = current;
    }, 220);

    gestureStopRef.current = () => {
      window.clearInterval(interval);
    };
  }

  async function analyze() {
    if (!billing.isPro && remainingScreenshots <= 0) {
      setError("You hit the free screenshot analysis limit for today. Upgrade to Pro for unlimited image coaching.");
      return;
    }
    if (!image) {
      setError("Add a screenshot or camera photo first.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/screenshot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image, question, course }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not analyze screenshot.");
      incrementDailyUsage("screenshot_analyze");
      setAnswer(data.answer);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  const courseInfo = getCourseInfo(course);

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-brand-700">
            Screenshot coach
          </p>
          <h1 className="mt-2 text-4xl font-black tracking-tight text-slate-950">
            Upload, capture, or use a hand gesture.
          </h1>
          <p className="mt-3 max-w-2xl text-slate-600">
            Add a screenshot or camera photo for {courseInfo.shortName}. Gesture capture now uses a no-WebGL camera loop, so it avoids the WebGL crash. Wave/open your palm inside the guide box to start a 3-second countdown.
          </p>
          <div className="mt-4 rounded-2xl bg-slate-50 p-4 text-sm font-bold text-slate-700">
            {billing.isPro ? "Pro active: unlimited screenshot analysis." : `Free plan: ${remainingScreenshots} screenshot analys${remainingScreenshots === 1 ? "is" : "es"} left today.`} {!billing.isPro ? <Link href="/pricing" className="ml-2 text-brand-700 underline">Upgrade</Link> : null}
          </div>
        </div>
        <button
          onClick={handleCapture}
          className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-800 shadow-soft transition hover:border-brand-300 hover:text-brand-700"
        >
          <MonitorUp size={18} /> Capture screen
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_.9fr]">
        <Card>
          <label className="mb-5 grid gap-2 font-bold">
            Course
            <select
              value={course}
              onChange={(e) => changeCourse(e.target.value)}
              className="rounded-2xl border border-slate-200 px-4 py-3"
            >
              {apCourses.map((c) => (
                <option key={c.name} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>
          </label>

          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              handleFile(e.dataTransfer.files?.[0]);
            }}
            className="grid min-h-[280px] place-items-center rounded-3xl border-2 border-dashed border-slate-200 bg-slate-50 p-5 text-center"
          >
            {image ? (
              <img
                src={image}
                alt="Uploaded AP screenshot"
                className="max-h-[420px] rounded-2xl border border-slate-200 object-contain shadow-soft"
              />
            ) : (
              <div>
                <UploadCloud className="mx-auto text-brand-600" size={38} />
                <h2 className="mt-4 text-xl font-black text-slate-950">
                  Drop an image here
                </h2>
                <p className="mt-2 text-sm text-slate-600">
                  Or upload a screenshot/photo of a problem, FRQ answer, graph, or essay draft.
                </p>
              </div>
            )}
          </div>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => handleFile(e.target.files?.[0])}
          />
          <div className="mt-4 flex flex-wrap gap-2">
            <button
              onClick={() => inputRef.current?.click()}
              className="inline-flex items-center gap-2 rounded-full bg-brand-600 px-4 py-2 text-sm font-bold text-white"
            >
              <ImagePlus size={16} /> Upload image
            </button>
            <button
              onClick={startCamera}
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-800"
            >
              <Camera size={16} /> Start camera
            </button>
            <button
              onClick={enableGestureCapture}
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-800"
            >
              <Hand size={16} /> Enable gesture
            </button>
            {cameraOn ? (
              <button
                onClick={stopCamera}
                className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-800"
              >
                Stop camera
              </button>
            ) : null}
          </div>

          <div className="relative mt-5 overflow-hidden rounded-3xl border border-slate-200 bg-black">
            <video
              ref={videoRef}
              playsInline
              muted
              className="aspect-video w-full object-cover"
            />
            {cameraOn ? (
              <div className="pointer-events-none absolute inset-[18%_20%] rounded-3xl border-4 border-dashed border-white/80 bg-white/5" />
            ) : null}
            {countdown ? (
              <div className="absolute inset-0 grid place-items-center bg-black/35 text-8xl font-black text-white">
                {countdown}
              </div>
            ) : null}
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <button
              onClick={takeCameraPhoto}
              disabled={!cameraOn}
              className="rounded-full bg-slate-950 px-4 py-2 text-sm font-bold text-white disabled:opacity-40"
            >
              Capture photo
            </button>
            <span className="text-sm font-semibold text-slate-600">
              {gestureStatus}
            </span>
          </div>
        </Card>

        <Card>
          <label className="grid gap-2 font-bold">
            What do you want Score5 to do?
            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              rows={5}
              className="rounded-2xl border border-slate-200 px-4 py-3 leading-7 outline-none focus:border-brand-500"
            />
          </label>
          {error ? (
            <div className="mt-4 rounded-2xl bg-red-50 p-4 text-sm font-bold text-red-700">
              {error}
            </div>
          ) : null}
          <button
            onClick={analyze}
            disabled={loading || !image || (!billing.isPro && remainingScreenshots <= 0)}
            className="mt-5 inline-flex items-center justify-center gap-2 rounded-full bg-slate-950 px-6 py-3 font-black text-white disabled:opacity-40"
          >
            {loading ? (
              <Loader2 className="animate-spin" size={18} />
            ) : (
              <Sparkles size={18} />
            )}{" "}
            Analyze image
          </button>

          <div className="mt-6 rounded-3xl bg-slate-950 p-5 text-white shadow-soft">
            <p className="text-sm font-black uppercase tracking-[0.2em] text-brand-200">
              Coach response
            </p>
            <div className="mt-3 whitespace-pre-wrap text-sm leading-6 text-slate-100">
              {answer}
            </div>
          </div>
        </Card>
      </div>
    </main>
  );
}
