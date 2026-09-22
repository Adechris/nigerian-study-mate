import { Outlet, createFileRoute, useNavigate, useRouterState } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { BookOpen, GraduationCap, Home, MessageSquare, PencilRuler, X } from "lucide-react";
import { Sidebar } from "@/components/layout/Sidebar";
import { TopBar } from "@/components/layout/TopBar";
import { cn } from "@/lib/utils";
import { useApp } from "@/store/useApp";

export const Route = createFileRoute("/_app")({
  component: AppLayout,
});

const TITLES: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/documents": "My Documents",
  "/chat": "Study Chat",
  "/quiz": "Practice Quiz",
  "/summaries": "Smart Summaries",
  "/progress": "My Progress",
  "/quiz-history": "Quiz History",
  "/settings": "Settings",
};

const MOBILE_NAV = [
  { to: "/dashboard", label: "Home", icon: Home },
  { to: "/documents", label: "Docs", icon: BookOpen },
  { to: "/chat", label: "Chat", icon: MessageSquare },
  { to: "/quiz", label: "Quiz", icon: PencilRuler },
] as const;

function AppLayout() {
  const navigate = useNavigate();
  const hydrated = useApp((s) => s.hydrated);
  const currentUserId = useApp((s) => s.currentUserId);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [collapsed, setCollapsed] = useState(false);
  const [drawer, setDrawer] = useState(false);

  useEffect(() => {
    if (hydrated && !currentUserId) navigate({ to: "/login", replace: true });
  }, [hydrated, currentUserId, navigate]);

  if (!hydrated || !currentUserId) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex animate-pulse items-center gap-3 text-primary">
          <GraduationCap className="size-6" />
          <span className="font-display font-bold">StudyPal</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-background">
      <div className="sticky top-0 hidden h-screen lg:block">
        <Sidebar collapsed={collapsed} onToggle={() => setCollapsed((c) => !c)} />
      </div>

      <AnimatePresence>
        {drawer && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDrawer(false)}
              className="fixed inset-0 z-40 bg-black/50 lg:hidden"
            />
            <motion.div
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", damping: 26, stiffness: 240 }}
              className="fixed inset-y-0 left-0 z-50 lg:hidden"
            >
              <Sidebar collapsed={false} onToggle={() => {}} onNavigate={() => setDrawer(false)} />
              <button
                onClick={() => setDrawer(false)}
                className="absolute top-5 -right-12 flex size-10 items-center justify-center rounded-xl bg-card"
                aria-label="Close menu"
              >
                <X className="size-5" />
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar title={TITLES[pathname] ?? "StudyPal"} onMenu={() => setDrawer(true)} />
        <main className="flex-1 pb-24 lg:pb-0">
          <motion.div
            key={pathname}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="h-full"
          >
            <Outlet />
          </motion.div>
        </main>
      </div>

      <nav className="fixed inset-x-0 bottom-0 z-30 flex border-t border-border bg-card lg:hidden">
        {MOBILE_NAV.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.to;
          return (
            <Link
              key={item.to}
              to={item.to}
              className={cn(
                "flex flex-1 flex-col items-center gap-1 py-3 text-[11px] font-medium",
                active ? "text-primary" : "text-muted-foreground",
              )}
            >
              <Icon className="size-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
