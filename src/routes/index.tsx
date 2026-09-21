import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { GraduationCap } from "lucide-react";
import { useApp } from "@/store/useApp";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const navigate = useNavigate();
  const hydrated = useApp((s) => s.hydrated);
  const currentUserId = useApp((s) => s.currentUserId);

  useEffect(() => {
    if (!hydrated) return;
    navigate({ to: currentUserId ? "/dashboard" : "/login", replace: true });
  }, [hydrated, currentUserId, navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-sidebar">
      <div className="flex animate-pulse items-center gap-3">
        <span className="flex size-11 items-center justify-center rounded-xl bg-primary text-primary-foreground">
          <GraduationCap className="size-6" />
        </span>
        <span className="font-display text-2xl font-extrabold text-white">StudyPal</span>
      </div>
    </div>
  );
}
