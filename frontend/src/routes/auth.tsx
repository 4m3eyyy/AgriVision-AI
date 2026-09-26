import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { Brand, Field, Panel, Status } from "@/components/agrivision";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign in — AgriVision AI" },
      {
        name: "description",
        content: "Sign in or create your AgriVision AI account.",
      },
      {
        property: "og:title",
        content: "Sign in — AgriVision AI",
      },
      {
        property: "og:description",
        content: "Access your personal agriculture companion.",
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
  component: AuthPage,
});

function AuthPage() {
  const [mode, setMode] = useState<"login" | "register">("login");

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const auth = useAuth();
  const navigate = useNavigate();

  async function submit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");

    try {
      if (mode === "login") {
        await auth.login(form.email, form.password);
      } else {
        await auth.register(form.name, form.email, form.password);
      }

      await navigate({ to: "/dashboard" });
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Please try again.",
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="grid min-h-screen lg:grid-cols-2">

      {/* Left agriculture image section */}
      <section className="relative hidden overflow-hidden bg-primary text-primary-foreground lg:flex lg:flex-col lg:justify-between">

        {/* Agriculture image */}
        <img
          src="/images/2.jpg"
          alt="Agricultural field"
          className="absolute inset-0 h-full w-full object-cover"
        />

        {/* Green overlay */}
        <div className="absolute inset-0 bg-primary/75" />

        {/* Content */}
        <div className="relative z-10 flex h-full flex-col justify-between p-12">

          <Brand />

          <div>
            <LeafMark />

            <h1 className="max-w-lg text-5xl font-bold">
              A clearer path from question to action.
            </h1>

            <p className="mt-5 max-w-lg text-primary-foreground/85">
              Check plants, plan crops, understand weather and make informed
              market decisions.
            </p>
          </div>

          <p className="text-sm text-primary-foreground/70">
            Designed to feel simple in the field.
          </p>
        </div>
      </section>

      {/* Login / Register section */}
      <section className="grid place-items-center px-4 py-10">
        <div className="w-full max-w-md">

          <div className="mb-8 lg:hidden">
            <Brand />
          </div>

          <Panel>
            <h1 className="text-3xl font-bold">
              {mode === "login"
                ? "Welcome back"
                : "Create your account"}
            </h1>

            <p className="mt-2 text-sm text-muted-foreground">
              {mode === "login"
                ? "Sign in to continue to your farm assistant."
                : "Start making clearer farming decisions today."}
            </p>

            <div className="mt-6 grid grid-cols-2 rounded-lg bg-muted p-1">
              <button
                type="button"
                onClick={() => setMode("login")}
                className={
                  mode === "login"
                    ? "rounded-md bg-card py-2 text-sm font-bold shadow-sm"
                    : "py-2 text-sm text-muted-foreground"
                }
              >
                Sign in
              </button>

              <button
                type="button"
                onClick={() => setMode("register")}
                className={
                  mode === "register"
                    ? "rounded-md bg-card py-2 text-sm font-bold shadow-sm"
                    : "py-2 text-sm text-muted-foreground"
                }
              >
                Register
              </button>
            </div>

            <form onSubmit={submit} className="mt-6 space-y-4">

              {mode === "register" && (
                <Field
                  label="Full name"
                  name="name"
                  autoComplete="name"
                  value={form.name}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      name: e.target.value,
                    })
                  }
                  required
                />
              )}

              <Field
                label="Email"
                name="email"
                type="email"
                autoComplete="email"
                value={form.email}
                onChange={(e) =>
                  setForm({
                    ...form,
                    email: e.target.value,
                  })
                }
                required
              />

              <Field
                label="Password"
                name="password"
                type="password"
                minLength={6}
                autoComplete={
                  mode === "login"
                    ? "current-password"
                    : "new-password"
                }
                value={form.password}
                onChange={(e) =>
                  setForm({
                    ...form,
                    password: e.target.value,
                  })
                }
                required
              />

              {error && (
                <Status
                  kind="error"
                  title="We couldn't sign you in"
                  message={error}
                />
              )}

              <Button
                className="w-full"
                size="lg"
                disabled={busy}
              >
                {busy
                  ? "Please wait…"
                  : mode === "login"
                    ? "Sign in"
                    : "Create account"}
              </Button>

            </form>
          </Panel>
        </div>
      </section>
    </main>
  );
}

function LeafMark() {
  return (
    <div className="mb-8 grid size-16 place-items-center rounded-2xl bg-primary-foreground/15">
      <span className="text-3xl">🌱</span>
    </div>
  );
}