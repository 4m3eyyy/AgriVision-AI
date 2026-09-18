import { createFileRoute } from "@tanstack/react-router";
import { Bot, Send } from "lucide-react";
import { useState } from "react";
import { api, type ApiRecord, textValue } from "@/lib/api";
import {
  AppShell,
  PageHeader,
  Panel,
  Status,
} from "@/components/agrivision";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/assistant")({
  component: AssistantPage,
});

type Message = {
  role: "user" | "assistant";
  text: string;
};

function FormattedMessage({ text }: { text: string }) {
  return (
    <div className="max-w-full space-y-2 break-words whitespace-pre-wrap leading-7">
      {text.split("\n").map((line, index) => {
        if (line.startsWith("### ")) {
          return (
            <h3 key={index} className="mt-3 text-lg font-bold">
              {line.replace("### ", "")}
            </h3>
          );
        }

        const parts = line.split("**");

        return (
          <p key={index} className="break-words">
            {parts.map((part, i) =>
              i % 2 === 1 ? (
                <strong key={i}>{part}</strong>
              ) : (
                part
              ),
            )}
          </p>
        );
      })}
    </div>
  );
}

function AssistantPage() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const sendMessage = async () => {
    const text = message.trim();

    if (!text || loading) return;

    setMessage("");
    setError("");

    setMessages((prev) => [
      ...prev,
      { role: "user", text },
    ]);

    setLoading(true);

    try {
      const data = (await api.chat(text)) as ApiRecord;

      const response =
        textValue(data, ["response", "message", "answer"]) ||
        "I couldn't generate a response right now.";

      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: response },
      ]);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "We couldn't reach AgriVision AI. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppShell>
      <PageHeader
        eyebrow="AgriVision AI"
        title="Ask AgriVision AI"
        description="Get simple agriculture guidance about crops, plant health, fertilizers, weather, and markets."
      />

      <Panel className="flex min-h-[600px] flex-col overflow-hidden">
        {messages.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center text-center">
            <div className="mb-5 grid size-16 place-items-center rounded-2xl bg-ai-soft text-ai">
              <Bot className="size-8" />
            </div>

            <h2 className="text-xl font-bold">
              How can I help you?
            </h2>

            <p className="mt-2 max-w-md text-sm text-muted-foreground">
              Ask me about growing crops, plant diseases,
              fertilizers, weather, or market prices.
            </p>

            <div className="mt-6 flex flex-wrap justify-center gap-2">
              {[
                "Which fertilizer should I use?",
                "How often should I water my crop?",
                "Why are my leaves turning yellow?",
              ].map((question) => (
                <button
                  key={question}
                  type="button"
                  onClick={() => setMessage(question)}
                  className="rounded-full border border-border px-4 py-2 text-sm transition-colors hover:bg-accent"
                >
                  {question}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="min-h-0 flex-1 space-y-4 overflow-y-auto pr-1">
            {messages.map((item, index) => (
              <div
                key={index}
                className={
                  item.role === "user"
                    ? "ml-auto max-w-[85%] break-words rounded-2xl bg-primary px-4 py-3 text-sm text-primary-foreground"
                    : "mr-auto max-w-full break-words overflow-hidden rounded-2xl bg-muted px-4 py-3 text-sm"
                }
              >
                {item.role === "assistant" ? (
                  <FormattedMessage text={item.text} />
                ) : (
                  item.text
                )}
              </div>
            ))}

            {loading && (
              <Status
                title="AgriVision AI is thinking..."
                message="Preparing a helpful agriculture-focused answer."
              />
            )}

            {error && (
              <Status
                kind="error"
                title="Something went wrong"
                message={error}
              />
            )}
          </div>
        )}

        <form
          onSubmit={(e) => {
            e.preventDefault();
            sendMessage();
          }}
          className="mt-6 flex shrink-0 gap-2 border-t border-border pt-5"
        >
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Ask about your crop, soil, plant, or farm..."
            disabled={loading}
          />

          <Button
            type="submit"
            size="icon"
            disabled={!message.trim() || loading}
            aria-label="Send message"
          >
            <Send />
          </Button>
        </form>
      </Panel>
    </AppShell>
  );
}