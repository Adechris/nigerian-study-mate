import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { AuthShell } from "@/components/auth/AuthShell";
import { Field } from "./login";
import { useApp } from "@/store/useApp";
import { EXAM_LEVELS, type ExamLevel } from "@/types";

export const Route = createFileRoute("/register")({
  head: () => ({
    meta: [
      { title: "Create your account — StudyPal" },
      {
        name: "description",
        content: "Create a free StudyPal account and start studying with AI today.",
      },
      { property: "og:title", content: "Create your account — StudyPal" },
      {
        property: "og:description",
        content: "Create a free StudyPal account and start studying with AI today.",
      },
    ],
  }),
  component: RegisterPage,
});

const inputCls =
  "h-12 w-full rounded-xl border border-border bg-background px-4 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20";

function RegisterPage() {
  const navigate = useNavigate();
  const register = useApp((s) => s.register);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirm: "",
    examLevel: "WAEC/NECO Candidate" as ExamLevel,
  });
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  const set = (k: keyof typeof form, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password.length < 6) return toast.error("Password must be at least 6 characters.");
    if (form.password !== form.confirm) return toast.error("Passwords do not match.");
    setLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    const res = register({
      name: form.name,
      email: form.email,
      password: form.password,
      examLevel: form.examLevel,
    });
    setLoading(false);
    if (!res.ok) return toast.error(res.error);
    toast.success("Welcome to StudyPal! 🎓 Upload your first document to start studying.");
    navigate({ to: "/dashboard" });
  };

  return (
    <AuthShell>
      <h1 className="font-display text-3xl font-bold">Create Your Account</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Free forever. No card needed to start studying.
      </p>

      <form onSubmit={submit} className="mt-7 space-y-4">
        <Field label="Full name">
          <input
            required
            value={form.name}
            onChange={(e) => set("name", e.target.value)}
            placeholder="Chisom Eze"
            className={inputCls}
          />
        </Field>
        <Field label="Email address">
          <input
            required
            type="email"
            value={form.email}
            onChange={(e) => set("email", e.target.value)}
            placeholder="you@example.com"
            className={inputCls}
          />
        </Field>
        <Field label="Password">
          <input
            required
            type={show ? "text" : "password"}
            value={form.password}
            onChange={(e) => set("password", e.target.value)}
            placeholder="At least 6 characters"
            className={`${inputCls} pr-11`}
          />
          <button
            type="button"
            onClick={() => setShow((s) => !s)}
            className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground"
            aria-label={show ? "Hide password" : "Show password"}
          >
            {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          </button>
        </Field>
        <Field label="Confirm password">
          <input
            required
            type={show ? "text" : "password"}
            value={form.confirm}
            onChange={(e) => set("confirm", e.target.value)}
            placeholder="Repeat your password"
            className={inputCls}
          />
        </Field>
        <Field label="Exam level">
          <select
            value={form.examLevel}
            onChange={(e) => set("examLevel", e.target.value)}
            className={inputCls}
          >
            {EXAM_LEVELS.map((l) => (
              <option key={l} value={l}>
                {l}
              </option>
            ))}
          </select>
        </Field>

        <button
          type="submit"
          disabled={loading}
          className="gradient-primary flex h-12 w-full items-center justify-center gap-2 rounded-xl text-sm font-semibold text-primary-foreground shadow-glow transition hover:opacity-95 disabled:opacity-70"
        >
          {loading ? <Loader2 className="size-4 animate-spin" /> : null}
          Create Free Account
        </button>
        <p className="text-center text-xs text-muted-foreground">
          By signing up you agree to our Terms of Service.
        </p>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link to="/login" className="font-semibold text-primary hover:underline">
          Sign in
        </Link>
      </p>
    </AuthShell>
  );
}
