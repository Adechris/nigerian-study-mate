import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  BookOpen,
  FileText,
  Lightbulb,
  MessageSquare,
  PencilRuler,
  Sparkles,
  Upload,
} from "lucide-react";
import { UploadModal } from "@/components/documents/UploadModal";
import { SubjectBadge, subjectColor } from "@/components/ui/subject";
import { STUDY_TIPS } from "@/mock/data";
import { useApp, useCurrentUser } from "@/store/useApp";

export const Route = createFileRoute("/_app/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — StudyPal" },
      {
        name: "description",
        content: "Your StudyPal study dashboard: documents, quizzes and progress at a glance.",
      },
      { property: "og:title", content: "Dashboard — StudyPal" },
      {
        property: "og:description",
        content: "Your StudyPal study dashboard: documents, quizzes and progress at a glance.",
      },
    ],
  }),
  component: DashboardPage,
});

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

function DashboardPage() {
  const user = useCurrentUser();
  const docs = useApp((s) => s.docs);
  const quizzes = useApp((s) => s.quizzes);
  const questionsAsked = useApp((s) => s.questionsAsked);
  const [upload, setUpload] = useState(false);

  const avg = quizzes.length
    ? Math.round(quizzes.reduce((a, q) => a + q.percentage, 0) / quizzes.length)
    : 0;

  const recent = useMemo(
    () =>
      [...docs]
        .sort(
          (a, b) =>
            new Date(b.lastStudiedAt ?? b.createdAt).getTime() -
            new Date(a.lastStudiedAt ?? a.createdAt).getTime(),
        )
        .slice(0, 3),
    [docs],
  );

  const tip = STUDY_TIPS[new Date().getDate() % STUDY_TIPS.length];

  return (
    <div className="mx-auto max-w-6xl space-y-8 px-4 py-8 lg:px-8">
      <div>
        <h2 className="font-display text-2xl font-bold lg:text-3xl">
          {greeting()}, {user?.name.split(" ")[0]}! 👋
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          What would you like to study today? ·{" "}
          {new Date().toLocaleDateString("en-NG", {
            weekday: "long",
            day: "numeric",
            month: "long",
          })}{" "}
          · {user?.examLevel}
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="gradient-primary relative overflow-hidden rounded-3xl p-7 text-primary-foreground shadow-glow"
      >
        <div className="pointer-events-none absolute -top-16 -right-10 size-56 rounded-full bg-white/10 blur-2xl" />
        <Sparkles className="size-7" />
        <h3 className="mt-3 font-display text-xl font-bold">
          {docs.length === 0
            ? "Upload your first document"
            : "Add new material and start studying"}
        </h3>
        <p className="mt-1 max-w-md text-sm text-white/80">
          Drop in your notes or past questions and StudyPal will chat, quiz and summarise from
          them instantly.
        </p>
        <button
          onClick={() => setUpload(true)}
          className="mt-5 inline-flex h-11 items-center gap-2 rounded-xl bg-white px-5 text-sm font-semibold text-primary"
        >
          <Upload className="size-4" /> Upload Document
        </button>
      </motion.div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Stat icon="📚" label="Documents" value={docs.length} />
        <Stat icon="💬" label="Questions Asked" value={questionsAsked} />
        <Stat icon="📝" label="Quizzes Taken" value={quizzes.length} />
        <Stat icon="📊" label="Avg Quiz Score" value={`${avg}%`} />
      </div>

      <section>
        <div className="mb-3 flex items-center justify-between">
          <h3 className="font-display text-lg font-bold">Recently Studied</h3>
          <Link to="/documents" className="text-sm font-medium text-primary hover:underline">
            View All Documents →
          </Link>
        </div>
        {recent.length ? (
          <div className="grid gap-4 md:grid-cols-3">
            {recent.map((d) => (
              <Link
                key={d.id}
                to="/chat"
                search={{ doc: d.id }}
                className="overflow-hidden rounded-2xl border border-border bg-card shadow-soft transition hover:-translate-y-0.5"
              >
                <div className={`h-1.5 ${subjectColor[d.subject].bar}`} />
                <div className="p-4">
                  <SubjectBadge subject={d.subject} />
                  <p className="mt-2 line-clamp-2 text-sm font-semibold">{d.name}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {d.pages} pages · studied {d.studyCount}×
                  </p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p className="rounded-2xl border border-dashed border-border bg-card p-8 text-center text-sm text-muted-foreground">
            No documents yet — upload one to get started.
          </p>
        )}
      </section>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Action
          to="/documents"
          icon={<Upload className="size-5" />}
          tone="bg-primary-soft text-primary"
          title="Upload Document"
          desc="Add new study material"
        />
        <Action
          to="/chat"
          icon={<MessageSquare className="size-5" />}
          tone="bg-blue-50 text-blue-600"
          title="Chat with AI"
          desc="Ask questions about your documents"
        />
        <Action
          to="/quiz"
          icon={<PencilRuler className="size-5" />}
          tone="bg-emerald-50 text-emerald-600"
          title="Generate Quiz"
          desc="Test your knowledge with AI questions"
        />
        <Action
          to="/summaries"
          icon={<FileText className="size-5" />}
          tone="bg-orange-50 text-orange-600"
          title="Summarize"
          desc="Get instant summaries of any topic"
        />
      </section>

      <div className="flex gap-4 rounded-2xl border border-amber-200 bg-amber-50 p-5">
        <Lightbulb className="size-6 shrink-0 text-amber-600" />
        <div>
          <p className="font-display text-sm font-bold text-amber-900">Today&apos;s Study Tip</p>
          <p className="mt-1 text-sm text-amber-800">{tip}</p>
        </div>
      </div>

      <UploadModal open={upload} onClose={() => setUpload(false)} />
    </div>
  );
}

function Stat({ icon, label, value }: { icon: string; label: string; value: string | number }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-soft">
      <span className="text-xl">{icon}</span>
      <p className="mt-2 font-display text-2xl font-bold">{value}</p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  );
}

function Action({
  to,
  icon,
  tone,
  title,
  desc,
}: {
  to: string;
  icon: React.ReactNode;
  tone: string;
  title: string;
  desc: string;
}) {
  return (
    <Link
      to={to}
      className="rounded-2xl border border-border bg-card p-5 shadow-soft transition hover:-translate-y-0.5 hover:border-primary/40"
    >
      <span className={`flex size-11 items-center justify-center rounded-xl ${tone}`}>{icon}</span>
      <p className="mt-3 font-display text-sm font-bold">{title}</p>
      <p className="mt-1 text-xs text-muted-foreground">{desc}</p>
    </Link>
  );
}

export { BookOpen };
