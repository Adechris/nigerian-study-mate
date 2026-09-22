import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import {
  BarChart3,
  BookOpen,
  ChevronLeft,
  Crown,
  FileText,
  GraduationCap,
  History,
  Home,
  LogOut,
  MessageSquare,
  PencilRuler,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useApp, useCurrentUser } from "@/store/useApp";

export const NAV_GROUPS = [
  {
    label: "Study",
    items: [
      { to: "/dashboard", label: "Dashboard", icon: Home },
      { to: "/documents", label: "My Documents", icon: BookOpen },
      { to: "/chat", label: "Study Chat", icon: MessageSquare },
      { to: "/quiz", label: "Practice Quiz", icon: PencilRuler },
      { to: "/summaries", label: "Summaries", icon: FileText },
    ],
  },
  {
    label: "Progress",
    items: [
      { to: "/progress", label: "My Progress", icon: BarChart3 },
      { to: "/quiz-history", label: "Quiz History", icon: History },
    ],
  },
  {
    label: "Account",
    items: [{ to: "/settings", label: "Settings", icon: Settings }],
  },
] as const;

export function Sidebar({
  collapsed,
  onToggle,
  onNavigate,
}: {
  collapsed: boolean;
  onToggle: () => void;
  onNavigate?: () => void;
}) {
  const user = useCurrentUser();
  const logout = useApp((s) => s.logout);
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <aside
      className={cn(
        "flex h-full flex-col bg-sidebar text-sidebar-foreground transition-all duration-300",
        collapsed ? "w-[76px]" : "w-[264px]",
      )}
    >
      <div className="flex items-center gap-2 px-4 py-5">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground">
          <GraduationCap className="size-5" />
        </span>
        {!collapsed && (
          <span className="font-display text-lg font-extrabold text-white">StudyPal</span>
        )}
        <button
          onClick={onToggle}
          className="ml-auto hidden size-7 items-center justify-center rounded-lg text-white/50 hover:bg-white/10 hover:text-white lg:flex"
          aria-label="Toggle sidebar"
        >
          <ChevronLeft className={cn("size-4 transition", collapsed && "rotate-180")} />
        </button>
      </div>

      {!collapsed && user && (
        <div className="mx-3 mb-4 rounded-xl bg-sidebar-accent/70 p-3">
          <p className="truncate text-sm font-semibold text-white">{user.name}</p>
          <p className="truncate text-xs text-white/60">{user.examLevel}</p>
          <span className="mt-2 inline-flex rounded-full bg-primary/25 px-2 py-0.5 text-[11px] font-semibold text-white">
            {user.plan === "pro" ? "⭐ Pro Plan" : "🆓 Free Plan"}
          </span>
        </div>
      )}

      <nav className="scrollbar-thin flex-1 overflow-y-auto px-3 pb-4">
        {NAV_GROUPS.map((group) => (
          <div key={group.label} className="mb-5">
            {!collapsed && (
              <p className="mb-2 px-2 text-[10px] font-bold tracking-widest text-white/35 uppercase">
                {group.label}
              </p>
            )}
            <div className="space-y-1">
              {group.items.map((item) => {
                const active = pathname === item.to;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={onNavigate}
                    title={collapsed ? item.label : undefined}
                    className={cn(
                      "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition",
                      active
                        ? "bg-primary text-primary-foreground shadow-glow"
                        : "text-white/70 hover:bg-sidebar-accent hover:text-white",
                      collapsed && "justify-center px-0",
                    )}
                  >
                    <Icon className="size-[18px] shrink-0" />
                    {!collapsed && <span>{item.label}</span>}
                  </Link>
                );
              })}
              {group.label === "Account" && user?.plan === "free" && (
                <Link
                  to="/settings"
                  onClick={onNavigate}
                  title={collapsed ? "Upgrade to Pro" : undefined}
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-amber-200 transition hover:bg-sidebar-accent",
                    collapsed && "justify-center px-0",
                  )}
                >
                  <Crown className="size-[18px] shrink-0" />
                  {!collapsed && <span>Upgrade to Pro</span>}
                </Link>
              )}
            </div>
          </div>
        ))}
      </nav>

      <div className="border-t border-white/10 p-3">
        <div className={cn("flex items-center gap-3", collapsed && "justify-center")}>
          <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/30 text-sm font-bold text-white">
            {user?.name.charAt(0) ?? "S"}
          </span>
          {!collapsed && (
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-white">{user?.name}</p>
              <p className="truncate text-xs text-white/50">{user?.email}</p>
            </div>
          )}
          {!collapsed && (
            <button
              onClick={() => {
                logout();
                navigate({ to: "/login" });
              }}
              className="text-white/50 hover:text-white"
              aria-label="Sign out"
            >
              <LogOut className="size-4" />
            </button>
          )}
        </div>
      </div>
    </aside>
  );
}
