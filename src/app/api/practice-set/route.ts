import { NextResponse } from "next/server";
import { buildStarterQuestions, getCourseInfo } from "@/data/courses";
import type { CourseCategory, CourseInfo, Difficulty, MistakeType, Question } from "@/types";

const mistakeByCategory: Record<CourseCategory, MistakeType> = {
  Arts: "Evidence selection",
  English: "Weak explanation",
  "History and Social Sciences": "Evidence selection",
  "Math and Computer Science": "Conceptual misunderstanding",
  Sciences: "Conceptual misunderstanding",
  "World Languages and Cultures": "Rubric mismatch",
  "AP Capstone": "Rubric mismatch",
  "AP Career Kickstart": "Conceptual misunderstanding",
};

function slug(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

type Seed = {
  unit?: string;
  topic: string;
  prompt: string;
  choices: string[];
  correctAnswer: string;
  explanation: string;
  commonMistake?: string;
  skill?: string;
  difficulty?: Difficulty;
  mistakeType?: MistakeType;
};

function makeQuestion(course: CourseInfo, seed: Seed, index: number, setId: string, selectedUnit?: string): Question {
  const unit = seed.unit || selectedUnit || course.units[index % course.units.length] || course.units[0];
  return {
    id: `local-${slug(course.name)}-${setId}-${index}`,
    course: course.name,
    unit,
    topic: seed.topic,
    difficulty: seed.difficulty || "medium",
    skill: seed.skill || course.skills[index % course.skills.length] || "AP reasoning",
    type: "MCQ",
    prompt: seed.prompt,
    choices: seed.choices,
    correctAnswer: seed.correctAnswer,
    explanation: seed.explanation,
    commonMistake:
      seed.commonMistake ||
      "Choosing the familiar-looking answer without doing the actual course reasoning.",
    mistakeType: seed.mistakeType || mistakeByCategory[course.category] || "Conceptual misunderstanding",
  };
}

function courseSpecificSeeds(course: CourseInfo, unit?: string): Seed[] {
  const name = course.name.toLowerCase();
  const u = unit || course.units[0];

  if (name.includes("united states government")) {
    return [
      {
        unit: "Foundations of American democracy",
        topic: "Federalist No. 10",
        prompt:
          "Which argument from Federalist No. 10 most directly explains Madison's support for an extended republic?",
        choices: [
          "A large republic makes it harder for one faction to dominate the whole system",
          "The president should be chosen by direct national popular vote",
          "Political parties should be permanently banned by the Constitution",
          "State governments should have no authority over elections",
        ],
        correctAnswer:
          "A large republic makes it harder for one faction to dominate the whole system",
        explanation:
          "Madison argues that a large republic controls faction by multiplying interests and making majority tyranny less likely.",
        skill: "foundational documents",
      },
      {
        unit: "Interactions among branches",
        topic: "Checks and balances",
        prompt:
          "Congress refuses to confirm a president's nominee for a federal judgeship. Which constitutional principle is most directly illustrated?",
        choices: [
          "Checks and balances",
          "Popular sovereignty through ballot initiatives",
          "Judicial review of state laws",
          "Fiscal federalism",
        ],
        correctAnswer: "Checks and balances",
        explanation:
          "Senate confirmation is a legislative check on the executive appointment power.",
        skill: "constitutional principles",
      },
      {
        unit: "Civil liberties and civil rights",
        topic: "Selective incorporation",
        prompt:
          "A defendant argues that a state violated her Sixth Amendment right to counsel. Which amendment is usually used to apply that right to the states?",
        choices: ["Fourteenth Amendment", "Tenth Amendment", "Twenty-second Amendment", "Third Amendment"],
        correctAnswer: "Fourteenth Amendment",
        explanation:
          "Selective incorporation applies many Bill of Rights protections to the states through the Fourteenth Amendment's due process clause.",
        skill: "SCOTUS doctrine",
      },
      {
        unit: "American political ideologies and beliefs",
        topic: "Public opinion polling",
        prompt:
          "A poll randomly samples 1,500 adults and reports a margin of error of ±3%. Which conclusion is most accurate?",
        choices: [
          "The true population value is likely within about 3 percentage points of the sample result",
          "The poll proves every individual respondent changed opinions",
          "The poll is invalid because it did not survey every American",
          "The margin of error measures media bias",
        ],
        correctAnswer:
          "The true population value is likely within about 3 percentage points of the sample result",
        explanation:
          "Margin of error describes the expected sampling error around a poll estimate.",
        skill: "data analysis",
      },
      {
        unit: "Political participation",
        topic: "Voter turnout",
        prompt:
          "Which change would most likely increase voter turnout among eligible voters?",
        choices: [
          "Making registration and voting more convenient",
          "Holding fewer elections with less public information",
          "Increasing the cost of voting",
          "Removing all get-out-the-vote efforts",
        ],
        correctAnswer: "Making registration and voting more convenient",
        explanation:
          "Lowering participation costs tends to increase turnout.",
        skill: "political behavior",
      },
    ];
  }

  if (name.includes("calculus")) {
    return [
      {
        unit: "Derivatives",
        topic: "Power rule",
        prompt: "If f(x)=3x^4−2x+7, what is f'(x)?",
        choices: ["12x^3−2", "12x^4−2", "3x^3−2x", "x^5−x^2+7x"],
        correctAnswer: "12x^3−2",
        explanation:
          "Apply the power rule term by term: derivative of 3x^4 is 12x^3, derivative of −2x is −2, and constant 7 becomes 0.",
        skill: "symbolic differentiation",
      },
      {
        unit: "Integrals",
        topic: "Definite integrals",
        prompt: "What is ∫ from 0 to 2 of 3x^2 dx?",
        choices: ["8", "6", "12", "4"],
        correctAnswer: "8",
        explanation: "An antiderivative is x^3. Evaluate from 0 to 2: 2^3−0=8.",
        skill: "accumulation",
      },
      {
        unit: "Applications of derivatives",
        topic: "Critical points",
        prompt:
          "A differentiable function has f'(x) changing from positive to negative at x=4. What occurs at x=4?",
        choices: ["A local maximum", "A local minimum", "A point where f is undefined", "No conclusion can ever be made"],
        correctAnswer: "A local maximum",
        explanation:
          "When f' changes from positive to negative, the function changes from increasing to decreasing, giving a local maximum.",
        skill: "derivative sign analysis",
      },
      {
        unit: "Infinite sequences and series",
        topic: "Geometric series",
        prompt: "The series 1 + 1/3 + 1/9 + 1/27 + ... has sum",
        choices: ["3/2", "2", "1/3", "It diverges"],
        correctAnswer: "3/2",
        explanation:
          "This is geometric with a=1 and r=1/3, so the sum is a/(1−r)=1/(2/3)=3/2.",
        skill: "series convergence",
      },
      {
        unit: "Differential equations",
        topic: "Slope fields",
        prompt:
          "For dy/dx = y, what happens to the slope field along the x-axis where y=0?",
        choices: ["All slopes are 0", "All slopes are 1", "Slopes are undefined", "Slopes depend only on x^2"],
        correctAnswer: "All slopes are 0",
        explanation:
          "If y=0, then dy/dx=0, so the slope segments along the x-axis are horizontal.",
        skill: "differential equations",
      },
    ];
  }

  if (name.includes("chemistry")) {
    return [
      {
        unit: "Acids and bases",
        topic: "pH",
        prompt: "A solution has [H+] = 1.0 × 10^-4 M. What is the pH?",
        choices: ["4", "10", "7", "14"],
        correctAnswer: "4",
        explanation: "pH = −log[H+]. Since [H+] = 10^-4, pH = 4.",
        skill: "calculation setup",
      },
      {
        unit: "Equilibrium",
        topic: "Le Châtelier's principle",
        prompt:
          "For N2(g)+3H2(g) ⇌ 2NH3(g), what happens when H2 is added at constant temperature?",
        choices: [
          "The reaction shifts right to consume added H2",
          "The reaction shifts left to make more H2",
          "K increases immediately",
          "All concentrations become zero",
        ],
        correctAnswer: "The reaction shifts right to consume added H2",
        explanation:
          "Adding a reactant causes the system to shift toward products to reduce the stress.",
        skill: "equilibrium reasoning",
      },
      {
        unit: "Thermodynamics",
        topic: "Gibbs free energy",
        prompt: "If ΔG° for a reaction is negative, the reaction is",
        choices: ["thermodynamically favorable under standard conditions", "impossible", "always infinitely fast", "always endothermic"],
        correctAnswer: "thermodynamically favorable under standard conditions",
        explanation:
          "Negative ΔG° indicates a thermodynamically favorable process under standard conditions, not necessarily a fast one.",
        skill: "thermodynamics",
      },
      {
        unit: "Chemical reactions",
        topic: "Stoichiometry",
        prompt: "How many moles of CO2 form from complete combustion of 2 mol CH4? CH4 + 2O2 → CO2 + 2H2O",
        choices: ["2 mol", "1 mol", "4 mol", "0.5 mol"],
        correctAnswer: "2 mol",
        explanation: "The mole ratio CH4:CO2 is 1:1, so 2 mol CH4 produces 2 mol CO2.",
        skill: "stoichiometry",
      },
      {
        unit: "Kinetics",
        topic: "Rate laws",
        prompt:
          "If doubling [A] doubles the reaction rate while [B] is constant, the reaction is what order in A?",
        choices: ["First order", "Second order", "Zero order", "Third order"],
        correctAnswer: "First order",
        explanation:
          "For first-order dependence, rate is directly proportional to [A].",
        skill: "rate law reasoning",
      },
    ];
  }

  if (name.includes("physics 1")) {
    return [
      {
        unit: "Kinematics",
        topic: "Velocity-time graphs",
        prompt: "On a velocity-time graph, the area under the curve represents",
        choices: ["displacement", "acceleration", "mass", "net force"],
        correctAnswer: "displacement",
        explanation: "Area under a velocity-time graph gives displacement.",
        skill: "graph interpretation",
      },
      {
        unit: "Forces and Translational Dynamics",
        topic: "Newton's second law",
        prompt: "A 2 kg object has a net force of 10 N to the right. What is its acceleration?",
        choices: ["5 m/s² right", "20 m/s² right", "8 m/s² left", "0.2 m/s² right"],
        correctAnswer: "5 m/s² right",
        explanation: "Use Fnet=ma, so a=10/2=5 m/s² to the right.",
        skill: "calculation setup",
      },
      {
        unit: "Work, Energy, and Power",
        topic: "Work-energy theorem",
        prompt: "If net work done on an object is positive, the object's kinetic energy",
        choices: ["increases", "decreases", "must be zero", "is unrelated to work"],
        correctAnswer: "increases",
        explanation: "The work-energy theorem says net work equals change in kinetic energy.",
        skill: "conceptual reasoning",
      },
      {
        unit: "Linear Momentum",
        topic: "Conservation of momentum",
        prompt: "Momentum is conserved in a collision when",
        choices: ["net external impulse on the system is zero", "kinetic energy always increases", "friction inside the system is large", "objects stick together only"],
        correctAnswer: "net external impulse on the system is zero",
        explanation:
          "System momentum is conserved when the net external impulse is zero or negligible.",
        skill: "system reasoning",
      },
      {
        unit: "Torque and Rotational Dynamics",
        topic: "Torque",
        prompt: "For the same force, torque is greatest when the force is applied",
        choices: ["far from the pivot and perpendicular to the lever arm", "at the pivot", "parallel to the lever arm", "with zero lever arm"],
        correctAnswer: "far from the pivot and perpendicular to the lever arm",
        explanation: "Torque magnitude is τ=rFsinθ, so it is greatest with large r and θ=90°.",
        skill: "rotational reasoning",
      },
    ];
  }

  return [];
}

function categorySeeds(course: CourseInfo, unit?: string): Seed[] {
  const u = unit || course.units[0];
  const short = course.shortName;
  const byCategory: Record<CourseCategory, Seed[]> = {
    Arts: [
      {
        topic: "Sustained investigation",
        prompt: `A ${short} portfolio about ${u} shows several finished works but no process images. Which addition would most strengthen the submission?`,
        choices: [
          "Images and notes showing experimentation, revision, and decision-making",
          "A random unrelated artwork",
          "A longer title with no visual evidence",
          "Repeating the exact same final work five times",
        ],
        correctAnswer: "Images and notes showing experimentation, revision, and decision-making",
        explanation: "AP portfolio scoring rewards inquiry, experimentation, revision, and visual evidence.",
        skill: "portfolio development",
      },
      {
        topic: "Visual evidence",
        prompt: `A student says a work communicates tension. Which evidence would best support that claim in ${short}?`,
        choices: [
          "Specific choices in composition, contrast, materials, form, or mark-making",
          "Only the student's claim that it is tense",
          "A list of unrelated artists",
          "The size of the file upload",
        ],
        correctAnswer: "Specific choices in composition, contrast, materials, form, or mark-making",
        explanation: "The claim needs to be supported by observable visual evidence.",
        skill: "visual analysis",
      },
      {
        topic: "Revision",
        prompt: `Which sequence best shows growth in an AP art/design investigation?`,
        choices: [
          "Initial idea → material experiment → critique → revised composition",
          "Final image → final image copied again → no explanation",
          "Unrelated sketch → unrelated sculpture → unrelated photo",
          "Artist statement only with no work shown",
        ],
        correctAnswer: "Initial idea → material experiment → critique → revised composition",
        explanation: "A strong investigation documents purposeful development over time.",
        skill: "process documentation",
      },
      {
        topic: "Selected works",
        prompt: "For selected works, which choice is most important?",
        choices: [
          "Submitting the strongest resolved works that show skill and intentional choices",
          "Submitting the oldest works first",
          "Choosing only works with the most words in the title",
          "Avoiding any explanation of materials",
        ],
        correctAnswer: "Submitting the strongest resolved works that show skill and intentional choices",
        explanation: "Selected works should show quality, skill, and intentional visual decisions.",
        skill: "portfolio scoring",
      },
      {
        topic: "Materials and meaning",
        prompt: `A student uses fragile paper forms to explore instability. The strongest analysis would explain`,
        choices: [
          "how the material choice supports the idea of instability",
          "that paper is always better than metal",
          "only where the paper was purchased",
          "why process evidence should be hidden",
        ],
        correctAnswer: "how the material choice supports the idea of instability",
        explanation: "AP analysis connects materials/process to meaning and visual effect.",
        skill: "visual reasoning",
      },
    ],
    English: [
      {
        topic: "Rhetorical analysis",
        prompt: "A writer begins three consecutive sentences with the same phrase. This technique is best identified as",
        choices: ["anaphora", "syllogism", "understatement", "zeugma"],
        correctAnswer: "anaphora",
        explanation: "Anaphora is repetition at the beginning of successive clauses or sentences.",
        skill: "rhetorical analysis",
      },
      {
        topic: "Commentary",
        prompt: "Which sentence gives the strongest AP essay commentary?",
        choices: [
          "This image matters because it reveals the speaker's fear of losing control.",
          "This quote is good.",
          "The author uses words.",
          "This proves my thesis because I said so.",
        ],
        correctAnswer: "This image matters because it reveals the speaker's fear of losing control.",
        explanation: "Strong commentary explains how evidence supports an interpretation.",
        skill: "commentary",
      },
      {
        topic: "Synthesis",
        prompt: "In a synthesis essay, the most important use of sources is to",
        choices: [
          "support a defensible argument with integrated evidence",
          "summarize every source in order",
          "quote the longest possible passage",
          "avoid taking a position",
        ],
        correctAnswer: "support a defensible argument with integrated evidence",
        explanation: "Synthesis requires using sources to develop your own argument.",
        skill: "synthesis",
      },
      {
        topic: "Tone shift",
        prompt: "A passage shifts from playful imagery to harsh diction. The shift most likely helps develop",
        choices: ["a contrast in tone or meaning", "a purely neutral summary", "a mathematical proof", "a list of unrelated facts"],
        correctAnswer: "a contrast in tone or meaning",
        explanation: "AP English questions often ask how shifts affect tone, theme, or argument.",
        skill: "close reading",
      },
      {
        topic: "Thesis",
        prompt: "Which thesis is most defensible for an AP essay?",
        choices: [
          "The speaker uses contrast and repetition to criticize public apathy.",
          "This passage is about stuff.",
          "The author is good at writing.",
          "There are many rhetorical choices.",
        ],
        correctAnswer: "The speaker uses contrast and repetition to criticize public apathy.",
        explanation: "A strong thesis makes a specific, arguable claim.",
        skill: "thesis",
      },
    ],
    "History and Social Sciences": [
      {
        topic: "Source analysis",
        prompt: `A political cartoon from a reform era exaggerates a wealthy industrialist as larger than elected officials. The image most likely criticizes`,
        choices: [
          "the influence of big business on government",
          "the disappearance of all political parties",
          "a decline in immigration caused by farming",
          "the end of newspapers as a medium",
        ],
        correctAnswer: "the influence of big business on government",
        explanation: "The visual evidence links wealth and oversized influence to political power.",
        skill: "source analysis",
      },
      {
        topic: "Causation",
        prompt: `In ${short}, a question asks why a major reform movement grew after economic change. Which reasoning is strongest?`,
        choices: [
          "Economic change can create social problems that reformers try to solve",
          "Reform movements never respond to economic conditions",
          "Only individual personality can cause reform",
          "Causation means events must be unrelated",
        ],
        correctAnswer: "Economic change can create social problems that reformers try to solve",
        explanation: "AP social science questions reward plausible cause-and-effect reasoning.",
        skill: "causation",
      },
      {
        topic: "Data analysis",
        prompt: "A line graph shows voter turnout rising after registration rules become easier. Which inference is best supported?",
        choices: [
          "Lower participation barriers can increase turnout",
          "Voters no longer care about elections",
          "The graph proves every person voted",
          "Registration rules have no relationship to turnout",
        ],
        correctAnswer: "Lower participation barriers can increase turnout",
        explanation: "The supported inference connects the policy change to the turnout trend without overclaiming.",
        skill: "data analysis",
      },
      {
        topic: "Contextualization",
        prompt: "A primary source written during wartime should first be interpreted by considering",
        choices: [
          "the broader political and social conditions when it was produced",
          "only the length of the document",
          "the font used in the document",
          "whether the source agrees with the reader",
        ],
        correctAnswer: "the broader political and social conditions when it was produced",
        explanation: "Context helps explain purpose, audience, and meaning.",
        skill: "contextualization",
      },
      {
        topic: "Comparison",
        prompt: "A comparison question asks how two political systems distribute power. The best answer should focus on",
        choices: [
          "specific similarities and differences in institutions or authority",
          "which country name is shorter",
          "only personal opinions about leaders",
          "random facts from one system only",
        ],
        correctAnswer: "specific similarities and differences in institutions or authority",
        explanation: "Comparison requires a direct analytical relationship between examples.",
        skill: "comparison",
      },
    ],
    "Math and Computer Science": [
      {
        topic: "Function analysis",
        prompt: "If f(x)=2x^2−3, what is f(4)?",
        choices: ["29", "13", "32", "5"],
        correctAnswer: "29",
        explanation: "Substitute x=4: 2(16)−3=29.",
        skill: "symbolic manipulation",
      },
      {
        topic: "Rate of change",
        prompt: "A function has derivative f'(2)=−5. Which interpretation is correct?",
        choices: [
          "At x=2, the function is decreasing at 5 units of output per unit of input",
          "The function value is −5 at x=2",
          "The graph must cross the x-axis at 2",
          "The average value of the function is 5",
        ],
        correctAnswer: "At x=2, the function is decreasing at 5 units of output per unit of input",
        explanation: "The derivative gives instantaneous rate of change.",
        skill: "graph interpretation",
      },
      {
        topic: "Algorithm tracing",
        prompt: "A variable total starts at 0. A loop adds 2, then 4, then 6. What is total?",
        choices: ["12", "6", "24", "8"],
        correctAnswer: "12",
        explanation: "0+2+4+6=12.",
        skill: "algorithm reasoning",
      },
      {
        topic: "Probability",
        prompt: "If P(A)=0.6, P(B)=0.5, and A and B are independent, what is P(A and B)?",
        choices: ["0.30", "1.10", "0.60", "0.10"],
        correctAnswer: "0.30",
        explanation: "For independent events, multiply probabilities: 0.6×0.5=0.30.",
        skill: "probability",
      },
      {
        topic: "Modeling",
        prompt: "A quantity doubles every 3 hours. Which model type is most appropriate?",
        choices: ["Exponential growth", "Linear decay", "Constant function", "Quadratic with negative leading coefficient"],
        correctAnswer: "Exponential growth",
        explanation: "Repeated multiplication over equal time intervals is exponential growth.",
        skill: "modeling",
      },
    ],
    Sciences: [
      {
        topic: "Experimental design",
        prompt: "A student changes temperature and measures reaction rate while keeping concentration constant. What is the independent variable?",
        choices: ["temperature", "reaction rate", "container color", "trial number only"],
        correctAnswer: "temperature",
        explanation: "The independent variable is what the student intentionally changes.",
        skill: "experimental design",
      },
      {
        topic: "Graph interpretation",
        prompt: "A graph is a straight line through the origin. What relationship is best supported?",
        choices: ["The variables are proportional", "The variables are unrelated", "The slope is zero", "The y-variable is constant"],
        correctAnswer: "The variables are proportional",
        explanation: "A straight line through the origin indicates direct proportionality.",
        skill: "data analysis",
      },
      {
        topic: "Claim-evidence-reasoning",
        prompt: "Data partly contradict a student's hypothesis. A strong AP science response should",
        choices: [
          "revise or qualify the claim using the data",
          "ignore the data",
          "state that evidence never matters",
          "delete the trial with no explanation",
        ],
        correctAnswer: "revise or qualify the claim using the data",
        explanation: "Scientific reasoning requires claims that match the evidence.",
        skill: "FRQ explanation",
      },
      {
        topic: "Controls",
        prompt: "A student changes both light intensity and temperature while measuring plant growth. The main design flaw is that",
        choices: [
          "more than one independent variable changed",
          "the dependent variable is too obvious",
          "the experiment has a control group",
          "measurements were taken",
        ],
        correctAnswer: "more than one independent variable changed",
        explanation: "Changing two independent variables makes it hard to identify the cause of the effect.",
        skill: "experimental design",
      },
      {
        topic: "Systems",
        prompt: "In an energy-flow diagram, energy entering a system minus energy leaving the system equals",
        choices: ["change in energy stored in the system", "zero in every case", "mass only", "the number of particles only"],
        correctAnswer: "change in energy stored in the system",
        explanation: "Energy accounting tracks inputs, outputs, and changes in stored energy.",
        skill: "system modeling",
      },
    ],
    "World Languages and Cultures": [
      {
        topic: "Email reply",
        prompt: `In an AP language email reply about ${u}, what should the response do?`,
        choices: [
          "Answer all questions with appropriate register and relevant details",
          "Use mostly English",
          "Ignore the sender's questions",
          "Write only a greeting",
        ],
        correctAnswer: "Answer all questions with appropriate register and relevant details",
        explanation: "Interpersonal writing is scored on task completion, register, and comprehensibility.",
        skill: "interpersonal writing",
      },
      {
        topic: "Cultural comparison",
        prompt: "A cultural comparison task requires the student to",
        choices: [
          "compare specific cultural examples from two communities",
          "list vocabulary with no comparison",
          "avoid any cultural detail",
          "speak for only one sentence regardless of prompt",
        ],
        correctAnswer: "compare specific cultural examples from two communities",
        explanation: "The task requires specific examples and direct comparison.",
        skill: "cultural comparison",
      },
      {
        topic: "Interpretive listening",
        prompt: "A speaker's tone changes from excited to concerned. The best inference should be based on",
        choices: ["both words and tone/context clues", "only one random word", "English translation guesses", "ignoring the audio"],
        correctAnswer: "both words and tone/context clues",
        explanation: "Interpretive tasks use details, tone, and context to support meaning.",
        skill: "interpretive communication",
      },
      {
        topic: "Presentational speaking",
        prompt: "A strong oral presentation response should be",
        choices: [
          "organized, relevant to the prompt, and supported with examples",
          "unrelated but memorized",
          "silent for most of the time",
          "only a list of disconnected words",
        ],
        correctAnswer: "organized, relevant to the prompt, and supported with examples",
        explanation: "Presentational tasks reward organization, relevance, comprehensibility, and supporting detail.",
        skill: "presentational speaking",
      },
      {
        topic: "Register",
        prompt: "A message to a teacher or official should usually use",
        choices: ["formal or respectful register", "slang only", "no greeting", "random abbreviations"],
        correctAnswer: "formal or respectful register",
        explanation: "Register should match audience and situation.",
        skill: "register",
      },
    ],
    "AP Capstone": [
      {
        topic: "Source credibility",
        prompt: "A source is relevant but funded by a group with a clear stake in the issue. The best evaluation is to",
        choices: [
          "use it carefully while explaining possible bias and limitations",
          "pretend the funding source does not exist",
          "automatically accept every claim",
          "reject all sources with any limitation",
        ],
        correctAnswer: "use it carefully while explaining possible bias and limitations",
        explanation: "AP Capstone rewards nuanced credibility analysis.",
        skill: "source evaluation",
      },
      {
        topic: "Line of reasoning",
        prompt: "A paper includes evidence but never explains how it proves the claim. What is missing?",
        choices: ["commentary/line of reasoning", "a longer title", "more font changes", "fewer sources"],
        correctAnswer: "commentary/line of reasoning",
        explanation: "Evidence must be connected to claims through reasoning.",
        skill: "argument synthesis",
      },
      {
        topic: "Research method",
        prompt: "A method is valid for a research question when it",
        choices: [
          "collects evidence that can actually answer the question",
          "sounds impressive but collects unrelated data",
          "hides all limitations",
          "uses no sources",
        ],
        correctAnswer: "collects evidence that can actually answer the question",
        explanation: "Methodology must align with the research question.",
        skill: "research design",
      },
      {
        topic: "Counterargument",
        prompt: "A strong academic argument handles an opposing view by",
        choices: [
          "acknowledging it and explaining why the main claim still holds",
          "mocking it without evidence",
          "ignoring it completely",
          "changing the topic",
        ],
        correctAnswer: "acknowledging it and explaining why the main claim still holds",
        explanation: "Nuanced arguments address limitations or counterarguments with reasoning.",
        skill: "argumentation",
      },
      {
        topic: "Synthesis",
        prompt: "Synthesis means",
        choices: [
          "combining multiple sources to develop a larger argument",
          "copying one source word-for-word",
          "listing sources with no connection",
          "using no evidence",
        ],
        correctAnswer: "combining multiple sources to develop a larger argument",
        explanation: "Synthesis connects sources to build an argument.",
        skill: "synthesis",
      },
    ],
    "AP Career Kickstart": [
      {
        topic: "Risk assessment",
        prompt: "A company identifies threats, estimates impact, and chooses safeguards. This process is called",
        choices: ["risk assessment", "random guessing", "brand awareness", "font selection"],
        correctAnswer: "risk assessment",
        explanation: "Risk assessment evaluates threats, likelihood, impact, and controls.",
        skill: "risk evaluation",
      },
      {
        topic: "Financial decision-making",
        prompt: "A business compares expected revenue, cost, and uncertainty before launching a product. This is an example of",
        choices: ["evidence-based decision-making", "ignoring constraints", "memorization only", "unrelated formatting"],
        correctAnswer: "evidence-based decision-making",
        explanation: "Business decisions should use costs, benefits, risks, and evidence.",
        skill: "business analysis",
      },
      {
        topic: "Cyber hygiene",
        prompt: "Using a unique password and multi-factor authentication mainly reduces the risk of",
        choices: ["unauthorized account access", "faster typing", "larger file sizes", "lower screen brightness"],
        correctAnswer: "unauthorized account access",
        explanation: "MFA and unique passwords protect accounts even if one credential is exposed.",
        skill: "security reasoning",
      },
      {
        topic: "Budgeting",
        prompt: "A personal budget is most useful because it",
        choices: ["matches spending decisions to income and goals", "makes money unlimited", "removes all taxes", "prevents every emergency"],
        correctAnswer: "matches spending decisions to income and goals",
        explanation: "Budgeting helps allocate limited resources toward needs and goals.",
        skill: "financial reasoning",
      },
      {
        topic: "Communication",
        prompt: "A workplace message to a client should usually prioritize",
        choices: ["clarity, professionalism, and relevant information", "inside jokes only", "missing deadlines", "unclear abbreviations"],
        correctAnswer: "clarity, professionalism, and relevant information",
        explanation: "Professional communication should match audience, purpose, and context.",
        skill: "professional communication",
      },
    ],
  };
  return byCategory[course.category] || byCategory["History and Social Sciences"];
}

function uniqueQuestions(questions: Question[]) {
  const seen = new Set<string>();
  return questions.filter((q) => {
    const key = q.prompt.trim().toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function localPracticeSet(courseName: string, selectedUnit: string | undefined, count: number) {
  const course = getCourseInfo(courseName);
  const setId = Date.now().toString(36);
  const named = courseSpecificSeeds(course, selectedUnit).map((seed, i) =>
    makeQuestion(course, seed, i, setId, selectedUnit),
  );
  const category = categorySeeds(course, selectedUnit).map((seed, i) =>
    makeQuestion(course, seed, i + named.length, setId, selectedUnit),
  );
  const starter = buildStarterQuestions(course.name, selectedUnit, count * 3).map((q, i) => ({
    ...q,
    id: `starter-${slug(course.name)}-${setId}-${i}`,
  }));

  const all = uniqueQuestions([...named, ...starter, ...category]);
  return all.slice(0, count);
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const courseName = String(body.course || "AP Physics 1: Algebra-Based");
  const unit = typeof body.unit === "string" && body.unit.trim() ? body.unit.trim() : undefined;
  const count = Math.max(3, Math.min(8, Number(body.count) || 5));
  const questions = localPracticeSet(courseName, unit, count);

  return NextResponse.json({
    questions,
    source: "instant-local-bank",
  });
}
