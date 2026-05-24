import { NextResponse } from "next/server";
import { getCourseInfo } from "@/data/courses";
import { callOpenAI, localTutorFallback } from "@/lib/ai";

export async function POST(req: Request) {
  const { messages, course } = await req.json();
  const courseInfo = getCourseInfo(course);
  const last = Array.isArray(messages) ? messages[messages.length - 1]?.text || "" : "";

  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json({ answer: localTutorFallback(last, courseInfo.name) });
  }

  const input = `You are Score5, an expert tutor for ${courseInfo.name}. ${courseInfo.tutorStyle}

Rules:
- Keep explanations high-school friendly and exam-focused.
- Do not claim to be official College Board.
- Do not invent official scoring cutoffs.
- Give concise step-by-step reasoning.
- When useful, include one similar practice idea.

Conversation:
${messages.map((m: { role: string; text: string }) => `${m.role}: ${m.text}`).join("\n")}`;
  const answer = await callOpenAI(input);

  return NextResponse.json({ answer });
}
