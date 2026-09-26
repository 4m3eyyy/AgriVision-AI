import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Bot,
  Camera,
  CheckCircle2,
  CloudSun,
  FlaskConical,
  Leaf,
  Sprout,
  Store,
} from "lucide-react";
import { Brand } from "@/components/agrivision";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      {
        title: "AgriVision AI — Smarter decisions for healthier crops",
      },
      {
        name: "description",
        content:
          "Crop, plant health, fertilizer, weather, market and agriculture guidance in one simple platform.",
      },
      {
        property: "og:title",
        content: "AgriVision AI",
      },
      {
        property: "og:description",
        content: "Smarter decisions for healthier crops.",
      },
      {
        property: "og:type",
        content: "website",
      },
      {
        name: "twitter:card",
        content: "summary_large_image",
      },
    ],
  }),
  component: Landing,
});

const features = [
  [
    Sprout,
    "Crop Recommendation",
    "Find crops suited to your soil and local climate.",
  ],
  [
    Camera,
    "Plant Disease Detection",
    "Check an affected leaf with a quick photo.",
  ],
  [
    FlaskConical,
    "Fertilizer Recommendation",
    "Choose nutrients with confidence and care.",
  ],
  [
    CloudSun,
    "Weather Intelligence",
    "See current conditions for your location.",
  ],
  [
    Store,
    "Market Intelligence",
    "Estimate crop prices for a chosen market.",
  ],
  [
    Bot,
    "AgriVision AI Assistant",
    "Ask everyday questions about your farm.",
  ],
] as const;

function Landing() {
  return (
    <div className="min-h-screen">
      <header className="mx-auto flex max-w-7xl items-center justify-between px-4 py-5 sm:px-8">
        <Brand />

        <Link to="/auth">
          <Button variant="outline">Sign in</Button>
        </Link>
      </header>

      <main>
        <section className="mx-auto grid min-h-[68vh] max-w-7xl items-center gap-10 px-4 py-14 sm:px-8 lg:grid-cols-[1.15fr_.85fr] lg:py-20">
          
          {/* Left content */}
          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-leaf-soft px-3 py-2 text-sm font-semibold text-primary">
              <Leaf className="size-4" />
              Your digital agriculture companion
            </div>

            <h1 className="max-w-3xl text-5xl font-bold leading-[1.08] sm:text-6xl lg:text-7xl">
              Smarter decisions for healthier crops.
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
              AgriVision AI brings crop recommendations, plant disease
              detection, fertilizer guidance, weather intelligence, market
              predictions and an agriculture AI assistant into one simple
              platform.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg">
                <Link to="/auth">
                  Get Started
                  <ArrowRight />
                </Link>
              </Button>

              <Button asChild size="lg" variant="outline">
                <a href="#features">Explore Features</a>
              </Button>
            </div>

            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm font-semibold text-muted-foreground">
              <span className="flex gap-2">
                <CheckCircle2 className="size-5 text-primary" />
                Simple guidance
              </span>

              <span className="flex gap-2">
                <CheckCircle2 className="size-5 text-primary" />
                Built for mobile
              </span>

              <span className="flex gap-2">
                <CheckCircle2 className="size-5 text-primary" />
                Clear next steps
              </span>
            </div>
          </div>

          {/* Green agriculture image card */}
          <div className="relative mx-auto aspect-square w-full max-w-lg overflow-hidden rounded-[2rem] bg-primary text-primary-foreground shadow-2xl">
            
            {/* Agriculture image */}
            <img
              src="/images/agriculture-water.jpg"
              alt="Agricultural field"
              className="absolute inset-0 h-full w-full object-cover"
            />

            {/* Green overlay */}
            <div className="absolute inset-0 bg-primary/75" />

            
            {/* Card content */}
            <div className="relative z-10 flex h-full flex-col justify-between p-8">
              
              <span className="grid size-16 place-items-center rounded-2xl bg-primary-foreground/15 backdrop-blur-sm">
                <Sprout className="size-9" />
              </span>

              <div>
                <p className="text-sm font-bold uppercase">
                  Start with one question
                </p>

                <h2 className="mt-3 text-4xl font-bold">
                  What do you want help with today?
                </h2>

                <p className="mt-4 text-primary-foreground/85">
                  Choose a task. AgriVision guides you step by step.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section
          id="features"
          className="border-y border-border bg-card py-16"
        >
          <div className="mx-auto max-w-7xl px-4 sm:px-8">
            <h2 className="text-3xl font-bold">
              One companion, six ways to help
            </h2>

            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {features.map(([Icon, title, text]) => (
                <div
                  key={title}
                  className="rounded-xl border border-border bg-background p-5"
                >
                  <span className="grid size-11 place-items-center rounded-lg bg-leaf-soft text-primary">
                    <Icon />
                  </span>

                  <h3 className="mt-5 text-xl font-bold">
                    {title}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    {text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="px-4 py-8 text-center text-sm text-muted-foreground">
        AgriVision AI · Better farming decisions, made simpler.
      </footer>
    </div>
  );
}