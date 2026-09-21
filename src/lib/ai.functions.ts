import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import {
  NIGERIAN_STUDENT_PROMPT,
  docContext,
  gatewayChat,
  parseJson,
  type GwMessage,
} from "./ai-gateway.server";
import type { GradeResult, Question } from "@/types";

const historySchema = z.array(
  z.object({ role: z.enum(["user", "assistant"]), content: z.string() }),
);

export const askAboutDocument = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) =>
    z
      .object({
        docName: z.string(),
        docText: z.string(),
        question: z.string().min(1),
        history: historySchema.default([]),
        responseStyle: z.string().default("Simple English"),
      })
      .parse(d),
  )
  .handler(async ({ data }) => {
    const messages: GwMessage[] = [
      {
        role: "system",
        content: `${NIGERIAN_STUDENT_PROMPT}\nPreferred response style: ${data.responseStyle}.\n\n${docContext(data.docName, data.docText)}`,
      },
      ...data.history.slice(-12),
      { role: "user", content: data.question },
    ];
    return { answer: await gatewayChat(messages) };
  });

export const generateQuestions = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) =>
    z
      .object({
        docName: z.string(),
        docText: z.string(),
        count: z.number().min(1).max(30),
        type: z.enum(["mcq", "theory"]),
        difficulty: z.enum(["Easy", "Medium", "Hard"]),
        examStyle: z.enum(["WAEC", "NECO", "JAMB", "University", "General"]),
        topic: z.string().optional(),
      })
      .parse(d),
  )
  .handler(async ({ data }) => {
    const prompt = `Based on the document, generate ${data.count} practice questions.

Question type: ${data.type}
Difficulty: ${data.difficulty}
Exam style: ${data.examStyle}
Topic: ${data.topic || "all topics"}

Return ONLY a valid JSON array. No markdown. No extra text.

For MCQ each item: {"id":"1","question":"...","type":"mcq","options":{"A":"...","B":"...","C":"...","D":"..."},"answer":"A","explanation":"why correct"}
For Theory each item: {"id":"1","question":"...","type":"theory","modelAnswer":"ideal answer","keyPoints":["point1","point2"]}`;

    const raw = await gatewayChat([
      { role: "system", content: NIGERIAN_STUDENT_PROMPT },
      { role: "user", content: `${docContext(data.docName, data.docText)}\n\n${prompt}` },
    ]);
    const questions = parseJson<Question[]>(raw).map((q, i) => ({ ...q, id: String(i + 1) }));
    return { questions };
  });

export const summarizeDocument = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) =>
    z
      .object({
        docName: z.string(),
        docText: z.string(),
        type: z.enum(["full", "topic", "keypoints", "examfocus"]),
        topic: z.string().optional(),
      })
      .parse(d),
  )
  .handler(async ({ data }) => {
    const prompts: Record<string, string> = {
      full: "Give a comprehensive summary of this entire document. Include key concepts, important points, and exam tips for Nigerian students.",
      topic: `Summarize ONLY the section about "${data.topic}" from this document. Include key points and exam tips.`,
      keypoints:
        "List ONLY the most important key points from this document that a Nigerian student must know for exams. Use bullet points.",
      examfocus:
        "Based on this document, tell me the most likely topics to appear in WAEC, NECO or JAMB exams. Explain each briefly.",
    };
    const content = await gatewayChat([
      { role: "system", content: NIGERIAN_STUDENT_PROMPT },
      {
        role: "user",
        content: `${docContext(data.docName, data.docText)}\n\n${prompts[data.type]}`,
      },
    ]);
    return { content };
  });

export const gradeTheoryAnswer = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) =>
    z
      .object({
        question: z.string(),
        modelAnswer: z.string().default(""),
        studentAnswer: z.string(),
        keyPoints: z.array(z.string()).default([]),
      })
      .parse(d),
  )
  .handler(async ({ data }) => {
    const prompt = `Grade this student's answer.

Question: ${data.question}

Model Answer: ${data.modelAnswer}

Key Points Required:
${data.keyPoints.map((p, i) => `${i + 1}. ${p}`).join("\n")}

Student's Answer: ${data.studentAnswer}

Return ONLY valid JSON:
{"score":7,"maxScore":10,"percentage":70,"grade":"B","feedback":"...","pointsHit":["..."],"pointsMissed":["..."],"improvement":"..."}`;

    const raw = await gatewayChat([
      { role: "system", content: NIGERIAN_STUDENT_PROMPT },
      { role: "user", content: prompt },
    ]);
    return { grade: parseJson<GradeResult>(raw) };
  });
