import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { GraduationCap, Loader2, MailCheck } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/forgot-password")({
  head: () => ({
    meta: [
      { title: "Reset your password — StudyPal" },
      { name: "description", content: "Request a password reset link for your StudyPal account." },
      { property: "og:title", content: "Reset your password — StudyPal" },
      {
        property: "og:description",
        content: "Request a password reset link for your StudyPal account.",
      },
    ],
  }),
  component: ForgotPasswordPage,
});

function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 700));
    setLoading(false);
    setSent(true);
    toast.success("If that email exists, a reset link is on its way.");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-sidebar px-4">
      <div className="w-full max-w-md rounded-3xl bg-card p-8 shadow-soft">
        <div className="mb-6 flex items-center gap-3">
          <span className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <GraduationCap className="size-5" />
          </span>
          <span className="font-display text-xl font-extrabold">StudyPal</span>
        </div>

        {sent ? (
          <div className="text-center">
            <MailCheck className="mx-auto size-10 text-success" />
            <h1 className="mt-4 font-display text-xl font-bold">Check your inbox</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              We sent reset instructions to {email}.
            </p>
          </div>
        ) : (
          <>
            <h1 className="font-display text-2xl font-bold">Forgot your password?</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Enter your email and we&apos;ll send you a reset link.
            </p>
            <form onSubmit={submit} className="mt-6 space-y-4">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="h-12 w-full rounded-xl border border-border bg-background px-4 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
              <button
                disabled={loading}
                className="gradient-primary flex h-12 w-full items-center justify-center gap-2 rounded-xl text-sm font-semibold text-primary-foreground disabled:opacity-70"
              >
                {loading ? <Loader2 className="size-4 animate-spin" /> : null}
                Send Reset Link
              </button>
            </form>
          </>
        )}

        <p className="mt-6 text-center text-sm">
          <Link to="/login" className="font-semibold text-primary hover:underline">
            Back to login
          </Link>
        </p>
      </div>
    </div>
  );
}
