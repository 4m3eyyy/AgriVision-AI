import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,Bot,Camera,CloudSun,FlaskConical,Sprout,Store,} from "lucide-react";
import {
  AppShell,PageHeader,Panel,Status,} from "@/components/agrivision";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Home — AgriVision AI" },
      {
        name: "description",
        content: "Choose a farming task and get clear guidance.",
      },
      {
        property: "og:title",
        content: "Your AgriVision AI home",
      },
      {
        property: "og:description",
        content: "Crop, plant, fertilizer, weather and market guidance.",
      },
      {
        property: "og:type",
        content: "website",
      },
      {
        name: "twitter:card",
        content: "summary",
      },
    ],
  }),
  component: Dashboard,
});

const tasks = [
  [
    "/crop",
    Sprout,
    "What should I grow?",
    "Match crops to your soil and climate.",
  ],
  [
    "/fertilizer",
    FlaskConical,
    "Which fertilizer should I use?",
    "Find a suitable option for your field.",
  ],
  [
    "/weather",
    CloudSun,
    "What's the weather?",
    "Check current conditions by city.",
  ],
  [
    "/market",
    Store,
    "Check market prices",
    "Estimate a crop's modal price.",
  ],
] as const;

function Dashboard() {
  const { user } = useAuth();

  return (
    <AppShell>
      <PageHeader
        eyebrow="Your farm companion"
        title={`Good morning${
          user?.name ? `, ${user.name.split(" ")[0]}` : ""
        } 👋`}
        description="Let's take care of your plants today."
      />

      {/* Plant Health Hero */}
      <section className="relative min-h-[300px] overflow-hidden rounded-2xl bg-primary text-primary-foreground shadow-sm">
        {/* Background image */}
        <img
          src="/images/3.jpg"
          alt="Agricultural field"
          className="absolute inset-0 h-full w-full object-cover"
        />

        {/* Green overlay */}
        <div className="absolute inset-0 bg-primary/80" />

        {/* Content */}
        <div className="relative z-10 flex min-h-[300px] flex-col justify-between gap-8 p-6 sm:p-8">
          <div>
            <p className="text-sm font-bold uppercase text-primary-foreground/80">
              Plant health check
            </p>

            <h2 className="mt-2 max-w-3xl text-3xl font-bold">
              Is something wrong with your plant?
            </h2>

            <p className="mt-3 max-w-xl text-primary-foreground/85">
              Take a photo or upload a leaf image and let AgriVision AI check
              it.
            </p>
          </div>

          <div>
            <Button asChild size="lg" variant="secondary">
              <Link to="/plant">
                <Camera />
                Check My Plant
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Main Tasks */}
      <h2 className="mb-4 mt-9 text-2xl font-bold">
        What would you like to do?
      </h2>

      <div className="grid gap-4 sm:grid-cols-2">
        {tasks.map(([to, Icon, title, text]) => (
          <Link
            key={to}
            to={to}
            className="surface-card group rounded-xl p-5 transition-transform hover:-translate-y-0.5"
          >
            <span className="grid size-11 place-items-center rounded-lg bg-leaf-soft text-primary">
              <Icon />
            </span>

            <div className="mt-4 flex items-end justify-between">
              <div>
                <h3 className="text-lg font-bold">{title}</h3>

                <p className="mt-1 text-sm text-muted-foreground">
                  {text}
                </p>
              </div>

              <ArrowRight className="size-5 text-primary" />
            </div>
          </Link>
        ))}
      </div>

      {/* AI Assistant */}
      <Panel className="mt-6 bg-ai-soft">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex gap-4">
            <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-ai text-ai-foreground">
              <Bot />
            </span>

            <div>
              <h2 className="text-xl font-bold">
                Ask AgriVision AI
              </h2>

              <p className="mt-1 text-sm text-muted-foreground">
                Ask about crops, irrigation, pests or farm practices.
              </p>
            </div>
          </div>

          <Button asChild variant="ai">
            <Link to="/assistant">
              Start a conversation
            </Link>
          </Button>
        </div>
      </Panel>

      {/* Snapshots */}
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <Status
          kind="empty"
          title="Weather snapshot"
          message="Search a city to see current farming conditions."
        />

        <Status
          kind="empty"
          title="Market snapshot"
          message="Make a prediction to see your latest market estimate."
        />
      </div>
    </AppShell>
  );
}