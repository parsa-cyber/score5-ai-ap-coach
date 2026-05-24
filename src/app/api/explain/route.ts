import { NextResponse } from "next/server";
import { getCourseInfo } from "@/data/courses";
import { callOpenAI } from "@/lib/ai";

export async function POST(req: Request) {
  const { question, selectedAnswer } = await req.json();
  const isCorrect = selectedAnswer === question.correctAnswer;
  const courseInfo = getCourseInfo(question.course);

  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json({
      explanation: isCorrect
        ? `You got it. The key idea is: ${question.explanation}`
        : `You picked ${selectedAnswer}. The correct answer is ${question.correctAnswer}. The missed idea is: ${question.commonMistake}. Simpler: ${question.explanation}`,
    });
  }

  const input = `You are a ${courseInfo.name} tutor. ${courseInfo.tutorStyle}

Explain this MCQ simply and in exam-prep style.
Course: ${courseInfo.name}
Question: ${question.prompt}
Choices: ${question.choices.join(" | ")}
Student chose: ${selectedAnswer}
Correct answer: ${question.correctAnswer}
Official explanation: ${question.explanation}
Common mistake: ${question.commonMistake}

Give: correct answer, why the student's answer is wrong if wrong, concept missed, and how to avoid it next time.`;
  const explanation = await callOpenAI(input);

  return NextResponse.json({ explanation });
}
