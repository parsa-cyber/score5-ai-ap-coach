import { NextResponse } from "next/server";
import { getCourseInfo } from "@/data/courses";
import { callOpenAIWithImage } from "@/lib/ai";

export async function POST(req: Request) {
  const { image, question, course } = await req.json();
  const courseInfo = getCourseInfo(course);

  if (!image || typeof image !== "string") {
    return NextResponse.json({ error: "Missing screenshot image." }, { status: 400 });
  }

  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json({
      answer:
        `Screenshot uploaded successfully for ${courseInfo.name}. Add OPENAI_API_KEY in .env.local to enable full image analysis. Once enabled, I can identify the course topic, walk through the solution, grade reasoning, and suggest what to practice next.`,
    });
  }

  const prompt = `You are Score5, a screenshot tutor for ${courseInfo.name}. ${courseInfo.tutorStyle}

Analyze the image at an AP/high-school level. If the image is a written response, grade the reasoning with an AP-style point breakdown. If it is a problem, solve it step-by-step and explain common mistakes. Do not claim official College Board scoring. Student request: ${question || "Explain this screenshot."}`;
  const answer = await callOpenAIWithImage(prompt, image);
  return NextResponse.json({ answer });
}
