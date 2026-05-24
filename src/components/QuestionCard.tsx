"use client";

import type { Question } from "@/types";
import { addAttempt } from "@/lib/storage";
import { useEffect, useState } from "react";
import { CheckCircle2, XCircle } from "lucide-react";

export function QuestionCard({ question, onAnswered, onSubmitted }: { question: Question; onAnswered?: () => void; onSubmitted?: () => void }) {
  const [selected, setSelected] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [aiExplanation, setAiExplanation] = useState("");
  const [loadingAI, setLoadingAI] = useState(false);
  const correct = selected === question.correctAnswer;

  useEffect(() => {
    setSelected("");
    setSubmitted(false);
    setAiExplanation("");
    setLoadingAI(false);
  }, [question.id]);

  function submit() {
    if (!selected) return;
    setSubmitted(true);
    addAttempt({
      questionId: question.id,
      selectedAnswer: selected,
      correct,
      unit: question.unit,
      topic: question.topic,
      mistakeType: question.mistakeType,
      createdAt: new Date().toISOString(),
      timeSpentSeconds: 45,
      course: question.course,
    });
    onSubmitted?.();
  }

  async function explainSimpler() {
    setLoadingAI(true);
    setAiExplanation("");
    try {
      const res = await fetch("/api/explain", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question, selectedAnswer: selected }),
      });
      const data = await res.json();
      setAiExplanation(data.explanation || "No explanation returned.");
    } catch {
      setAiExplanation("The AI endpoint failed. Check your API key or try again.");
    } finally {
      setLoadingAI(false);
    }
  }

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft">
      <div className="flex flex-wrap gap-2 text-xs font-bold uppercase tracking-wide text-brand-700">
        <span className="rounded-full bg-brand-50 px-3 py-1">{question.course}</span>
        <span className="rounded-full bg-brand-50 px-3 py-1">{question.unit}</span>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-600">{question.difficulty}</span>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-600">{question.skill}</span>
      </div>
      <h2 className="mt-4 text-xl font-black leading-snug text-slate-950">{question.prompt}</h2>
      <div className="mt-5 grid gap-3">
        {question.choices.map((choice) => {
          const isSelected = selected === choice;
          const showCorrect = submitted && choice === question.correctAnswer;
          const showWrong = submitted && isSelected && choice !== question.correctAnswer;
          return (
            <button
              key={choice}
              disabled={submitted}
              onClick={() => setSelected(choice)}
              className={`flex items-center justify-between rounded-2xl border px-4 py-3 text-left transition ${
                showCorrect ? "border-green-300 bg-green-50" : showWrong ? "border-red-300 bg-red-50" : isSelected ? "border-brand-500 bg-brand-50" : "border-slate-200 hover:border-brand-300 hover:bg-brand-50/40"
              }`}
            >
              <span>{choice}</span>
              {showCorrect ? <CheckCircle2 className="text-green-600" size={18} /> : null}
              {showWrong ? <XCircle className="text-red-600" size={18} /> : null}
            </button>
          );
        })}
      </div>
      {!submitted ? (
        <button onClick={submit} disabled={!selected} className="mt-5 rounded-full bg-slate-950 px-5 py-3 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-40">
          Submit answer
        </button>
      ) : (
        <div className="mt-5 rounded-2xl bg-slate-50 p-5">
          <p className={`font-black ${correct ? "text-green-700" : "text-red-700"}`}>{correct ? "Correct" : "Not quite"}</p>
          <p className="mt-2 text-slate-700">{question.explanation}</p>
          <p className="mt-3 text-sm text-slate-500"><span className="font-bold">Common trap:</span> {question.commonMistake}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <button onClick={explainSimpler} className="rounded-full bg-brand-600 px-4 py-2 text-sm font-bold text-white">
              {loadingAI ? "Thinking..." : "Explain simpler with AI"}
            </button>
            <button onClick={onAnswered} className="rounded-full bg-slate-950 px-4 py-2 text-sm font-bold text-white">
              Next question
            </button>
          </div>
          {aiExplanation ? <p className="mt-4 rounded-2xl bg-white p-4 text-sm leading-6 text-slate-700">{aiExplanation}</p> : null}
        </div>
      )}
    </div>
  );
}
