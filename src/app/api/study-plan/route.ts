import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { weakUnits = ["Torque and Rotational Dynamics", "Fluids"], days = 7, minutesPerDay = 35 } = await req.json();
  const plan = Array.from({ length: Number(days) || 7 }, (_, index) => {
    const unit = weakUnits[index % weakUnits.length];
    return {
      day: index + 1,
      title: index < 2 ? `Fix ${unit}` : index < 5 ? `Mixed practice with ${unit}` : "Timed review and mistakes",
      tasks: [
        `${Math.round(minutesPerDay * 0.35)} min concept review`,
        `${Math.round(minutesPerDay * 0.45)} min AP-style questions`,
        `${Math.round(minutesPerDay * 0.2)} min mistake review`,
      ],
    };
  });
  return NextResponse.json({ plan });
}
