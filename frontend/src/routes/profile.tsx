import { createFileRoute } from "@tanstack/react-router";
import { User } from "lucide-react";
import { AppShell, PageHeader, Panel } from "@/components/agrivision";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/profile")({
  component: ProfilePage,
});

function ProfilePage() {
  const { user } = useAuth();

  return (
    <AppShell>
      <PageHeader
        eyebrow="Your account"
        title="Profile"
        description="View your AgriVision account information."
      />

      <Panel>
        <div className="flex items-center gap-4">
          <div className="grid size-14 place-items-center rounded-full bg-leaf-soft text-primary">
            <User className="size-7" />
          </div>

          <div>
            <h2 className="text-xl font-bold">
              {user?.name ?? "Farmer"}
            </h2>
            <p className="text-sm text-muted-foreground">
              {user?.email ?? "No email available"}
            </p>
          </div>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-lg bg-muted p-4">
            <p className="text-xs font-bold uppercase text-muted-foreground">
              Name
            </p>
            <p className="mt-1 font-semibold">
              {user?.name ?? "—"}
            </p>
          </div>

          <div className="rounded-lg bg-muted p-4">
            <p className="text-xs font-bold uppercase text-muted-foreground">
              Email
            </p>
            <p className="mt-1 font-semibold break-words">
              {user?.email ?? "—"}
            </p>
          </div>
        </div>
      </Panel>
    </AppShell>
  );
}