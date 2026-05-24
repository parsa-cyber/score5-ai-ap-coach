import type { Course, CourseCategory, CourseInfo, FRQPrompt, Question } from "@/types";

const commonAcademicSkills = ["content recall", "source analysis", "evidence-based reasoning", "timed exam strategy"];

export const apCourses: CourseInfo[] = [
  {
    name: "AP 2-D Art and Design",
    shortName: "AP 2-D Art",
    category: "Arts",
    units: ["Sustained investigation", "Selected works", "Design principles", "Visual evidence", "Artist statement"],
    skills: ["portfolio development", "composition", "visual analysis", "process documentation"],
    frqLabel: "Portfolio evidence review",
    tutorStyle: "Critique work using AP Art and Design portfolio language: inquiry, synthesis, materials, process, and visual evidence.",
  },
  {
    name: "AP 3-D Art and Design",
    shortName: "AP 3-D Art",
    category: "Arts",
    units: ["Sustained investigation", "Selected works", "Form and space", "Materials and process", "Artist statement"],
    skills: ["3-D composition", "spatial reasoning", "portfolio commentary", "process documentation"],
    frqLabel: "Portfolio evidence review",
    tutorStyle: "Critique 3-D work through form, space, materials, process, inquiry, and evidence of revision.",
  },
  {
    name: "AP Drawing",
    shortName: "AP Drawing",
    category: "Arts",
    units: ["Sustained investigation", "Selected works", "Line and mark-making", "Composition", "Artist statement"],
    skills: ["drawing analysis", "visual evidence", "portfolio development", "process reflection"],
    frqLabel: "Portfolio evidence review",
    tutorStyle: "Use AP Drawing portfolio language focused on mark-making, composition, inquiry, experimentation, and revision.",
  },
  {
    name: "AP Art History",
    shortName: "AP Art History",
    category: "Arts",
    units: ["Global Prehistory", "Ancient Mediterranean", "Early Europe and Colonial Americas", "Later Europe and Americas", "Indigenous Americas", "Africa", "West and Central Asia", "South, East, and Southeast Asia", "The Pacific", "Global Contemporary"],
    skills: ["visual analysis", "contextual analysis", "comparison", "attribution"],
    frqLabel: "Art historical analysis",
    tutorStyle: "Teach visual and contextual analysis, attribution, comparison, and evidence-based interpretation.",
  },
  {
    name: "AP Music Theory",
    shortName: "AP Music Theory",
    category: "Arts",
    units: ["Pitch and rhythm", "Scales and keys", "Intervals and chords", "Harmony and voice leading", "Melodic dictation", "Harmonic dictation", "Sight singing"],
    skills: ["aural analysis", "part writing", "roman numerals", "cadence recognition"],
    frqLabel: "Music theory response",
    tutorStyle: "Explain music theory with clear notation vocabulary, ear-training logic, and step-by-step harmonic reasoning.",
  },
  {
    name: "AP English Language and Composition",
    shortName: "AP Lang",
    category: "English",
    units: ["Rhetorical situation", "Claims and evidence", "Reasoning and organization", "Style", "Synthesis", "Rhetorical analysis", "Argument"],
    skills: ["rhetorical analysis", "argumentation", "synthesis", "commentary"],
    frqLabel: "Essay rubric review",
    tutorStyle: "Coach thesis, evidence, commentary, sophistication, rhetorical choices, and timed essay structure.",
  },
  {
    name: "AP English Literature and Composition",
    shortName: "AP Lit",
    category: "English",
    units: ["Short fiction", "Poetry", "Longer fiction and drama", "Character", "Setting", "Structure", "Narration", "Figurative language", "Literary argument"],
    skills: ["close reading", "literary analysis", "thesis", "commentary"],
    frqLabel: "Literary essay rubric review",
    tutorStyle: "Coach close reading, literary devices, character/theme analysis, thesis strength, and commentary.",
  },
  {
    name: "AP African American Studies",
    shortName: "AP African American Studies",
    category: "History and Social Sciences",
    units: ["Origins of the African diaspora", "Freedom, enslavement, and resistance", "The practice of freedom", "Movements and debates", "Contemporary connections"],
    skills: ["source analysis", "argumentation", "contextualization", "evidence selection"],
    frqLabel: "Source-based response",
    tutorStyle: "Teach source-based historical and cultural analysis with careful evidence, context, and precise claims.",
  },
  {
    name: "AP Comparative Government and Politics",
    shortName: "AP Comp Gov",
    category: "History and Social Sciences",
    units: ["Political systems", "Political institutions", "Political culture", "Party and electoral systems", "Political and economic changes", "Comparative method"],
    skills: ["comparative reasoning", "concept application", "data analysis", "argumentation"],
    frqLabel: "Comparative politics FRQ",
    tutorStyle: "Teach comparison across AP6 countries, concept application, data interpretation, and concise FRQ reasoning.",
  },
  {
    name: "AP European History",
    shortName: "AP Euro",
    category: "History and Social Sciences",
    units: ["Renaissance and Exploration", "Age of Reformation", "Absolutism and Constitutionalism", "Scientific Revolution and Enlightenment", "Revolutionary Europe", "Industrialization", "19th-century perspectives", "20th-century global conflicts", "Cold War and contemporary Europe"],
    skills: ["contextualization", "causation", "comparison", "DBQ/LEQ evidence"],
    frqLabel: "Historical writing rubric review",
    tutorStyle: "Coach AP history thinking skills, DBQ sourcing, contextualization, thesis, and evidence commentary.",
  },
  {
    name: "AP Human Geography",
    shortName: "AP Human Geo",
    category: "History and Social Sciences",
    units: ["Thinking geographically", "Population and migration", "Culture", "Political patterns", "Agriculture", "Cities", "Industrial and economic development"],
    skills: ["model application", "map interpretation", "data analysis", "FRQ reasoning"],
    frqLabel: "Geography FRQ",
    tutorStyle: "Explain models, maps, spatial patterns, data, and AP-style geographic reasoning.",
  },
  {
    name: "AP Macroeconomics",
    shortName: "AP Macro",
    category: "History and Social Sciences",
    units: ["Basic economic concepts", "Economic indicators", "National income and price determination", "Financial sector", "Long-run consequences", "Open economy"],
    skills: ["graphing", "policy analysis", "model application", "economic reasoning"],
    frqLabel: "Macro FRQ",
    tutorStyle: "Teach AD-AS, money market, loanable funds, Phillips curve, and foreign exchange with AP-style graph reasoning.",
  },
  {
    name: "AP Microeconomics",
    shortName: "AP Micro",
    category: "History and Social Sciences",
    units: ["Basic economic concepts", "Supply and demand", "Production and cost", "Market structures", "Factor markets", "Market failure"],
    skills: ["graphing", "marginal analysis", "market model reasoning", "FRQ explanation"],
    frqLabel: "Micro FRQ",
    tutorStyle: "Teach supply/demand, elasticity, firm graphs, market structures, and marginal reasoning.",
  },
  {
    name: "AP Psychology",
    shortName: "AP Psych",
    category: "History and Social Sciences",
    units: ["Biological bases", "Cognition", "Development and learning", "Social psychology", "Mental and physical health"],
    skills: ["term application", "scenario analysis", "research methods", "evidence-based explanation"],
    frqLabel: "Psychology concept application",
    tutorStyle: "Teach vocabulary through scenarios, research design, operational definitions, and precise concept application.",
  },
  {
    name: "AP United States Government and Politics",
    shortName: "AP Gov",
    category: "History and Social Sciences",
    units: ["Foundations of democracy", "Interactions among branches", "Civil liberties and civil rights", "Political ideologies and beliefs", "Political participation"],
    skills: ["SCOTUS comparison", "foundational documents", "data analysis", "argument essay"],
    frqLabel: "Gov FRQ",
    tutorStyle: "Coach concept application, SCOTUS comparison, quantitative analysis, and argument essay evidence.",
  },
  {
    name: "AP United States History",
    shortName: "APUSH",
    category: "History and Social Sciences",
    units: ["1491-1607", "1607-1754", "1754-1800", "1800-1848", "1844-1877", "1865-1898", "1890-1945", "1945-1980", "1980-present"],
    skills: ["stimulus MCQ", "SAQ", "DBQ", "LEQ", "contextualization"],
    frqLabel: "APUSH writing rubric review",
    tutorStyle: "Coach APUSH stimulus analysis, SAQs, DBQs, LEQs, contextualization, sourcing, and evidence links.",
  },
  {
    name: "AP World History: Modern",
    shortName: "AP World",
    category: "History and Social Sciences",
    units: ["Global Tapestry", "Networks of Exchange", "Land-Based Empires", "Transoceanic Interconnections", "Revolutions", "Consequences of Industrialization", "Global Conflict", "Cold War and Decolonization", "Globalization"],
    skills: ["comparison", "causation", "continuity and change", "DBQ/LEQ writing"],
    frqLabel: "World history writing rubric review",
    tutorStyle: "Coach global historical reasoning, DBQs, LEQs, context, complexity, and evidence-based argumentation.",
  },
  {
    name: "AP Calculus AB",
    shortName: "AP Calc AB",
    category: "Math and Computer Science",
    units: ["Limits", "Derivatives", "Applications of derivatives", "Integrals", "Applications of integration", "Differential equations"],
    skills: ["symbolic manipulation", "graph analysis", "FRQ setup", "calculator strategy"],
    frqLabel: "Calculus FRQ",
    tutorStyle: "Teach AP Calculus using clear derivative/integral reasoning, graph connections, and FRQ notation.",
  },
  {
    name: "AP Calculus BC",
    shortName: "AP Calc BC",
    category: "Math and Computer Science",
    units: ["Limits", "Derivatives", "Applications of derivatives", "Integrals", "Applications of integration", "Differential equations", "Parametric/polar/vector functions", "Infinite sequences and series"],
    skills: ["series tests", "Taylor series", "graph analysis", "FRQ setup"],
    frqLabel: "Calculus BC FRQ",
    tutorStyle: "Teach BC-level calculus with attention to series, parametric/polar, calculator/no-calculator strategy, and FRQ notation.",
  },
  {
    name: "AP Computer Science A",
    shortName: "AP CSA",
    category: "Math and Computer Science",
    units: ["Primitive types", "Using objects", "Boolean expressions", "Iteration", "Writing classes", "Arrays", "ArrayList", "2D arrays", "Inheritance", "Recursion"],
    skills: ["Java tracing", "algorithm design", "debugging", "FRQ writing"],
    frqLabel: "Java FRQ",
    tutorStyle: "Teach Java at AP CSA level with simple tracing, arrays, classes, recursion, and FRQ-style code construction.",
  },
  {
    name: "AP Computer Science Principles",
    shortName: "AP CSP",
    category: "Math and Computer Science",
    units: ["Creative development", "Data", "Algorithms and programming", "Computer systems and networks", "Impact of computing"],
    skills: ["algorithm reasoning", "data analysis", "binary and abstraction", "program explanation"],
    frqLabel: "CSP written response",
    tutorStyle: "Teach CSP with pseudocode, abstraction, data, networks, cybersecurity basics, and clear written-response explanations.",
  },
  {
    name: "AP Precalculus",
    shortName: "AP Precalc",
    category: "Math and Computer Science",
    units: ["Polynomial and rational functions", "Exponential and logarithmic functions", "Trigonometric and polar functions", "Functions involving parameters, vectors, and matrices"],
    skills: ["function analysis", "modeling", "graph interpretation", "calculator strategy"],
    frqLabel: "Precalculus response",
    tutorStyle: "Teach functions, transformations, trig, logs, and modeling with graph-based AP reasoning.",
  },
  {
    name: "AP Statistics",
    shortName: "AP Stats",
    category: "Math and Computer Science",
    units: ["One-variable data", "Two-variable data", "Collecting data", "Probability", "Sampling distributions", "Inference for proportions", "Inference for means", "Chi-square", "Inference for slopes"],
    skills: ["inference writing", "experimental design", "probability", "calculator strategy"],
    frqLabel: "Statistics FRQ",
    tutorStyle: "Teach AP Stats with conditions, inference templates, probability reasoning, and clear context sentences.",
  },
  {
    name: "AP Biology",
    shortName: "AP Bio",
    category: "Sciences",
    units: ["Chemistry of life", "Cell structure and function", "Cellular energetics", "Cell communication and cycle", "Heredity", "Gene expression", "Natural selection", "Ecology"],
    skills: ["experimental design", "data analysis", "concept modeling", "FRQ explanation"],
    frqLabel: "Biology FRQ",
    tutorStyle: "Teach AP Bio with mechanisms, data interpretation, experimental design, and precise FRQ claims.",
  },
  {
    name: "AP Chemistry",
    shortName: "AP Chem",
    category: "Sciences",
    units: ["Atomic structure", "Molecular and ionic compound structure", "Intermolecular forces", "Chemical reactions", "Kinetics", "Thermodynamics", "Equilibrium", "Acids and bases", "Applications of thermodynamics"],
    skills: ["stoichiometry", "particle-level reasoning", "equilibrium logic", "lab/data analysis"],
    frqLabel: "Chemistry FRQ",
    tutorStyle: "Teach AP Chem with particulate reasoning, calculations, equilibrium/acid-base logic, and FRQ point language.",
  },
  {
    name: "AP Environmental Science",
    shortName: "APES",
    category: "Sciences",
    units: ["Ecosystems", "Biodiversity", "Populations", "Earth systems", "Land and water use", "Energy resources", "Atmospheric pollution", "Aquatic/terrestrial pollution", "Global change"],
    skills: ["data analysis", "environmental systems", "math setup", "argument from evidence"],
    frqLabel: "Environmental science FRQ",
    tutorStyle: "Teach environmental systems, human impacts, data tables, calculations, and policy/tradeoff reasoning.",
  },
  {
    name: "AP Physics 1: Algebra-Based",
    shortName: "AP Physics 1",
    category: "Sciences",
    units: ["Kinematics", "Forces and Translational Dynamics", "Work, Energy, and Power", "Linear Momentum", "Torque and Rotational Dynamics", "Energy and Momentum of Rotating Systems", "Oscillations", "Fluids"],
    skills: ["conceptual reasoning", "graph interpretation", "experimental design", "FRQ justification"],
    frqLabel: "Physics 1 FRQ",
    tutorStyle: "Teach AP Physics 1 at an algebra-based level. Do not use calculus. Emphasize concepts, diagrams, graphs, and justification.",
  },
  {
    name: "AP Physics 2: Algebra-Based",
    shortName: "AP Physics 2",
    category: "Sciences",
    units: ["Fluids", "Thermodynamics", "Electric force, field, and potential", "Electric circuits", "Magnetism and electromagnetic induction", "Geometric and physical optics", "Quantum, atomic, and nuclear physics"],
    skills: ["conceptual reasoning", "calculation setup", "diagram interpretation", "experimental design"],
    frqLabel: "Physics 2 FRQ",
    tutorStyle: "Teach AP Physics 2 at an algebra-based level with clear conceptual and mathematical reasoning.",
  },
  {
    name: "AP Physics C: Electricity and Magnetism",
    shortName: "AP Physics C: E&M",
    category: "Sciences",
    units: ["Electrostatics", "Conductors and capacitors", "Electric circuits", "Magnetic fields", "Electromagnetism"],
    skills: ["calculus-based physics", "vector reasoning", "FRQ derivation", "graph interpretation"],
    frqLabel: "Physics C E&M FRQ",
    tutorStyle: "Teach calculus-based E&M with vectors, integrals/derivatives where appropriate, diagrams, and AP-style derivations.",
  },
  {
    name: "AP Physics C: Mechanics",
    shortName: "AP Physics C: Mechanics",
    category: "Sciences",
    units: ["Kinematics", "Newton's laws", "Work, energy, and power", "Systems of particles and linear momentum", "Rotation", "Oscillations", "Gravitation"],
    skills: ["calculus-based mechanics", "derivations", "graph interpretation", "FRQ setup"],
    frqLabel: "Physics C Mechanics FRQ",
    tutorStyle: "Teach calculus-based mechanics using derivatives/integrals when appropriate and clear AP-style reasoning.",
  },
  {
    name: "AP Chinese Language and Culture",
    shortName: "AP Chinese",
    category: "World Languages and Cultures",
    units: ["Families and communities", "Personal and public identities", "Beauty and aesthetics", "Science and technology", "Contemporary life", "Global challenges"],
    skills: ["interpretive communication", "presentational writing", "interpersonal speaking", "cultural comparison"],
    frqLabel: "Language response",
    tutorStyle: "Coach AP world language tasks with vocabulary, grammar, cultural comparison, email/reply structure, and speaking organization.",
  },
  {
    name: "AP French Language and Culture",
    shortName: "AP French",
    category: "World Languages and Cultures",
    units: ["Families and communities", "Personal and public identities", "Beauty and aesthetics", "Science and technology", "Contemporary life", "Global challenges"],
    skills: ["interpretive communication", "email reply", "persuasive essay", "cultural comparison"],
    frqLabel: "Language response",
    tutorStyle: "Coach AP French with clear grammar, transition phrases, cultural comparison, email reply, and persuasive essay structure.",
  },
  {
    name: "AP German Language and Culture",
    shortName: "AP German",
    category: "World Languages and Cultures",
    units: ["Families and communities", "Personal and public identities", "Beauty and aesthetics", "Science and technology", "Contemporary life", "Global challenges"],
    skills: ["interpretive communication", "email reply", "argumentation", "cultural comparison"],
    frqLabel: "Language response",
    tutorStyle: "Coach AP German responses with grammar, cultural comparison, email conventions, and persuasive organization.",
  },
  {
    name: "AP Italian Language and Culture",
    shortName: "AP Italian",
    category: "World Languages and Cultures",
    units: ["Families and communities", "Personal and public identities", "Beauty and aesthetics", "Science and technology", "Contemporary life", "Global challenges"],
    skills: ["interpretive communication", "email reply", "persuasive essay", "cultural comparison"],
    frqLabel: "Language response",
    tutorStyle: "Coach AP Italian tasks with grammar, cultural knowledge, email reply structure, and persuasive essay logic.",
  },
  {
    name: "AP Japanese Language and Culture",
    shortName: "AP Japanese",
    category: "World Languages and Cultures",
    units: ["Families and communities", "Personal and public identities", "Beauty and aesthetics", "Science and technology", "Contemporary life", "Global challenges"],
    skills: ["interpretive communication", "presentational writing", "conversation", "cultural comparison"],
    frqLabel: "Language response",
    tutorStyle: "Coach AP Japanese tasks with register, vocabulary, grammar, cultural comparison, and response organization.",
  },
  {
    name: "AP Latin",
    shortName: "AP Latin",
    category: "World Languages and Cultures",
    units: ["Vergil selections", "Caesar selections", "Sight reading", "Translation", "Short-answer analysis", "Essay analysis"],
    skills: ["translation", "grammar parsing", "stylistic analysis", "textual evidence"],
    frqLabel: "Latin translation/analysis",
    tutorStyle: "Coach Latin translation, grammar parsing, stylistic analysis, and evidence-based literary/historical interpretation.",
  },
  {
    name: "AP Spanish Language and Culture",
    shortName: "AP Spanish Lang",
    category: "World Languages and Cultures",
    units: ["Families and communities", "Personal and public identities", "Beauty and aesthetics", "Science and technology", "Contemporary life", "Global challenges"],
    skills: ["interpretive communication", "email reply", "persuasive essay", "cultural comparison"],
    frqLabel: "Language response",
    tutorStyle: "Coach AP Spanish language tasks with grammar, email reply, persuasive essay, conversation, and cultural comparison.",
  },
  {
    name: "AP Spanish Literature and Culture",
    shortName: "AP Spanish Lit",
    category: "World Languages and Cultures",
    units: ["La época medieval", "El Siglo de Oro", "El siglo XIX", "La Generación del 98", "El Boom latinoamericano", "Contemporary works", "Literary analysis"],
    skills: ["literary analysis", "textual evidence", "theme comparison", "cultural context"],
    frqLabel: "Literary analysis response",
    tutorStyle: "Coach Spanish literary analysis, themes, context, textual evidence, and comparison in Spanish or English as requested.",
  },
  {
    name: "AP Research",
    shortName: "AP Research",
    category: "AP Capstone",
    units: ["Research question", "Literature review", "Methodology", "Data analysis", "Academic paper", "Presentation and oral defense"],
    skills: ["research design", "source evaluation", "academic writing", "oral defense"],
    frqLabel: "Research paper/presentation review",
    tutorStyle: "Coach research question quality, methodology, evidence, limitations, academic style, and oral defense responses.",
  },
  {
    name: "AP Seminar",
    shortName: "AP Seminar",
    category: "AP Capstone",
    units: ["Question and explore", "Understand and analyze", "Evaluate multiple perspectives", "Synthesize ideas", "Team project", "Individual research-based essay", "End-of-course exam"],
    skills: ["argument synthesis", "source evaluation", "evidence integration", "presentation defense"],
    frqLabel: "Seminar evidence/argument review",
    tutorStyle: "Coach evidence quality, line of reasoning, source credibility, synthesis, and oral defense clarity.",
  },
  {
    name: "AP Business with Personal Finance",
    shortName: "AP Business + Finance",
    category: "AP Career Kickstart",
    units: ["Business foundations", "Personal finance", "Marketing", "Accounting basics", "Entrepreneurship", "Business decision-making"],
    skills: ["financial reasoning", "business analysis", "case study logic", "data interpretation"],
    frqLabel: "Business case response",
    tutorStyle: "Coach business and personal finance concepts using practical scenarios, calculations, and evidence-based decisions.",
  },
  {
    name: "AP Cybersecurity",
    shortName: "AP Cybersecurity",
    category: "AP Career Kickstart",
    units: ["Security principles", "Networking basics", "Threats and vulnerabilities", "Risk management", "Cryptography basics", "Incident response", "Ethics and policy"],
    skills: ["security reasoning", "network analysis", "risk evaluation", "ethical decision-making"],
    frqLabel: "Cybersecurity scenario response",
    tutorStyle: "Teach defensive cybersecurity concepts, risk reasoning, network/security fundamentals, and ethics at a student-safe level.",
  },
];

