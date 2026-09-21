import { motion } from "framer-motion";
import { BookOpen, Check, GraduationCap, Sparkles } from "lucide-react";
import type { ReactNode } from "react";

const features = [
  "Chat with your documents",
  "Generate practice questions",
  "AI-powered summaries",
];

export function AuthShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      <div className="relative flex flex-col justify-between overflow-hidden bg-sidebar px-8 py-10 text-sidebar-foreground lg:w-[40%] lg:px-12 lg:py-14">
        <div>
          <div className="flex items-center gap-3">
            <span className="flex size-11 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-glow">
              <GraduationCap className="size-6" />
            </span>
            <span className="font-display text-2xl font-extrabold text-white">StudyPal</span>
          </div>
          <h2 className="mt-10 font-display text-3xl leading-tight font-bold text-white lg:text-4xl">
            Study Smarter with AI
          </h2>
          <p className="mt-3 max-w-sm text-sm text-white/65">
            Built for Nigerian students preparing for WAEC, NECO, JAMB and university exams.
          </p>
          <ul className="mt-8 space-y-4">
            {features.map((f, i) => (
              <motion.li
                key={f}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * i + 0.1 }}
                className="flex items-center gap-3 text-sm text-white/85"
              >
                <span className="flex size-6 items-center justify-center rounded-full bg-primary/25 text-primary-foreground">
                  <Check className="size-3.5" />
                </span>
                {f}
              </motion.li>
            ))}
          </ul>
        </div>

        <div className="relative mt-12 hidden lg:block">
          <div className="pointer-events-none absolute -top-24 -right-16 size-64 rounded-full bg-primary/25 blur-3xl" />
          <div className="relative flex items-end gap-3 rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur">
            <BookOpen className="size-9 text-primary" />
            <div>
              <p className="font-display text-sm font-semibold text-white">
                Your notes, your tutor
              </p>
              <p className="text-xs text-white/60">
                Upload a PDF and start asking questions in seconds.
              </p>
            </div>
            <Sparkles className="ml-auto size-5 text-primary" />
          </div>
        </div>
      </div>

      <div className="flex flex-1 items-center justify-center bg-card px-6 py-12 lg:px-16">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="w-full max-w-md"
        >
          {children}
        </motion.div>
      </div>
    </div>
  );
}
