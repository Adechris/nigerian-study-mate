# StudyPal AI

Build **StudyPal** — a clean, modern AI-powered 
student study assistant web application. 

NO public website. NO landing page.
The app starts directly at a Login/Register screen 
and goes straight into the study dashboard.

Powered by **Google Gemini API (gemini-1.5-flash)** 
— completely free tier.

Target users: Nigerian secondary school and 
university students preparing for WAEC, NECO, 
JAMB, and university examinations.

Design: Clean, modern, friendly — purple and white.
Feels like a premium EdTech product.
Think Notion × ChatGPT × Nigerian student app.

---

## ⚙️ FRONTEND ARCHITECTURE

- React + TypeScript + Vite
- React Router v6
  (createBrowserRouter,
   protected routes,
   nested layouts)
- All API calls in
  `/src/services/api.ts`
- Gemini AI calls in
  `/src/services/geminiAI.ts`
- Base URL from `.env`:
  `VITE_API_BASE_URL`
  `VITE_GEMINI_API_KEY`
- TanStack Query for
  all data fetching
- Axios with Bearer
  token interceptor
- Zustand for auth +
  chat state
- Realistic Nigerian
  dummy data in `/src/mock/`
- Skeleton loaders on
  all data components
- Sonner toast notifications
- Framer Motion animations
- Fully mobile responsive

