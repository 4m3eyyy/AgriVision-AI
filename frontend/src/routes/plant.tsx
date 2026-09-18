import { createFileRoute } from "@tanstack/react-router";
import { Camera, CheckCircle2, RotateCcw, Upload, X } from "lucide-react";
import { useRef, useState } from "react";
import { api, type ApiRecord, textValue } from "@/lib/api";
import {
  AppShell,
  PageHeader,
  Panel,
  Status,
} from "@/components/agrivision";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/plant")({
  component: PlantPage,
});

function PlantPage() {
  const cameraInput = useRef<HTMLInputElement>(null);
  const uploadInput = useRef<HTMLInputElement>(null);

  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [result, setResult] = useState<ApiRecord | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const selectFile = (selected: File | undefined) => {
    if (!selected) return;

    setFile(selected);
    setPreview(URL.createObjectURL(selected));
    setResult(null);
    setError("");
  };

  const clearFile = () => {
    setFile(null);
    setPreview("");
    setResult(null);
    setError("");

    if (cameraInput.current) cameraInput.current.value = "";
    if (uploadInput.current) uploadInput.current.value = "";
  };

  const analyzePlant = async () => {
    if (!file) return;

    setLoading(true);
    setError("");

    try {
      const data = await api.disease(file);
      setResult(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "We couldn't analyze the plant. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const disease =
    textValue(result ?? {}, ["disease", "prediction", "result"]) ||
    "Disease identified";

  const confidence = textValue(result ?? {}, ["confidence"]);
  const status = textValue(result ?? {}, ["status"]);

  return (
    <AppShell>
      <PageHeader
        eyebrow="Plant health check"
        title="Is something wrong with your plant?"
        description="Take a photo or upload a leaf image and let AgriVision AI check it."
      />

      {!preview ? (
        <Panel>
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="mb-5 grid size-16 place-items-center rounded-2xl bg-leaf-soft text-primary">
              <Camera className="size-8" />
            </div>

            <h2 className="text-xl font-bold">Check your plant</h2>

            <p className="mt-2 max-w-md text-sm text-muted-foreground">
              Take a clear photo of a plant leaf or upload an existing image.
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Button
                size="lg"
                onClick={() => cameraInput.current?.click()}
              >
                <Camera />
                Take Photo
              </Button>

              <Button
                size="lg"
                variant="outline"
                onClick={() => uploadInput.current?.click()}
              >
                <Upload />
                Upload Image
              </Button>
            </div>

            <input
              ref={cameraInput}
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden"
              onChange={(e) => selectFile(e.target.files?.[0])}
            />

            <input
              ref={uploadInput}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => selectFile(e.target.files?.[0])}
            />

            <p className="mt-5 text-xs text-muted-foreground">
              For best results, use a clear close-up of the leaf.
            </p>
          </div>
        </Panel>
      ) : (
        <div className="space-y-5">
          <Panel>
            <div className="overflow-hidden rounded-xl border border-border">
              <img
                src={preview}
                alt="Selected plant"
                className="mx-auto max-h-[420px] w-full object-contain"
              />
            </div>

            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              <Button
                variant="outline"
                onClick={clearFile}
                disabled={loading}
              >
                <RotateCcw />
                Retake / Choose Another
              </Button>

              <Button onClick={analyzePlant} disabled={loading}>
                <Camera />
                {loading ? "Analyzing..." : "Analyze Plant"}
              </Button>
            </div>
          </Panel>

          {loading && (
            <Status
              title="Analyzing your plant..."
              message="AgriVision AI is checking the image for possible plant diseases."
            />
          )}

          {error && (
            <Status
              kind="error"
              title="Analysis failed"
              message={error}
            />
          )}

          {result && !loading && (
            <Panel>
              <div className="flex items-start gap-4">
                <div className="grid size-12 shrink-0 place-items-center rounded-xl bg-leaf-soft text-primary">
                  {status === "low_confidence" ? (
                    <X />
                  ) : (
                    <CheckCircle2 />
                  )}
                </div>

                <div>
                  <p className="text-sm font-semibold text-muted-foreground">
                    {status === "low_confidence"
                      ? "Low confidence"
                      : "Plant health result"}
                  </p>

                  <h2 className="mt-1 text-2xl font-bold">
                    {status === "low_confidence"
                      ? "Couldn’t identify the disease confidently"
                      : disease}
                  </h2>

                  {confidence && (
                    <p className="mt-2 text-sm text-muted-foreground">
                      Confidence: {confidence}
                    </p>
                  )}

                  <p className="mt-3 text-sm text-muted-foreground">
                    {textValue(result, ["message"]) ||
                      "Analysis completed successfully."}
                  </p>
                </div>
              </div>
            </Panel>
          )}
        </div>
      )}
    </AppShell>
  );
}