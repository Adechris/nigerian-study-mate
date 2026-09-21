import type { QuizAttempt, StudyDoc, User } from "@/types";

const day = (n: number) => new Date(Date.now() - n * 86400000).toISOString();

export const DEMO_EMAIL = "chisom@studypal.ng";
export const DEMO_PASSWORD = "studypal123";

export const demoUser: User = {
  id: "demo-user",
  name: "Chisom Eze",
  email: DEMO_EMAIL,
  password: DEMO_PASSWORD,
  examLevel: "WAEC/NECO Candidate",
  school: "Command Secondary School, Enugu",
  state: "Enugu",
  plan: "free",
  preferences: {
    quizCount: 10,
    examStyle: "WAEC",
    responseStyle: "Simple English",
    dailyReminder: true,
    reminderTime: "18:00",
    weeklyEmail: false,
  },
};

export const demoDocs: StudyDoc[] = [
  {
    id: "doc-bio",
    name: "SS3 Biology — Photosynthesis & Respiration.pdf",
    subject: "Biology",
    examLevel: "WAEC/NECO Candidate",
    pages: 18,
    sizeKb: 940,
    studyCount: 12,
    createdAt: day(14),
    lastStudiedAt: day(0),
    text: `PHOTOSYNTHESIS AND RESPIRATION — SS3 BIOLOGY NOTES

1. Photosynthesis is the process by which green plants manufacture their own food (glucose) using carbon dioxide and water in the presence of sunlight and chlorophyll.
Equation: 6CO2 + 6H2O --sunlight/chlorophyll--> C6H12O6 + 6O2.
Site: the chloroplast. The chloroplast contains chlorophyll housed in stacked thylakoid membranes (grana) surrounded by the stroma.

2. Stages of photosynthesis:
(a) Light dependent stage (in the thylakoid) — light energy splits water (photolysis) producing oxygen, ATP and NADPH.
(b) Light independent stage / Calvin cycle (in the stroma) — carbon dioxide is fixed using ATP and NADPH to form glucose.

3. Factors affecting the rate of photosynthesis: light intensity, carbon dioxide concentration, temperature, chlorophyll content and water availability. These are limiting factors.

4. Respiration is the breakdown of food substances to release energy in the form of ATP.
Aerobic respiration: C6H12O6 + 6O2 -> 6CO2 + 6H2O + 38 ATP, occurring mainly in the mitochondria.
Anaerobic respiration in muscles produces lactic acid; in yeast it produces ethanol and carbon dioxide (fermentation, used in local brewing and bread making).

5. Differences between photosynthesis and respiration: photosynthesis builds food, stores energy, occurs in light, in chloroplasts; respiration breaks down food, releases energy, occurs day and night, in mitochondria.

6. Compensation point: the point at which the rate of photosynthesis equals the rate of respiration so there is no net gas exchange.

7. Experiments: testing a leaf for starch (boil in water, decolourise in alcohol, add iodine — blue-black shows starch); destarching a plant by keeping it in the dark for 48 hours; using a variegated leaf to prove chlorophyll is necessary.`,
  },
  {
    id: "doc-chem",
    name: "Chemistry — Chemical Bonding & Periodicity.pdf",
    subject: "Chemistry",
    examLevel: "WAEC/NECO Candidate",
    pages: 22,
    sizeKb: 1180,
    studyCount: 7,
    createdAt: day(11),
    lastStudiedAt: day(2),
    text: `CHEMICAL BONDING AND PERIODICITY

1. A chemical bond is the force of attraction holding atoms together in a compound. Atoms bond to attain a stable noble gas (octet) configuration.

2. Types of bonds:
(a) Ionic (electrovalent) bond — formed by complete transfer of electrons from a metal to a non-metal, e.g. NaCl, MgO. Properties: high melting point, conduct electricity in molten or aqueous state, soluble in water.
(b) Covalent bond — formed by sharing of electrons between non-metals, e.g. H2O, CH4, CO2. Properties: low melting point, mostly non conductors, soluble in organic solvents.
(c) Co-ordinate (dative) bond — the shared pair comes from one atom only, e.g. NH4+, H3O+.
(d) Metallic bond — attraction between positive metal ions and a sea of delocalised electrons.
(e) Hydrogen bond — weak attraction between hydrogen and a highly electronegative atom (F, O, N). Explains the high boiling point of water.
(f) Van der Waals forces — weak forces between non-polar molecules.

3. Periodicity: across a period atomic radius decreases, ionisation energy increases, electronegativity increases and metallic character decreases. Down a group atomic radius increases, ionisation energy decreases and metallic character increases.

4. Electronegativity difference greater than 1.7 usually gives an ionic bond; less than 1.7 gives a polar covalent bond.

5. Shapes of molecules: linear (CO2), bent (H2O), trigonal planar (BF3), tetrahedral (CH4), pyramidal (NH3).`,
  },
  {
    id: "doc-math",
    name: "Further Mathematics — Calculus Basics.pdf",
    subject: "Mathematics",
    examLevel: "JAMB Candidate",
    pages: 16,
    sizeKb: 760,
    studyCount: 9,
    createdAt: day(8),
    lastStudiedAt: day(1),
    text: `CALCULUS BASICS — DIFFERENTIATION AND INTEGRATION

1. Differentiation measures the rate of change of a function. If y = x^n then dy/dx = n x^(n-1).
2. Rules: sum rule, product rule (d(uv) = u dv + v du), quotient rule, chain rule dy/dx = dy/du * du/dx.
3. Derivatives of standard functions: d(sin x) = cos x, d(cos x) = -sin x, d(e^x) = e^x, d(ln x) = 1/x.
4. Applications: gradient of a curve at a point, equations of tangents and normals, maximum and minimum points (turning points where dy/dx = 0; second derivative positive means minimum, negative means maximum), rate of change problems, velocity and acceleration where v = ds/dt and a = dv/dt.
5. Integration is the reverse of differentiation. Integral of x^n dx = x^(n+1)/(n+1) + c for n not equal to -1.
6. Definite integrals give the area under a curve between two limits. Area = integral from a to b of y dx.
7. Common JAMB style questions: find dy/dx of a polynomial, find the maximum value of a quadratic, evaluate a definite integral, find the area bounded by a curve and the x-axis.`,
  },
  {
    id: "doc-phy",
    name: "Physics — Electricity and Magnetism.pdf",
    subject: "Physics",
    examLevel: "WAEC/NECO Candidate",
    pages: 20,
    sizeKb: 1024,
    studyCount: 4,
    createdAt: day(6),
    lastStudiedAt: day(4),
    text: `ELECTRICITY AND MAGNETISM

1. Ohm's law: the current through a conductor is directly proportional to the potential difference across it provided temperature and other physical conditions remain constant. V = IR.
2. Resistors in series: R = R1 + R2 + R3. In parallel: 1/R = 1/R1 + 1/R2.
3. Electrical energy W = IVt and power P = IV = I^2 R = V^2/R. Cost of electricity is calculated in kilowatt-hours.
4. Electromagnetic induction: a changing magnetic flux linking a coil induces an e.m.f. Faraday's law states the induced e.m.f. is proportional to the rate of change of flux. Lenz's law states the induced current opposes the change producing it.
5. Transformers: Vs/Vp = Ns/Np. Step-up transformers increase voltage; step-down reduce it. Energy losses occur through eddy currents, hysteresis and copper losses.
6. Magnetic field of a current-carrying conductor is found using the right-hand grip rule; force on a conductor in a field uses Fleming's left-hand rule; induced current direction uses Fleming's right-hand rule.`,
  },
  {
    id: "doc-eng",
    name: "English Language — Comprehension & Summary.pdf",
    subject: "English",
    examLevel: "WAEC/NECO Candidate",
    pages: 12,
    sizeKb: 520,
    studyCount: 3,
    createdAt: day(3),
    lastStudiedAt: day(3),
    text: `ENGLISH LANGUAGE — COMPREHENSION AND SUMMARY WRITING

1. Comprehension tests your ability to read a passage and answer questions on meaning, inference, figures of speech and grammatical functions.
2. Steps: read the passage twice, underline key ideas, read every question before answering, answer in your own words, keep answers short and grammatical.
3. Grammatical name and function questions: identify the group of words (e.g. adjectival clause) and state what it does (e.g. it modifies the noun 'student').
4. Figures of speech commonly tested: simile, metaphor, personification, hyperbole, irony, euphemism, oxymoron, alliteration.
5. Summary writing: answer only what is asked, use one sentence per point unless told otherwise, do not copy whole sentences from the passage, avoid figurative language and examples.
6. Common WAEC pitfalls: lifting sentences wholesale, giving more points than required, and writing in note form.`,
  },
];