### Gemini API Integration
```javascript
// /src/services/geminiAI.ts

import { GoogleGenerativeAI }
  from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(
  import.meta.env.VITE_GEMINI_API_KEY
);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash"
});

// Chat with uploaded document
export const askAboutDocument = async (
  pdfBase64: string,
  mimeType: string,
  question: string,
  history: ChatMessage[]
): Promise<string> => {

  const chat = model.startChat({
    history: history.map(msg => ({
      role: msg.role,
      parts: [{ text: msg.content }]
    })),
    systemInstruction: NIGERIAN_STUDENT_PROMPT
  });

  const result = await chat.sendMessage([
    {
      inlineData: {
        mimeType: mimeType,
        data: pdfBase64
      }
    },
    { text: question }
  ]);

  return result.response.text();
};

// Generate practice questions
export const generateQuestions = async (
  pdfBase64: string,
  mimeType: string,
  options: QuizOptions
): Promise<Question[]> => {

  const prompt = `
    Based on this document, generate
    ${options.count} practice questions.
    
    Question type: ${options.type}
    Difficulty: ${options.difficulty}
    Exam style: ${options.examStyle}
    Topic: ${options.topic || 'all topics'}
    
    Return ONLY valid JSON array.
    No markdown. No extra text.
    
    For MCQ:
    [
      {
        "id": "1",
        "question": "question text",
        "type": "mcq",
        "options": {
          "A": "option text",
          "B": "option text", 
          "C": "option text",
          "D": "option text"
        },
        "answer": "A",
        "explanation": "why correct"
      }
    ]
    
    For Theory:
    [
      {
        "id": "1",
        "question": "question text",
        "type": "theory",
        "modelAnswer": "ideal answer",
        "keyPoints": ["point1", "point2"]
      }
    ]
  `;

  const result = await model.generateContent([
    {
      inlineData: {
        mimeType,
        data: pdfBase64
      }
    },
    { text: prompt }
  ]);

  const text = result.response.text()
    .replace(/```json/g, '')
    .replace(/```/g, '')
    .trim();

  return JSON.parse(text);
};

// Summarize document
export const summarizeDocument = async (
  pdfBase64: string,
  mimeType: string,
  type: SummaryType,
  topic?: string
): Promise<string> => {

  const prompts = {
    full: `Give a comprehensive summary 
           of this entire document. Include 
           key concepts, important points, 
           and exam tips for Nigerian students.`,
    topic: `Summarize ONLY the section about 
            "${topic}" from this document. 
            Include key points and exam tips.`,
    keypoints: `List ONLY the most important 
                key points from this document 
                that a Nigerian student must 
                know for exams. Use bullet points.`,
    examfocus: `Based on this document, tell me 
                the most likely topics to appear 
                in WAEC, NECO, or JAMB exams. 
                Explain each briefly.`
  };

  const result = await model.generateContent([
    {
      inlineData: {
        mimeType,
        data: pdfBase64
      }
    },
    { text: prompts[type] }
  ]);

  return result.response.text();
};

// Grade theory answer
export const gradeTheoryAnswer = async (
  question: string,
  modelAnswer: string,
  studentAnswer: string,
  keyPoints: string[]
): Promise<GradeResult> => {

  const prompt = `
    Grade this student's answer.
    
    Question: ${question}
    
    Model Answer: ${modelAnswer}
    
    Key Points Required:
    ${keyPoints.map((p, i) => 
      `${i+1}. ${p}`).join('\n')}
    
    Student's Answer: ${studentAnswer}
    
    Return ONLY valid JSON:
    {
      "score": 7,
      "maxScore": 10,
      "percentage": 70,
      "grade": "B",
      "feedback": "Your answer...",
      "pointsHit": ["point covered"],
      "pointsMissed": ["point missed"],
      "improvement": "To improve..."
    }
  `;

  const result = await model.generateContent(
    prompt
  );

  const text = result.response.text()
    .replace(/```json/g, '')
    .replace(/```/g, '')
    .trim();

  return JSON.parse(text);
};

// Nigerian student system prompt
const NIGERIAN_STUDENT_PROMPT = `
You are StudyPal, an AI study assistant 
for Nigerian students. 

Rules:
1. Always answer from the uploaded document
2. Use clear, simple English
3. Reference WAEC/NECO/JAMB patterns
4. Add "📌 Exam Tip" for frequently 
   tested topics
5. If not in document, say clearly:
   "This isn't in your notes, but..."
6. Format with headers and bullet points
7. Be encouraging and supportive
8. Relate to Nigerian student experience
`;
```

---

## 🎨 DESIGN DIRECTION

**Typography:**
- Heading: "Plus Jakarta Sans"
- Body: "Inter"

**Color Palette:**
- Primary: #7C3AED (purple)
- Dark: #6D28D9 (hover)
- Light: #F5F3FF (tints)
- Success: #059669 (green)
- Warning: #D97706 (amber)
- Danger: #DC2626 (red)
- Background: #F8FAFC
- Surface: #FFFFFF
- Sidebar: #1E1B4B (deep indigo)
- Sidebar Active: #312E81
- Text Primary: #0F172A
- Text Muted: #64748B
- Border: #E2E8F0
- User Message: #7C3AED
- AI Message: #F1F5F9

**Aesthetic:**
- Premium EdTech —
  Notion × ChatGPT ×
  Nigerian student culture
- Deep indigo sidebar
- White content area
- Purple accent throughout
- Chat feels like WhatsApp
  but more academic
- Quiz feels like real
  exam paper
- Framer Motion:
  message animations,
  quiz transitions,
  confetti on completion

---

## 🔐 AUTH PAGES

### Login Page

Full-screen split layout:

Left panel (40%):
- Deep indigo background
  (#1E1B4B)
- StudyPal logo:
  Purple graduation cap +
  white "StudyPal" wordmark
- Tagline:
  *"Study Smarter with AI"*
- 3 feature highlights
  (purple checkmarks):
  ✅ Chat with your documents
  ✅ Generate practice questions
  ✅ AI-powered summaries
- Bottom decorative element:
  Subtle book/study illustration

Right panel (60%):
- White background
- "Welcome back! 👋"
- Subtext:
  "Sign in to continue studying"
- Email input (with icon)
- Password input
  (show/hide toggle)
- "Sign In" button
  (purple gradient, full width)
- Loading state: spinner
- "Don't have an account?
  Sign up free" link
- Demo credentials card:

  (shows pre-loaded documents
  and chat history)

### Register Page

Same split layout:

Right panel form:
- "Create Your Account"
- Full name *
- Email address *
- Password * (show/hide)
- Confirm password *
- Exam level * (dropdown):
  Junior Secondary /
  Senior Secondary (SS1) /
  Senior Secondary (SS2) /
  Senior Secondary (SS3) /
  WAEC/NECO Candidate /
  JAMB Candidate /
  100 Level / 200 Level /
  300 Level / 400 Level /
  500 Level / Postgraduate
- "Create Free Account" button
- "Already have an account?
  Sign in" link
- Terms note:
  "By signing up you agree
  to our Terms of Service"

After register:
- Success animation
- Auto-redirect to dashboard
- Welcome toast:
  "Welcome to StudyPal! 🎓
  Upload your first document
  to start studying."

### Forgot Password
- Simple centered card
- Email input
- "Send Reset Link" button
- Back to login link

---

## 🧭 NAVIGATION

### Left Sidebar

Top:
- StudyPal logo +
  collapse toggle button
- Collapsed: icons + tooltips
- Expanded: icon + label

Student name + exam level badge:
"Chisom Eze · WAEC Candidate"

Plan badge:
🆓 Free Plan / 
⭐ Pro Plan

Navigation groups:

STUDY
🏠 Dashboard
📚 My Documents
💬 Study Chat
📝 Practice Quiz
📖 Summaries

PROGRESS  
📊 My Progress
🏆 Quiz History

ACCOUNT
⚙️ Settings
💜 Upgrade to Pro
  (only on free plan)

Bottom:
- Student avatar + name
- Sign out button

### Top Bar
- Hamburger (mobile/tablet)
- Current page title
- Right side:
  🔔 Notification bell
  Plan badge
  Avatar dropdown:
  Profile / Settings /
  Sign Out

---

## 🏠 DASHBOARD HOME

**Header:**
"Good morning, Chisom! 👋"
"What would you like to
study today?"
Date + exam level shown

**Quick Upload Card:**
Large purple gradient card
(most prominent on page):

If no documents yet:


**Stats Cards Row (4):**
📚 Documents: 5 |
💬 Questions Asked: 147 |
📝 Quizzes Taken: 12 |
📊 Avg Quiz Score: 78%

**Recent Documents 
(last 3):**
"Recently Studied"
Mini document cards:
(same design as My Documents)
"View All Documents →"

**Quick Actions Grid:**
4 large cards:

[📤 Upload Document]
Purple icon
"Add new study material"

[💬 Chat with AI]
Blue icon
"Ask questions about
your documents"

[📝 Generate Quiz]
Green icon
"Test your knowledge
with AI questions"

[📖 Summarize]
Orange icon
"Get instant summaries
of any topic"

**Study Tip Card:**
"💡 Today's Study Tip"
Rotating tips:
"Use the 'Generate Quiz'
feature after reading each
chapter to test yourself.
Research shows testing
improves memory by 50%!"

---

## 📚 MY DOCUMENTS PAGE

**Header:**
"My Documents" +
count badge +
[📤 Upload Document] button

**Search & Filter Bar:**
- Search by name
- Filter: Subject, 
  Exam level, Date
- Sort: Recent / Name /
  Most Studied
- View: Grid / List toggle

**Upload Modal:**
Triggered by upload button:


⋮ menu options:
Rename / Delete /
View Details

Subject color banners:
Biology: Green
Chemistry: Orange
Physics: Blue
Mathematics: Purple
English: Red
Geography: Teal
Others: Grey

**Empty State:**
Illustration of 
open book + sparkles
"No documents yet"
"Upload your first study
material to get started"
[📤 Upload Document] button

---

## 💬 STUDY CHAT PAGE

**The core feature.
Make it beautiful.**

**Full page layout:**

Left Panel (30%) — 
Document & History:

"Select Document:"
Document list:
Each item:
- Subject color dot
- Document name (truncated)
- Last message preview
- Click to select

Selected: purple highlight

Below document list:
"Chat History:"
Previous chats with
this document shown as
mini cards:
"Yesterday · 5 messages"
"2 days ago · 12 messages"
Click to restore that chat

Right Panel (70%) — 
Chat Interface:

**Chat Top Bar:**
"💬 [Document Name]"
Subject badge
[📝 Quiz] [📖 Summary]
[🗑️ New Chat] buttons

**Messages Area:**
(scrollable, auto-scroll to bottom)

AI Welcome Message
(auto-appears on doc select):



User message (right):

Purple rounded bubble:

"Explain photosynthesis

from my notes"

AI message (left):

White card with subtle

purple left border:



**Input Area:**

Textarea (auto-expands):

Placeholder:

"Ask anything about

your document..."

Send button (purple arrow)

Enter to send,

Shift+Enter for new line

Quick prompt chips 

(above input):

[📖 Summarize this] 

[📝 Generate questions]

[🎯 What's important for WAEC?]

[💡 Explain simply]

[📋 Key points only]

**Chat Features:**

✅ Messages saved per document

✅ Can return to old chats

✅ Copy AI message button

✅ 👍 👎 rating on responses

✅ "Generate Quiz from this topic"

   button inside AI messages

   when quiz is mentioned

✅ Markdown rendering

   (bold, bullets, headers)

✅ Math equations with KaTeX

**No document selected state:**

Center of chat area:

"👈 Select a document

from the left to start

your study session"

[📤 Upload New Document] button

---

## 📝 PRACTICE QUIZ PAGE

**Header:**

"Practice Quiz"

"Test yourself with

AI-generated questions"

**Setup Card:**

(Each step appears sequentially

with a small delay — 

feels alive)

---

**Quiz Taking Screen:**

Full-screen, distraction-free:

Top bar:

[StudyPal logo] ·

"Biology Quiz · WAEC Style" ·

⏱️ 04:32 (counting up) ·

"Q5 of 10" ·

[Submit Quiz]

Progress bar (full width):

Purple fill, shows progress

Question area:



After clicking Next:

Instant feedback:

✅ Correct!

Green flash animation

"The chloroplast contains

chlorophyll which captures

light energy for photosynthesis."

❌ Incorrect

Red flash animation

"The correct answer is C.

The chloroplast is the site

of photosynthesis, not the

mitochondria (that's respiration)."

[Next Question →]

Theory question display:

Question text (large)

Large textarea:

"Type your answer here..."

Word count: 0/200 words

[Submit Answer]

Theory grading result:
📊 AI Grading Result │
│─────────────────────────────────│
│ Your Score: 7/10 70% │
│ Grade: B │
│ │
│ ✅ Points You Got Right: │
│ • Mentioned chloroplast │
│ • Explained light energy │
│ • Included the equation │
│ │
│ ❌ Points You Missed: │
│ • Did not mention Calvin cycle │
│ • Missing thylakoid detail │
│ │
│ 💡 Improvement Tip: │
│ "Add more detail about the │
│ two stages of photosynthesis │
│ to get full marks in WAEC." │



Score messages:

90-100%: 🏆 "Excellent! You're

ready for this exam!"

70-89%: ⭐ "Great job! 

Keep practicing!"

50-69%: 👍 "Good effort!

Review the weak areas."

<50%: 💪 "Keep going!

Use the chat to understand

the difficult topics."

"Discuss Wrong Answers" button:

Opens chat page with

pre-loaded message:

"I got these questions wrong

in my quiz: [list]. Please

explain them from my document."

**Review Answers Screen:**

All questions listed:

✅ Q1 · Correct answer shown

❌ Q2 · Your answer + Correct answer

       + Explanation shown

✅ Q3 · Correct answer shown

...etc

---

## 📖 SUMMARIES PAGE

**Header:**

"Smart Summaries"

"Instant AI summaries

from your documents"

**Generator Card:**


**Saved Summaries:**
Below generator:
"Your Saved Summaries"
Table:
Document | Type | Topic |
Date | Actions
(View / Delete)

---

## 📊 MY PROGRESS PAGE

**Header:**
"My Progress"
"Track your study journey"

**Stats Cards (4):**
⏱️ Total Study Time |
📚 Documents Uploaded |
📝 Quizzes Completed |
📊 Average Score %

**Performance Chart:**
"Quiz Scores Over Time"
Line chart (last 30 days)
Purple line, smooth curve
(Recharts)

**Subject Performance:**
"Performance by Subject"
Horizontal bar chart:
Biology: ████████░░ 82%
Chemistry: ██████░░░░ 63%
Mathematics: ████████░░ 79%
Physics: █████░░░░░ 52%
Color: green if >75%,
amber if 50-75%,
red if <50%

**Study Streak:**
"🔥 Your Study Streak"
Current streak: 5 days
Calendar grid showing
last 30 days:
🟣 Studied (purple square)
⬜ Not studied (grey square)
"Keep going! You're
on a 5-day streak!"

**Weak Areas Alert:**
Red-tinted card:
"📉 Areas Needing Attention"
(Based on quiz history)
- Cell Division — 
  avg 48% in quizzes
- Chemical Bonding — 
  avg 55% in quizzes
[💬 Study These Now →]
Opens chat pre-loaded
with weak topic focus

**Quiz History Table:**
Document | Score |
Style | Date |
Time Taken | Actions

Actions: [Review Answers]

---

## ⚙️ SETTINGS PAGE

**Profile Section:**
- Full name
- Email (read-only)
- Profile photo upload
- Change password
- Exam level (editable)
- School name (optional)
- State

**Study Preferences:**
- Default quiz question count
- Preferred exam style:
  WAEC / NECO / JAMB /
  University / General
- AI response style:
  Formal English /
  Simple English /
  "Explain like I'm in SS3"

**Notifications:**
- Daily study reminder toggle
  (set time if on)
- Weekly progress email toggle

**Plan & Usage:**
"Your Current Plan: Free"

Usage this month:
Documents: 2 / 3 used
Progress bar

Daily AI questions: 23/50
Progress bar

[⭐ Upgrade to Pro — ₦2,000/month]
Button (purple)
"Unlimited documents,
unlimited questions,
advanced features"

**Danger Zone:**
(red section at bottom)
[Delete All Documents]
[Delete My Account]
Both require confirmation modal

---

## 🛠 TECH STACK

- **Framework:**
  React + TypeScript + Vite
- **Routing:**
  React Router v6
- **Styling:** Tailwind CSS
- **Animations:** Framer Motion
- **AI:** Google Gemini API
  (gemini-1.5-flash — FREE)
- **Data Fetching:**
  TanStack Query
- **HTTP:** Axios
- **State:**
  Zustand (auth + chat)
- **Charts:** Recharts
- **Forms:**
  React Hook Form + Zod
- **Icons:** Lucide React
- **Toasts:** Sonner
- **PDF:** jsPDF + html2canvas
- **Math:** KaTeX
  (equation rendering)
- **Dates:** date-fns
- **Confetti:**
  canvas-confetti
- **Mock Data:**
  /src/mock/ folder

---

## 📁 FOLDER STRUCTURE

src/
├── components/
│   ├── layout/
│   │   ├── Sidebar.tsx
│   │   ├── TopBar.tsx
│   │   └── ProtectedRoute.tsx
│   ├── chat/
│   │   ├── ChatInterface.tsx
│   │   ├── MessageBubble.tsx
│   │   ├── TypingIndicator.tsx
│   │   ├── ChatInput.tsx
│   │   └── QuickPrompts.tsx
│   ├── quiz/
│   │   ├── QuizSetup.tsx
│   │   ├── QuizQuestion.tsx
│   │   ├── MCQOption.tsx
│   │   ├── TheoryQuestion.tsx
│   │   └── QuizResults.tsx
│   ├── documents/
│   │   ├── DocumentCard.tsx
│   │   ├── DocumentGrid.tsx
│   │   └── UploadModal.tsx
│   ├── summary/
│   │   ├── SummarySetup.tsx
│   │   └── SummaryResult.tsx
│   ├── progress/
│   │   ├── StatsCard.tsx
│   │   ├── ScoreChart.tsx
│   │   ├── SubjectChart.tsx
│   │   └── StudyStreak.tsx
│   └── ui/
│       ├── ScoreBadge.tsx
│       ├── SubjectBadge.tsx
│       ├── SkeletonLoader.tsx
│       └── EmptyState.tsx
│
├── pages/
│   ├── auth/
│   │   ├── Login.tsx
│   │   ├── Register.tsx
│   │   └── ForgotPassword.tsx
│   └── dashboard/
│       ├── Home.tsx
│       ├── MyDocuments.tsx
│       ├── StudyChat.tsx
│       ├── PracticeQuiz.tsx
│       ├── Summaries.tsx
│       ├── Progress.tsx
│       └── Settings.tsx
│
├── services/
│   ├── api.ts
│   └── geminiAI.ts
│
├── store/
│   ├── authStore.ts
│   └── chatStore.ts
│
├── prompts/
│   ├── chatPrompt.ts
│   ├── quizPrompt.ts
│   ├── summaryPrompt.ts
│   └── gradingPrompt.ts
│
├── mock/
│   ├── documents.ts
│   ├── quizHistory.ts
│   └── progress.ts
│
└── types/
    ├── document.types.ts
    ├── quiz.types.ts
    └── chat.types.ts

---

## 📱 RESPONSIVENESS

Mobile (360px+):
- Bottom navigation:
  🏠 Home | 📚 Docs |
  💬 Chat | 📝 Quiz
- Sidebar: full drawer
- Chat: full screen
- Quiz: phone optimized
- All buttons: 48px min

Tablet (768px+):
- Collapsed icon sidebar
- Chat: 35/65 split

Desktop (1280px+):
- Full sidebar expanded
- All features visible
- Hover effects

---

## ✨ SIGNATURE UI DETAILS

1. Demo credentials on 
   login page — easy to
   show in any demo

2. AI typing indicator
   with bouncing dots —
   feels alive

3. "📌 WAEC Exam Tip"
   callout in AI responses —
   feels specifically Nigerian

4. Confetti on quiz complete
   — celebrates student wins

5. "Discuss Wrong Answers"
   button — best feature
   after quiz

6. Subject color banners
   on document cards —
   instant visual identity

7. Chat history per document
   — student never loses
   their conversations

8. Weak areas detected from
   quiz history —
   feels like real tutoring

9. Study streak calendar —
   gamifies daily studying

10. Theory grading with
    points hit/missed —
    genuinely useful feedback

11. Quick prompt chips
    in chat — guides students
    who don't know what to ask

12. Progress bar on quiz
    — students always know
    where they are

13. Score ring animation
    on quiz results —
    satisfying visual

14. Each page has its own
    empty state illustration
    — nothing feels broken

15. Smooth page transitions
    — feels premium,
    not choppy

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/98f3aa88-bbe2-4f6a-befe-d1ac2565d49d).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
