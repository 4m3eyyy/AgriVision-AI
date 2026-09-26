import { createFileRoute } from "@tanstack/react-router";
import { Bell, Check, Settings as SettingsIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { AppShell, PageHeader, Panel } from "@/components/agrivision";

export const Route = createFileRoute("/settings")({
  component: SettingsPage,
});

function SettingsPage() {
  const [notifications, setNotifications] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem("agrivision_notifications");

    if (saved !== null) {
      setNotifications(saved === "true");
    }
  }, []);

  const toggleNotifications = () => {
    const next = !notifications;

    setNotifications(next);
    localStorage.setItem(
      "agrivision_notifications",
      String(next),
    );
  };

  return (
    <AppShell>
      <PageHeader
        eyebrow="Preferences"
        title="Settings"
        description="Manage your AgriVision preferences."
      />

      <div className="space-y-5">
        <Panel>
          <div className="flex items-center gap-4">
            <div className="grid size-12 place-items-center rounded-xl bg-leaf-soft text-primary">
              <SettingsIcon />
            </div>

            <div>
              <h2 className="text-xl font-bold">
                App preferences
              </h2>

              <p className="text-sm text-muted-foreground">
                Customize how AgriVision works for you.
              </p>
            </div>
          </div>
        </Panel>

        <Panel>
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="grid size-10 place-items-center rounded-lg bg-leaf-soft text-primary">
                <Bell className="size-5" />
              </div>

              <div>
                <p className="font-semibold">Notifications</p>

                <p className="text-sm text-muted-foreground">
                  Manage app notification preferences.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={toggleNotifications}
              aria-label="Toggle notifications"
              aria-pressed={notifications}
              className={`relative h-7 w-12 rounded-full transition-colors ${
                notifications
                  ? "bg-primary"
                  : "bg-muted-foreground/30"
              }`}
            >
              <span
                className={`absolute top-1 grid size-5 place-items-center rounded-full bg-white shadow-sm transition-transform ${
                  notifications
                    ? "translate-x-6"
                    : "translate-x-1"
                }`}
              >
                {notifications && (
                  <Check className="size-3 text-primary" />
                )}
              </span>
            </button>
          </div>
        </Panel>
      </div>
    </AppShell>
  );
}