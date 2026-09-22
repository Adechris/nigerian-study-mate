import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Eye, EyeOff, Loader2, Lock, Mail } from "lucide-react";
import { toast } from "sonner";
import { AuthShell } from "@/components/auth/AuthShell";
import { DEMO_EMAIL, DEMO_PASSWORD } from "@/mock/data";
import { useApp } from "@/store/useApp";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Sign in — StudyPal" },
      { name: "description", content: "Sign in to StudyPal and continue studying with AI." },
      { property: "og:title", content: "Sign in — StudyPal" },
      {
        property: "og:description",
        content: "Sign in to StudyPal and continue studying with AI.",
      },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const login = useApp((s) => s.login);
  const currentUserId = useApp((s) => s.currentUserId);
  const hydrated = useApp((s) => s.hydrated);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (hydrated && currentUserId) navigate({ to: "/dashboard", replace: true });
  }, [hydrated, currentUserId, navigate]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 500));
    const res = login(email, password);
    setLoading(false);
    if (!res.ok) {
      toast.error(res.error);
      return;
    }
    toast.success("Welcome back! 🎓");
    navigate({ to: "/dashboard" });
  };

  return (
    <AuthShell>
      <h1 className="font-display text-3xl font-bold">Welcome back! 👋</h1>
      <p className="mt-2 text-sm text-muted-foreground">Sign in to continue studying</p>

      <form onSubmit={submit} className="mt-8 space-y-4">
        <Field label="Email address">
          <Mail className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="h-12 w-full rounded-xl border border-border bg-background pr-4 pl-11 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </Field>

        <Field label="Password">
          <Lock className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type={show ? "text" : "password"}
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="h-12 w-full rounded-xl border border-border bg-background pr-11 pl-11 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
          <button
            type="button"
            onClick={() => setShow((s) => !s)}
            className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            aria-label={show ? "Hide password" : "Show password"}
          >
            {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          </button>
        </Field>

        <div className="flex justify-end">
          <Link to="/forgot-password" className="text-xs font-medium text-primary hover:underline">
            Forgot password?
          </Link>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="gradient-primary flex h-12 w-full items-center justify-center gap-2 rounded-xl text-sm font-semibold text-primary-foreground shadow-glow transition hover:opacity-95 disabled:opacity-70"
        >
          {loading ? <Loader2 className="size-4 animate-spin" /> : null}
          {loading ? "Signing in..." : "Sign In"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{" "}
        <Link to="/register" className="font-semibold text-primary hover:underline">
          Sign up free
        </Link>
      </p>

      <div className="mt-8 rounded-xl border border-primary/20 bg-primary-soft p-4">
        <p className="text-xs font-semibold tracking-wide text-primary uppercase">
          Demo credentials
        </p>
        <p className="mt-2 text-sm text-foreground">
          {DEMO_EMAIL} · {DEMO_PASSWORD}
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          Comes with 5 pre-loaded documents and quiz history.
        </p>
        <button
          type="button"
          onClick={() => {
            setEmail(DEMO_EMAIL);
            setPassword(DEMO_PASSWORD);
          }}
          className="mt-3 rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground"
        >
          Use demo account
        </button>
      </div>
    </AuthShell>
  );
}

export function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium">{label}</span>
      <span className="relative block">{children}</span>
    </label>
  );
}