export const courseNames = apCourses.map((course) => course.name);

export const courseCategories: CourseCategory[] = [
  "Arts",
  "English",
  "History and Social Sciences",
  "Math and Computer Science",
  "Sciences",
  "World Languages and Cultures",
  "AP Capstone",
  "AP Career Kickstart",
];

export function getCourseInfo(courseName?: Course): CourseInfo {
  return apCourses.find((course) => course.name === courseName || course.shortName === courseName) || apCourses.find((course) => course.shortName === "AP Physics 1")!;
}

export function unitsForCourse(courseName?: Course) {
  return getCourseInfo(courseName).units;
}

export function topicOptionsForCourse(courseName?: Course) {
  const course = getCourseInfo(courseName);
  return Array.from(new Set([...course.units.slice(0, 6), ...course.skills.slice(0, 4)])).slice(0, 10);
}

function starterSlug(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

type StarterSeed = {
  unit?: string;
  topic: string;
  prompt: string;
  choices: string[];
  correctAnswer: string;
  explanation: string;
  skill?: string;
  difficulty?: "easy" | "medium" | "hard";
  commonMistake?: string;
  mistakeType?: Question["mistakeType"];
};

const authenticStarterBank: Record<string, StarterSeed[]> = {
  "AP 2-D Art and Design": [
    { topic: "Sustained investigation", prompt: "A portfolio shows ten images exploring how cropping, scale, and negative space change the feeling of isolation in urban scenes. Which addition would most strengthen the sustained investigation?", choices: ["A random landscape in a different style", "Process images showing experiments with cropping and scale, plus written reflection on what changed", "Five polished copies of the same composition", "A paragraph listing famous photographers without connecting them to the work"], correctAnswer: "Process images showing experiments with cropping and scale, plus written reflection on what changed", explanation: "AP 2-D portfolios reward visual evidence of inquiry, experimentation, revision, and purposeful decision-making.", skill: "portfolio development" },
  ],
  "AP 3-D Art and Design": [
    { topic: "Form and space", prompt: "A student builds a series of wire sculptures investigating tension between balance and instability. Which evidence best supports a strong 3-D sustained investigation?", choices: ["One unrelated ceramic bowl added at the end", "A sequence of sculptures showing changes in weight distribution, support points, and viewer movement around the form", "Only a written statement saying the work is about balance", "A perfectly symmetrical object repeated five times with no revision"], correctAnswer: "A sequence of sculptures showing changes in weight distribution, support points, and viewer movement around the form", explanation: "Strong AP 3-D work shows inquiry through form, space, materials, process, and revision—not just a claim.", skill: "3-D composition" },
  ],
  "AP Drawing": [
    { topic: "Line and mark-making", prompt: "A drawing portfolio investigates anxiety through repeated figure studies. Which choice best demonstrates development of the investigation?", choices: ["Using the same pose and marks every time", "Experimenting with line weight, erasure, layering, and composition to change emotional effect", "Adding unrelated digital photos", "Submitting only the final drawing with no process evidence"], correctAnswer: "Experimenting with line weight, erasure, layering, and composition to change emotional effect", explanation: "AP Drawing values purposeful mark-making and visible experimentation tied to the inquiry.", skill: "drawing analysis" },
  ],
  "AP Art History": [
    { topic: "Global Prehistory", prompt: "The form of the Great Hall of the Bulls at Lascaux is best understood as evidence of which broader art historical idea?", choices: ["Art was only used as decoration for wealthy patrons", "Images can serve ritual, symbolic, or communal purposes even before written records", "All prehistoric art was made for political propaganda", "Prehistoric artists avoided animal imagery"], correctAnswer: "Images can serve ritual, symbolic, or communal purposes even before written records", explanation: "AP Art History questions connect visual evidence, context, function, and meaning. Lascaux is often interpreted through ritual/symbolic and communal context.", skill: "contextual analysis" },
  ],
  "AP Music Theory": [
    { topic: "Intervals and chords", prompt: "In the key of C major, the notes G-B-D-F form which chord?", choices: ["I", "V7", "ii6", "IV"], correctAnswer: "V7", explanation: "G-B-D is the V triad in C major, and adding F creates the seventh above G, so the chord is V7.", skill: "roman numerals" },
  ],
  "AP English Language and Composition": [
    { topic: "Rhetorical analysis", prompt: "A speaker repeats the phrase “we cannot wait” at the beginning of several sentences. In a rhetorical analysis MCQ, this choice is most likely used to", choices: ["create urgency through anaphora", "provide statistical evidence", "shift from logos to a counterclaim", "establish a chronological narrative only"], correctAnswer: "create urgency through anaphora", explanation: "Repeated opening phrasing is anaphora. The effect here is urgency and emphasis.", skill: "rhetorical analysis" },
  ],
  "AP English Literature and Composition": [
    { topic: "Poetry", prompt: "In a poem, a calm natural image is followed by harsh diction about decay. The shift most likely helps develop", choices: ["a contrast between appearance and reality", "a purely comic tone", "a list of historical events", "a neutral objective summary"], correctAnswer: "a contrast between appearance and reality", explanation: "AP Lit MCQs often ask how shifts in imagery/diction develop theme or tone.", skill: "close reading" },
  ],
  "AP African American Studies": [
    { topic: "Freedom, enslavement, and resistance", prompt: "A primary source describes enslaved people slowing work, preserving family networks, and sharing information. Which interpretation is best supported?", choices: ["Resistance only occurred through armed rebellion", "Everyday resistance and community survival were important forms of agency", "Enslaved communities had no cultural continuity", "Resistance ended before the nineteenth century"], correctAnswer: "Everyday resistance and community survival were important forms of agency", explanation: "The evidence supports a broader interpretation of resistance beyond only open revolt.", skill: "source analysis" },
  ],
  "AP Comparative Government and Politics": [
    { topic: "Political institutions", prompt: "A parliamentary system differs from a presidential system mainly because", choices: ["the executive is typically chosen from and dependent on the legislature", "courts do not exist", "citizens cannot vote", "political parties are banned"], correctAnswer: "the executive is typically chosen from and dependent on the legislature", explanation: "In parliamentary systems, the executive normally depends on legislative confidence.", skill: "comparative reasoning" },
  ],
  "AP European History": [
    { topic: "Scientific Revolution and Enlightenment", prompt: "Which development best reflects Enlightenment political thought?", choices: ["Divine-right absolutism became unquestioned", "Natural rights and consent of the governed were used to challenge monarchy", "Feudal obligations expanded across Western Europe", "The printing press disappeared from political debate"], correctAnswer: "Natural rights and consent of the governed were used to challenge monarchy", explanation: "Enlightenment thinkers used reason, natural rights, and social contract ideas to critique traditional authority.", skill: "causation" },
  ],
  "AP Human Geography": [
    { topic: "Population and migration", prompt: "A country with a wide base and narrow top on its population pyramid most likely has", choices: ["high birth rates and rapid population growth", "negative natural increase", "a very old population with few children", "zero dependency ratio"], correctAnswer: "high birth rates and rapid population growth", explanation: "A wide base means a large young population, which usually indicates high birth rates.", skill: "data analysis" },
  ],
  "AP Macroeconomics": [
    { topic: "Financial sector", prompt: "If the central bank buys government bonds in an open-market operation, what is the short-run effect in the money market?", choices: ["Money supply increases and nominal interest rates fall", "Money supply decreases and nominal interest rates rise", "Aggregate demand immediately decreases", "The reserve requirement automatically rises"], correctAnswer: "Money supply increases and nominal interest rates fall", explanation: "Buying bonds injects reserves into the banking system, increasing money supply and lowering nominal interest rates in the money market.", skill: "policy analysis" },
  ],
  "AP Microeconomics": [
    { topic: "Supply and demand", prompt: "If the price of a normal good's substitute decreases, what happens to demand for the original good?", choices: ["Demand decreases", "Demand increases", "Supply increases", "Quantity demanded increases because of movement along the curve"], correctAnswer: "Demand decreases", explanation: "When a substitute becomes cheaper, consumers switch away from the original good, shifting its demand curve left.", skill: "market model reasoning" },
  ],
  "AP Psychology": [
    { topic: "Biological bases", prompt: "Damage to the hippocampus would most directly impair a person's ability to", choices: ["form new explicit memories", "detect color in the retina", "regulate breathing through the medulla", "produce insulin"], correctAnswer: "form new explicit memories", explanation: "The hippocampus is central to forming new explicit/declarative memories.", skill: "term application" },
  ],
  "AP United States Government and Politics": [
    { topic: "Civil liberties and civil rights", prompt: "The incorporation doctrine is best described as the process by which", choices: ["the Bill of Rights is applied to the states through the Fourteenth Amendment", "Congress creates all federal courts", "interest groups endorse candidates", "states nullify federal law"], correctAnswer: "the Bill of Rights is applied to the states through the Fourteenth Amendment", explanation: "Selective incorporation uses the Fourteenth Amendment's due process clause to apply many Bill of Rights protections to states.", skill: "SCOTUS comparison" },
  ],
  "AP United States History": [
    { topic: "1890-1945", prompt: "The growth of trusts and monopolies in the late nineteenth century most directly contributed to", choices: ["support for Progressive Era regulation of business", "the immediate end of industrial capitalism", "the disappearance of labor unions", "a return to subsistence farming"], correctAnswer: "support for Progressive Era regulation of business", explanation: "Concerns about corporate power helped fuel Progressive reforms such as antitrust enforcement and regulation.", skill: "stimulus MCQ" },
  ],
  "AP World History: Modern": [
    { topic: "Networks of Exchange", prompt: "The spread of technologies, crops, and diseases across Afro-Eurasian trade routes before 1450 best illustrates", choices: ["cultural and biological diffusion through interregional exchange", "the complete isolation of empires", "the absence of commercial networks", "the end of nomadic influence"], correctAnswer: "cultural and biological diffusion through interregional exchange", explanation: "Trade networks like the Silk Roads and Indian Ocean routes moved goods, ideas, technologies, and diseases.", skill: "continuity and change" },
  ],
  "AP Calculus AB": [
    { topic: "Derivatives", prompt: "If f(x)=3x^2-4x+1, what is f'(x)?", choices: ["6x-4", "3x-4", "6x+1", "x^3-2x^2+x"], correctAnswer: "6x-4", explanation: "Use the power rule: derivative of 3x^2 is 6x, derivative of -4x is -4, and derivative of a constant is 0.", skill: "symbolic manipulation" },
  ],
  "AP Calculus BC": [
    { topic: "Infinite sequences and series", prompt: "For the series Σ(3/4)^n from n=0 to infinity, what is the sum?", choices: ["4", "3/4", "1/4", "The series diverges"], correctAnswer: "4", explanation: "This is a geometric series with first term 1 and ratio 3/4. The sum is 1/(1-3/4)=4.", skill: "series tests" },
  ],
  "AP Computer Science A": [
    { topic: "Iteration", prompt: "What is printed by this Java code? int sum=0; for(int i=1;i<=3;i++){sum+=i;} System.out.print(sum);", choices: ["3", "5", "6", "7"], correctAnswer: "6", explanation: "The loop adds 1+2+3, so sum becomes 6.", skill: "Java tracing" },
  ],
  "AP Computer Science Principles": [
    { topic: "Algorithms and programming", prompt: "A procedure is called with the same input and always returns the same output. This is an example of", choices: ["deterministic behavior", "lossy compression", "phishing", "parallel computing"], correctAnswer: "deterministic behavior", explanation: "A deterministic algorithm produces the same result from the same input each time.", skill: "algorithm reasoning" },
  ],
  "AP Precalculus": [
    { topic: "Exponential and logarithmic functions", prompt: "Which equation is equivalent to log_2(32)=5?", choices: ["2^5=32", "5^2=32", "32^2=5", "2/32=5"], correctAnswer: "2^5=32", explanation: "A logarithm states the exponent needed: log base 2 of 32 equals 5 means 2 raised to the 5th power is 32.", skill: "function analysis" },
  ],
  "AP Statistics": [
    { topic: "Collecting data", prompt: "A study randomly assigns volunteers to either a new study method or a traditional study method. What conclusion can the design best support?", choices: ["A cause-and-effect conclusion if conditions are met", "Only a correlation because assignment was random", "A census of all students", "No comparison between groups"], correctAnswer: "A cause-and-effect conclusion if conditions are met", explanation: "Random assignment in an experiment helps support causal conclusions.", skill: "experimental design" },
  ],
  "AP Biology": [
    { topic: "Cellular energetics", prompt: "During cellular respiration, most ATP is produced during", choices: ["oxidative phosphorylation", "glycolysis only", "the Calvin cycle", "DNA replication"], correctAnswer: "oxidative phosphorylation", explanation: "The electron transport chain and chemiosmosis produce most ATP in aerobic respiration.", skill: "concept modeling" },
  ],
  "AP Chemistry": [
    { topic: "Acids and bases", prompt: "A solution has [H+] = 1.0 × 10^-3 M. What is its pH?", choices: ["3", "7", "10", "11"], correctAnswer: "3", explanation: "pH = -log[H+]. Since [H+] = 10^-3, pH = 3.", skill: "stoichiometry" },
  ],
  "AP Environmental Science": [
    { topic: "Populations", prompt: "A population grows fastest when", choices: ["resources are abundant and limiting factors are minimal", "birth rate is lower than death rate", "carrying capacity has been exceeded for many generations", "emigration is greater than immigration and births combined"], correctAnswer: "resources are abundant and limiting factors are minimal", explanation: "Rapid population growth occurs when resources are plentiful and limiting factors are weak.", skill: "environmental systems" },
  ],
  "AP Physics 2: Algebra-Based": [
    { topic: "Electric circuits", prompt: "Two identical resistors are connected in parallel to a battery. Compared with one resistor alone, the equivalent resistance is", choices: ["smaller", "larger", "the same", "infinite"], correctAnswer: "smaller", explanation: "Parallel resistors provide multiple paths for current, decreasing equivalent resistance.", skill: "calculation setup" },
  ],
  "AP Physics C: Electricity and Magnetism": [
    { topic: "Electrostatics", prompt: "The electric field at distance r from a point charge Q has magnitude proportional to", choices: ["1/r^2", "r^2", "1/r", "r"], correctAnswer: "1/r^2", explanation: "Coulomb's law gives E = kQ/r^2 for a point charge.", skill: "calculus-based physics" },
  ],
  "AP Physics C: Mechanics": [
    { topic: "Kinematics", prompt: "If x(t)=4t^3, which expression gives velocity as a function of time?", choices: ["12t^2", "4t^2", "12t", "t^4"], correctAnswer: "12t^2", explanation: "Velocity is dx/dt. The derivative of 4t^3 is 12t^2.", skill: "calculus-based mechanics" },
  ],
  "AP Chinese Language and Culture": [
    { topic: "Families and communities", prompt: "In an AP Chinese email reply, which response choice best matches the task?", choices: ["Answer the sender's questions, use appropriate register, and ask for needed follow-up information", "Write only unrelated vocabulary words", "Ignore the prompt and describe a different theme", "Use English for most of the response"], correctAnswer: "Answer the sender's questions, use appropriate register, and ask for needed follow-up information", explanation: "AP language email/reply tasks reward task completion, register, organization, and appropriate language.", skill: "interpersonal writing" },
  ],
  "AP French Language and Culture": [
    { topic: "Contemporary life", prompt: "For the AP French persuasive essay, which source use is strongest?", choices: ["Accurately refer to all sources and connect them to a clear argument", "Ignore the audio source", "Copy one phrase repeatedly", "Use only personal opinion with no source evidence"], correctAnswer: "Accurately refer to all sources and connect them to a clear argument", explanation: "The persuasive essay requires integrating sources into a defensible argument.", skill: "persuasive essay" },
  ],
  "AP German Language and Culture": [
    { topic: "Contemporary life", prompt: "In an AP German email reply, which element is most important?", choices: ["Responding directly to the prompt with appropriate greeting, register, and details", "Writing a memorized essay on any topic", "Avoiding all German verbs", "Listing vocabulary without sentences"], correctAnswer: "Responding directly to the prompt with appropriate greeting, register, and details", explanation: "Email replies are graded on communication, task completion, and appropriate language use.", skill: "email reply" },
  ],
  "AP Italian Language and Culture": [
    { topic: "Global challenges", prompt: "In a cultural comparison response, the strongest answer should", choices: ["compare a specific Italian-speaking community with the student's own or another community", "only translate the prompt", "avoid cultural examples", "speak for two seconds and stop"], correctAnswer: "compare a specific Italian-speaking community with the student's own or another community", explanation: "Cultural comparison tasks require specific cultural evidence and comparison.", skill: "cultural comparison" },
  ],
  "AP Japanese Language and Culture": [
    { topic: "Personal and public identities", prompt: "For an AP Japanese interpersonal speaking task, which approach is strongest?", choices: ["Respond to each turn with appropriate register and relevant detail", "Wait silently until the task ends", "Use only isolated English words", "Memorize one sentence and repeat it for every prompt"], correctAnswer: "Respond to each turn with appropriate register and relevant detail", explanation: "Conversation tasks reward relevant responses, register, comprehensibility, and interaction.", skill: "conversation" },
  ],
  "AP Latin": [
    { topic: "Translation", prompt: "In a Latin translation question, a finite verb's person and number mainly tell you", choices: ["the subject implied by the verb", "the color of the manuscript", "the date of publication", "the meter of every line automatically"], correctAnswer: "the subject implied by the verb", explanation: "Latin verb endings encode person and number, which help identify the subject.", skill: "grammar parsing" },
  ],
  "AP Spanish Language and Culture": [
    { topic: "Families and communities", prompt: "In an AP Spanish email reply, which opening is most appropriate for a formal message?", choices: ["Estimado/a señor/a:", "Qué onda bro", "lol no sé", "bye"], correctAnswer: "Estimado/a señor/a:", explanation: "A formal email reply should use an appropriate formal greeting and register.", skill: "email reply" },
  ],
  "AP Spanish Literature and Culture": [
    { topic: "Literary analysis", prompt: "A question asks how a metaphor contributes to theme. The best answer should", choices: ["identify the metaphor and explain how it develops the work's meaning", "summarize the author's biography only", "translate one word and stop", "ignore textual evidence"], correctAnswer: "identify the metaphor and explain how it develops the work's meaning", explanation: "AP Spanish Literature analysis requires textual evidence connected to interpretation.", skill: "literary analysis" },
  ],
  "AP Research": [
    { topic: "Methodology", prompt: "A strong AP Research method section should primarily", choices: ["explain how data were collected and why the method fits the research question", "hide limitations", "list sources without analysis", "change the research question after results"], correctAnswer: "explain how data were collected and why the method fits the research question", explanation: "Methodology must align with the research question and allow the reader to evaluate credibility.", skill: "research design" },
  ],
  "AP Seminar": [
    { topic: "Evaluate multiple perspectives", prompt: "A source has strong credentials but was funded by an organization with a clear stake in the outcome. The best AP Seminar evaluation would", choices: ["use the source but discuss possible bias or limitations", "automatically reject every claim", "ignore the funding source", "cite it as neutral proof without commentary"], correctAnswer: "use the source but discuss possible bias or limitations", explanation: "AP Seminar rewards nuanced source evaluation, not blind acceptance or automatic rejection.", skill: "source evaluation" },
  ],
  "AP Business with Personal Finance": [
    { topic: "Personal finance", prompt: "A student pays only the minimum on a high-interest credit card. What is the most likely result?", choices: ["Total interest paid increases over time", "The loan disappears immediately", "The interest rate becomes zero", "Credit utilization is never affected"], correctAnswer: "Total interest paid increases over time", explanation: "Paying only the minimum on high-interest debt usually extends repayment and increases total interest.", skill: "financial reasoning" },
  ],
  "AP Cybersecurity": [
    { topic: "Threats and vulnerabilities", prompt: "A user receives an email pretending to be their bank and asking them to enter a password on a fake site. This is an example of", choices: ["phishing", "symmetric encryption", "load balancing", "packet switching only"], correctAnswer: "phishing", explanation: "Phishing uses deceptive messages to trick users into revealing sensitive information.", skill: "security reasoning" },
  ],
};

function categoryFallback(course: CourseInfo, selectedUnit: string, index: number): StarterSeed {
  const variants: Record<CourseCategory, StarterSeed[]> = {
    Arts: [
      { topic: "Portfolio scoring", prompt: `A portfolio investigation about ${selectedUnit} includes final images but little evidence of experimentation. What is the strongest improvement?`, choices: ["Add process images and revisions that show how visual choices changed", "Submit fewer works with no explanation", "Use unrelated work to fill space", "Only write that the idea is important"], correctAnswer: "Add process images and revisions that show how visual choices changed", explanation: "Portfolio courses reward inquiry, process, revision, and visual evidence.", skill: "portfolio development" },
      { topic: "Visual evidence", prompt: `A student claims a work explores ${selectedUnit}. Which evidence best supports the claim?`, choices: ["Specific visual choices in form, composition, material, or mark-making", "A vague title only", "A random artist quote", "The length of the written statement"], correctAnswer: "Specific visual choices in form, composition, material, or mark-making", explanation: "AP art responses need claims backed by visible evidence in the work.", skill: "visual analysis" },
      { topic: "Revision process", prompt: `Two works in a ${selectedUnit} investigation use the same idea, but the second changes scale, material, and composition. What does this best show?`, choices: ["Intentional revision through visual experimentation", "A lack of sustained inquiry", "A random change with no possible meaning", "Only technical copying"], correctAnswer: "Intentional revision through visual experimentation", explanation: "AP portfolio scoring values purposeful development and experimentation across works.", skill: "process documentation" },
      { topic: "Selected works", prompt: `For a Selected Works submission, which choice would most strengthen the score?`, choices: ["A work with clear skill, intentional composition, and resolved visual relationships", "A quick sketch unrelated to the portfolio", "A blurry process photo only", "A written statement with no visual evidence"], correctAnswer: "A work with clear skill, intentional composition, and resolved visual relationships", explanation: "Selected Works are scored for quality, skill, and intentional visual decision-making.", skill: "composition" },
    ],
    English: [
      { topic: "Close reading", prompt: `A passage shifts from calm imagery to violent diction. What is the most likely effect?`, choices: ["It signals a change in tone or conflict", "It proves the narrator is always objective", "It removes all ambiguity", "It only gives historical dates"], correctAnswer: "It signals a change in tone or conflict", explanation: "AP English MCQs often test how diction and imagery create tone, contrast, or theme.", skill: "close reading" },
      { topic: "Evidence/commentary", prompt: `Which sentence would best improve an AP essay body paragraph?`, choices: ["A sentence explaining how the evidence proves the claim", "A second quote with no explanation", "A vague statement that the author is good", "A plot summary unrelated to the thesis"], correctAnswer: "A sentence explaining how the evidence proves the claim", explanation: "AP essays earn points through commentary that connects evidence to the argument.", skill: "commentary" },
      { topic: "Rhetorical effect", prompt: `A writer uses short, repeated sentences after a long descriptive paragraph. The most likely effect is to`, choices: ["create emphasis and a sharper shift in pace", "remove the author's claim", "prove the passage is fiction", "replace evidence with statistics"], correctAnswer: "create emphasis and a sharper shift in pace", explanation: "Sentence structure can control pace, emphasis, and tone.", skill: "rhetorical analysis" },
      { topic: "Thesis", prompt: `Which thesis is strongest for an AP literary/rhetorical essay?`, choices: ["A defensible claim that names a technique or idea and explains its function", "A one-word topic", "A plot summary with no claim", "A vague compliment about the author"], correctAnswer: "A defensible claim that names a technique or idea and explains its function", explanation: "AP essays need a defensible interpretation, not just summary.", skill: "thesis" },
    ],
    "History and Social Sciences": [
      { topic: "Stimulus MCQ", prompt: `A source argues that government power expanded during a crisis. Which follow-up question best matches AP historical/social-science reasoning?`, choices: ["What evidence shows the cause and effect of that expansion?", "How long is the paragraph?", "Can the source be ignored because it is old?", "Which answer choice uses the most words?"], correctAnswer: "What evidence shows the cause and effect of that expansion?", explanation: "AP social science questions reward claims supported by evidence, causation, comparison, and context.", skill: "source analysis" },
      { topic: "Data interpretation", prompt: `A graph shows unemployment rising while output falls. Which conclusion is best supported?`, choices: ["The economy is likely moving toward recessionary conditions", "Inflation must be exactly zero", "All firms are monopolies", "The data prove nothing can be inferred"], correctAnswer: "The economy is likely moving toward recessionary conditions", explanation: "Use the data pattern to make a limited, supported inference.", skill: "data analysis" },
      { topic: "Causation", prompt: `In a ${selectedUnit} question, a reform movement grows after rapid social change. Which reasoning best explains the relationship?`, choices: ["Social change can create problems that reformers try to address", "Reform movements never respond to social conditions", "Only geography can cause reform", "Causation requires events to be unrelated"], correctAnswer: "Social change can create problems that reformers try to address", explanation: "AP history and social science questions often test cause-and-effect reasoning.", skill: "causation" },
      { topic: "Contextualization", prompt: `A political document from a period of conflict is best understood by first considering`, choices: ["the broader events and debates happening when it was written", "only the number of words", "whether the paper looks old", "the document's font size"], correctAnswer: "the broader events and debates happening when it was written", explanation: "Context helps explain why a source was created and what arguments it responds to.", skill: "contextualization" },
    ],
    "Math and Computer Science": [
      { topic: "Function analysis", prompt: `If f(x)=2x+5, what is f(3)?`, choices: ["11", "10", "8", "6"], correctAnswer: "11", explanation: "Substitute x=3: f(3)=2(3)+5=11.", skill: "symbolic manipulation" },
      { topic: "Algorithm tracing", prompt: `A loop adds the integers 1 through 4 to a variable starting at 0. What is the final value?`, choices: ["10", "4", "6", "11"], correctAnswer: "10", explanation: "1+2+3+4=10.", skill: "algorithm reasoning" },
      { topic: "Rate of change", prompt: `A function has slope 3 at x=2. Which statement is true?`, choices: ["The instantaneous rate of change at x=2 is 3", "The function value must be 3", "The graph must be horizontal", "The input cannot be 2"], correctAnswer: "The instantaneous rate of change at x=2 is 3", explanation: "Slope/derivative represents instantaneous rate of change.", skill: "graph analysis" },
      { topic: "Probability", prompt: `If two independent events have probabilities 0.4 and 0.5, what is the probability both occur?`, choices: ["0.20", "0.90", "0.45", "0.10"], correctAnswer: "0.20", explanation: "For independent events, multiply probabilities: 0.4 × 0.5 = 0.20.", skill: "probability" },
    ],
    Sciences: [
      { topic: "Experimental design", prompt: `A student changes temperature and measures reaction rate while keeping concentration constant. What is the independent variable?`, choices: ["temperature", "reaction rate", "container label", "time of day only"], correctAnswer: "temperature", explanation: "The independent variable is what the student intentionally changes.", skill: "experimental design" },
      { topic: "Data reasoning", prompt: `A graph shows a direct linear relationship passing through the origin. Which statement is best supported?`, choices: ["The variables are proportional", "The variables are unrelated", "The slope is always zero", "The y-variable is constant"], correctAnswer: "The variables are proportional", explanation: "A straight line through the origin indicates proportionality.", skill: "data analysis" },
      { topic: "Claim-evidence-reasoning", prompt: `An experiment produces data that partly contradicts the hypothesis. What should a strong AP science answer do?`, choices: ["Use the data to revise or qualify the claim", "Delete the data", "Pick the hypothesis regardless of evidence", "Avoid mentioning uncertainty"], correctAnswer: "Use the data to revise or qualify the claim", explanation: "AP science scoring rewards claims supported by actual evidence and reasoning.", skill: "data analysis" },
      { topic: "Variables and controls", prompt: `A student changes both light intensity and temperature while measuring plant growth. What is the main design flaw?`, choices: ["More than one independent variable was changed", "No dependent variable exists", "The experiment has too many trials", "The data must be linear"], correctAnswer: "More than one independent variable was changed", explanation: "Changing multiple variables makes it hard to determine the cause of the effect.", skill: "experimental design" },
    ],
    "World Languages and Cultures": [
      { topic: "Interpretive communication", prompt: `An email asks two questions about ${selectedUnit}. Which response best completes the task?`, choices: ["Answer both questions with relevant details and appropriate register", "Answer only with a greeting", "Switch mostly to English", "Ignore the questions and write about another topic"], correctAnswer: "Answer both questions with relevant details and appropriate register", explanation: "AP language tasks reward task completion, comprehensibility, register, and relevant detail.", skill: "interpersonal communication" },
      { topic: "Cultural comparison", prompt: `A cultural comparison prompt asks about ${selectedUnit}. What must a high-scoring response include?`, choices: ["A specific comparison between communities with supporting details", "Only a list of isolated vocabulary", "No cultural example", "A memorized response unrelated to the prompt"], correctAnswer: "A specific comparison between communities with supporting details", explanation: "Cultural comparison responses require specific evidence and comparison.", skill: "cultural comparison" },
    ],
    "AP Capstone": [
      { topic: "Source evaluation", prompt: `A source is relevant but has a clear funding bias. What should a strong AP Capstone response do?`, choices: ["Use it carefully while explaining credibility and limitations", "Ignore bias entirely", "Use only the title", "Reject every source with any limitation"], correctAnswer: "Use it carefully while explaining credibility and limitations", explanation: "Capstone work rewards nuanced evaluation of credibility, relevance, and limitations.", skill: "source evaluation" },
      { topic: "Line of reasoning", prompt: `A paper has evidence but no explanation connecting it to the claim. What is missing?`, choices: ["Commentary/line of reasoning", "A longer title only", "More font changes", "A random counterclaim with no evidence"], correctAnswer: "Commentary/line of reasoning", explanation: "Evidence needs explanation that links it to the argument.", skill: "argument synthesis" },
    ],
    "AP Career Kickstart": [
      { topic: "Scenario reasoning", prompt: `A company identifies a likely threat and estimates its potential impact before choosing safeguards. This is an example of`, choices: ["risk assessment", "random guessing", "brand awareness only", "deleting all records"], correctAnswer: "risk assessment", explanation: "Risk assessment identifies threats, likelihood, impact, and possible controls.", skill: "risk evaluation" },
      { topic: "Decision analysis", prompt: `A business compares expected revenue, cost, and risk before launching a product. Which skill is being used?`, choices: ["evidence-based decision-making", "ignoring constraints", "memorization only", "unrelated formatting"], correctAnswer: "evidence-based decision-making", explanation: "Business decisions should use costs, benefits, risks, and evidence.", skill: "business analysis" },
    ],
  };
  const options = variants[course.category] || variants["History and Social Sciences"];
  return options[index % options.length];
}

export function buildStarterQuestion(courseName: Course, unit?: string, variant = 0): Question {
  const course = getCourseInfo(courseName);
  const selectedUnit = unit || course.units[variant % course.units.length] || course.units[0];
  const bank = authenticStarterBank[course.name] || [];
  const seed = bank[variant] || categoryFallback(course, selectedUnit, variant);
  const finalUnit = seed.unit || selectedUnit;
  const skill = seed.skill || course.skills[variant % course.skills.length] || "AP reasoning";
  return {
    id: `starter-${starterSlug(course.name)}-${starterSlug(finalUnit)}-${variant}`,
    course: course.name,
    unit: finalUnit,
    topic: seed.topic,
    difficulty: seed.difficulty || "medium",
    skill,
    type: "MCQ",
    prompt: seed.prompt,
    choices: seed.choices,
    correctAnswer: seed.correctAnswer,
    explanation: seed.explanation,
    commonMistake: seed.commonMistake || "Choosing a vague strategy answer instead of using the actual course concept or evidence in the prompt.",
    mistakeType: seed.mistakeType || (course.category === "Math and Computer Science" || course.category === "Sciences" ? "Conceptual misunderstanding" : "Evidence selection"),
  };
}

export function buildStarterQuestions(courseName: Course, unit?: string, count = 5): Question[] {
  return Array.from({ length: count }, (_, index) => buildStarterQuestion(courseName, unit || unitsForCourse(courseName)[index % unitsForCourse(courseName).length], index));
}

export function buildCourseFRQPrompt(courseName: Course, unit?: string): FRQPrompt {
  const course = getCourseInfo(courseName);
  const selectedUnit = unit || course.units[0];
  return {
    id: `frq-${course.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${selectedUnit.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
    course: course.name,
    unit: selectedUnit,
    topic: course.frqLabel,
    points: 6,
    prompt: `Write a short AP-style response for ${course.name} about ${selectedUnit}. Make a clear claim, use course-specific evidence or reasoning, and explain why that evidence supports your answer.`,
    rubric: [
      "Makes a clear, defensible claim that answers the prompt",
      `Accurately uses a relevant concept from ${selectedUnit}`,
      "Supports the claim with specific evidence, data, calculation, source detail, or example",
      "Explains the reasoning instead of only naming facts",
      "Uses course-specific vocabulary accurately",
      "Organizes the response clearly enough for an AP-style reader to follow",
    ],
    modelAnswer: `A full-credit response would directly answer the prompt, use a precise ${course.name} concept from ${selectedUnit}, support it with specific evidence or reasoning, and explicitly connect that evidence back to the claim.`,
  };
}
