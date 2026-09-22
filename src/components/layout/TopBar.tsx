import { Link, useNavigate } from "@tanstack/react-router";
import { Bell, ChevronDown, LogOut, Menu, Settings, User } from "lucide-react";
import { useState } from "react";
import { useApp, useCurrentUser } from "@/store/useApp";

export function TopBar({ title, onMenu }: { title: string; onMenu: () => void }) {
  const user = useCurrentUser();
  const logout = useApp((s) => s.logout);
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border bg-card/80 px-4 backdrop-blur lg:px-8">
      <button
        onClick={onMenu}
        className="flex size-10 items-center justify-center rounded-xl hover:bg-muted lg:hidden"
        aria-label="Open menu"
      >
        <Menu className="size-5" />
      </button>
      <h1 className="font-display text-lg font-bold">{title}</h1>

      <div className="ml-auto flex items-center gap-2">
        <button
          className="relative flex size-10 items-center justify-center rounded-xl hover:bg-muted"
          aria-label="Notifications"
        >
          <Bell className="size-[18px]" />
          <span className="absolute top-2.5 right-2.5 size-2 rounded-full bg-primary" />
        </button>
        <span className="hidden rounded-full bg-primary-soft px-3 py-1 text-xs font-semibold text-primary sm:inline">
          {user?.plan === "pro" ? "⭐ Pro" : "🆓 Free"}
        </span>
        <div className="relative">
          <button
            onClick={() => setOpen((o) => !o)}
            className="flex items-center gap-2 rounded-xl px-2 py-1.5 hover:bg-muted"
          >
            <span className="flex size-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
              {user?.name.charAt(0) ?? "S"}
            </span>
            <ChevronDown className="size-4 text-muted-foreground" />
          </button>
          {open && (
            <div
              className="absolute right-0 z-40 mt-2 w-48 overflow-hidden rounded-xl border border-border bg-popover shadow-soft"
              onMouseLeave={() => setOpen(false)}
            >
              <Link
                to="/settings"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-muted"
              >
                <User className="size-4" /> Profile
              </Link>
              <Link
                to="/settings"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-muted"
              >
                <Settings className="size-4" /> Settings
              </Link>
              <button
                onClick={() => {
                  logout();
                  navigate({ to: "/login" });
                }}
                className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-destructive hover:bg-muted"
              >
                <LogOut className="size-4" /> Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