export const demoQuizzes: QuizAttempt[] = [
  {
    id: "q1",
    docId: "doc-bio",
    docName: demoDocs[0].name,
    subject: "Biology",
    examStyle: "WAEC",
    type: "mcq",
    score: 9,
    total: 10,
    percentage: 90,
    seconds: 412,
    takenAt: day(1),
    questions: [],
    answers: {},
    topic: "Photosynthesis",
  },
  {
    id: "q2",
    docId: "doc-chem",
    docName: demoDocs[1].name,
    subject: "Chemistry",
    examStyle: "WAEC",
    type: "mcq",
    score: 6,
    total: 10,
    percentage: 60,
    seconds: 505,
    takenAt: day(3),
    questions: [],
    answers: {},
    topic: "Chemical Bonding",
  },
  {
    id: "q3",
    docId: "doc-math",
    docName: demoDocs[2].name,
    subject: "Mathematics",
    examStyle: "JAMB",
    type: "mcq",
    score: 8,
    total: 10,
    percentage: 80,
    seconds: 620,
    takenAt: day(5),
    questions: [],
    answers: {},
    topic: "Differentiation",
  },
  {
    id: "q4",
    docId: "doc-phy",
    docName: demoDocs[3].name,
    subject: "Physics",
    examStyle: "WAEC",
    type: "mcq",
    score: 5,
    total: 10,
    percentage: 50,
    seconds: 540,
    takenAt: day(7),
    questions: [],
    answers: {},
    topic: "Electromagnetic Induction",
  },
  {
    id: "q5",
    docId: "doc-bio",
    docName: demoDocs[0].name,
    subject: "Biology",
    examStyle: "NECO",
    type: "theory",
    score: 7,
    total: 10,
    percentage: 70,
    seconds: 780,
    takenAt: day(9),
    questions: [],
    answers: {},
    topic: "Cell Division",
  },
  {
    id: "q6",
    docId: "doc-chem",
    docName: demoDocs[1].name,
    subject: "Chemistry",
    examStyle: "WAEC",
    type: "mcq",
    score: 7,
    total: 10,
    percentage: 70,
    seconds: 430,
    takenAt: day(12),
    questions: [],
    answers: {},
    topic: "Periodicity",
  },
];

export const STUDY_TIPS = [
  "Use the 'Generate Quiz' feature after reading each chapter to test yourself. Research shows testing improves memory by 50%!",
  "Past questions are gold. Ask StudyPal: 'What's most likely to come out in WAEC from this topic?'",
  "Study in 25-minute focused blocks with 5-minute breaks — the Pomodoro method works well before exams.",
  "Explain a topic out loud as if teaching a junior student. If you stumble, that's the part to revise.",
  "Revise your weakest subject first thing in the morning when your mind is freshest.",
];
