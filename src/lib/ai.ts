export function modelName() {
  return process.env.OPENAI_MODEL || "gpt-5.1-mini";
}

export async function callOpenAI(input: string) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return null;

  const res = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: modelName(),
      input,
    }),
  });

  if (!res.ok) {
    const message = await res.text();
    throw new Error(`OpenAI request failed: ${message}`);
  }

  const data = await res.json();
  return data.output_text || data.output?.flatMap((item: { content?: Array<{ text?: string }> }) => item.content || []).map((part: { text?: string }) => part.text || "").join("\n") || "";
}

export async function callOpenAIWithImage(input: string, imageDataUrl: string) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return null;

  const res = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: modelName(),
      input: [
        {
          role: "user",
          content: [
            { type: "input_text", text: input },
            { type: "input_image", image_url: imageDataUrl },
          ],
        },
      ],
    }),
  });

  if (!res.ok) {
    const message = await res.text();
    throw new Error(`OpenAI vision request failed: ${message}`);
  }

  const data = await res.json();
  return data.output_text || data.output?.flatMap((item: { content?: Array<{ text?: string }> }) => item.content || []).map((part: { text?: string }) => part.text || "").join("\n") || "";
}

export function localTutorFallback(message: string, course = "AP Physics 1: Algebra-Based") {
  const lower = message.toLowerCase();
  const courseLower = course.toLowerCase();
  if (courseLower.includes("physics") && lower.includes("torque")) {
    return "Torque is the rotational version of force. On AP Physics, the key idea is: bigger force or bigger lever arm means bigger rotational effect. For equilibrium, clockwise torque must balance counterclockwise torque.";
  }
  if (courseLower.includes("physics") && (lower.includes("buoyant") || lower.includes("fluid"))) {
    return "For buoyancy, always start with displaced fluid. The buoyant force equals the weight of the displaced fluid, not the weight or density of the object by itself.";
  }
  if (courseLower.includes("chem") && (lower.includes("acid") || lower.includes("base"))) {
    return "For AP Chemistry acids/bases, first identify strong vs. weak, then decide whether you need stoichiometry, an ICE table, or Henderson-Hasselbalch. Most mistakes happen when students skip the reaction-before-equilibrium step.";
  }
  if ((courseLower.includes("history") || courseLower.includes("gov")) && (lower.includes("dbq") || lower.includes("essay") || lower.includes("frq"))) {
    return "For AP history/government writing, start with a defensible claim, then use specific evidence and explain how that evidence proves the claim. Naming evidence is not enough; the explanation earns the point.";
  }
  if (courseLower.includes("english") || courseLower.includes("lang") || courseLower.includes("lit")) {
    return "For AP English, the score comes from a clear thesis, specific evidence, and commentary that explains how the evidence proves your interpretation. Avoid summary; focus on analysis.";
  }
  if (courseLower.includes("calculus")) {
    return "For AP Calculus, identify the type of question first: limit, derivative, integral, differential equation, or series. Then connect the notation to a meaning: rate of change, accumulation, area, approximation, or convergence.";
  }
  return `For ${course}, start by identifying the exact task, matching it to the relevant unit, and supporting the answer with course-specific evidence, calculation, or reasoning. Then review the mistake pattern so the next practice set targets the weakness.`;
}
