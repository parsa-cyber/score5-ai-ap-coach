import { NextResponse } from "next/server";
import { getCourseInfo } from "@/data/courses";
import { callOpenAI } from "@/lib/ai";

function localGrade(prompt: { points: number; rubric: string[]; modelAnswer: string }, answer: string) {
  const lower = answer.toLowerCase();
  const hits = prompt.rubric.filter((point) => {
    const p = point.toLowerCase();
    return p.split(/\W+/).filter((word) => word.length > 5).some((word) => lower.includes(word));
  });
  const score = Math.min(prompt.points, Math.max(1, hits.length));
  const missing = prompt.rubric.filter((r) => !hits.includes(r)).slice(0, 4);
  return `Estimated score: ${score}/${prompt.points}\n\nEarned evidence:\n${hits.length ? hits.map((h) => `✓ ${h}`).join("\n") : "No clear rubric points detected yet."}\n\nMissing or unclear:\n${missing.map((m) => `• ${m}`).join("\n")}\n\nRewrite target:\n${prompt.modelAnswer}\n\nNote: This local fallback uses keyword matching. Add OPENAI_API_KEY for stronger rubric scoring.`;
}

export async function POST(req: Request) {
  const { prompt, answer } = await req.json();
  const courseInfo = getCourseInfo(prompt.course);

  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json({ feedback: localGrade(prompt, answer) });
  }

  const input = `Grade this ${courseInfo.name} free-response/written response using the provided AP-style rubric. ${courseInfo.tutorStyle}

Rules:
- Be strict but helpful.
- Do not claim this is an official College Board score.
- Award points only for reasoning/evidence that appears in the answer.

Prompt:\n${prompt.prompt}\n\nRubric (${prompt.points} points):\n${prompt.rubric.map((r: string, i: number) => `${i + 1}. ${r}`).join("\n")}\n\nStudent answer:\n${answer}\n\nReturn in this format:\nEstimated score: X/${prompt.points}\nPoint breakdown:\n- ...\nMissing points:\n- ...\nHow to revise:\n- ...\nFull-credit answer would include:\n...`;
  const feedback = await callOpenAI(input);

  return NextResponse.json({ feedback });
}
