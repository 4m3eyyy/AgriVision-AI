import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  CloudRain,
  CloudSun,
  Droplets,
  MapPin,
  Search,
  Thermometer,
  Wind,
  Loader2,
} from "lucide-react";

import { api, type ApiRecord, textValue } from "@/lib/api";
import {
  AppShell,
  Field,
  PageHeader,
  Panel,
  Result,
  Status,
  useFormSubmit,
} from "@/components/agrivision";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/weather")({
  head: () => ({
    meta: [
      {
        title: "Weather Intelligence — AgriVision AI",
      },
      {
        name: "description",
        content: "Check simple current weather conditions for your city.",
      },
      {
        property: "og:title",
        content: "Weather Intelligence — AgriVision AI",
      },
      {
        property: "og:description",
        content: "Current weather information for better farm planning.",
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
  component: WeatherPage,
});

function WeatherPage() {
  const [city, setCity] = useState("");
  const [result, setResult] = useState<ApiRecord | null>(null);
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationError, setLocationError] = useState("");

  const flow = useFormSubmit(() => api.weather(city), setResult);

  const weatherData = result?.["weather"] as ApiRecord | undefined;

  const val = (keys: string[]) =>
    textValue(
      {
        ...(result ?? {}),
        ...(weatherData ?? {}),
      },
      keys,
    );

  const useMyLocation = () => {
    setLocationError("");

    if (!navigator.geolocation) {
      setLocationError("Location is not supported by your browser.");
      return;
    }

    setLocationLoading(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;

          const weatherResult = await api.weatherByLocation(
            latitude,
            longitude,
          );

          
          setResult(weatherResult);
          const locationData = weatherResult["weather"] as ApiRecord | undefined;
          setCity(String(locationData?.["location"] ?? ""));
        } catch (error) {
          setLocationError(
            error instanceof Error
              ? error.message
              : "We couldn't get your location.",
          );
        } finally {
          setLocationLoading(false);
        }
      },
      (error) => {
        setLocationLoading(false);

        if (error.code === error.PERMISSION_DENIED) {
          setLocationError(
            "Location permission was denied. You can search for your city instead.",
          );
        } else {
          setLocationError(
            "We couldn't access your location. Please search for your city instead.",
          );
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000,
      },
    );
  };

  return (
    <AppShell>
      <PageHeader
        eyebrow="Weather intelligence"
        title="What's the weather?"
        description="Use your location or search for a city to see current conditions."
      />

      <Panel>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button
            type="button"
            size="lg"
            variant="outline"
            onClick={useMyLocation}
            disabled={locationLoading || flow.loading}
            className="sm:mt-0"
          >
            {locationLoading ? (
              <Loader2 className="animate-spin" />
            ) : (
              <MapPin />
            )}
            {locationLoading ? "Finding you..." : "Use My Location"}
          </Button>

          <div className="hidden items-center text-sm text-muted-foreground sm:flex">
            or
          </div>
        </div>

        <form
          onSubmit={flow.submit}
          className="mt-4 flex flex-col gap-3 sm:flex-row"
        >
          <div className="flex-1">
            <Field
              label="Search city"
              name="city"
              placeholder="For example, Nashik"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              required
            />
          </div>

          <Button
            className="sm:mt-7"
            size="lg"
            disabled={flow.loading || locationLoading}
          >
            <Search />
            Check Weather
          </Button>
        </form>

        {locationError && (
          <p className="mt-3 text-sm text-destructive">
            {locationError}
          </p>
        )}
      </Panel>

      <div className="mt-5">
        {flow.loading && (
          <Status
            title="Getting current weather..."
            message={`Looking up conditions for ${city}.`}
          />
        )}

        {locationLoading && (
          <Status
            title="Finding your location..."
            message="Detecting your city and checking the current weather."
          />
        )}

        {flow.error && (
          <Status
            kind="error"
            title="We couldn't get the weather"
            message={flow.error}
          />
        )}

        {result && (
          <Result
            icon={CloudSun}
            tone="blue"
            label="Current weather"
            value={val(["location", "city", "name"]) || city}
          >
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  icon: Thermometer,
                  label: "Temperature",
                  value: val(["temperature", "temp"]),
                  unit: "°C",
                },
                {
                  icon: Thermometer,
                  label: "Feels like",
                  value: val(["apparent_temperature", "feels_like"]),
                  unit: "°C",
                },
                {
                  icon: CloudSun,
                  label: "Condition",
                  value: val([
                    "weather_description",
                    "weather_condition",
                    "condition",
                    "weather",
                  ]),
                  unit: "",
                },
                {
                  icon: Droplets,
                  label: "Humidity",
                  value: val(["humidity"]),
                  unit: "%",
                },
                {
                  icon: CloudRain,
                  label: "Precipitation",
                  value: val(["precipitation", "rain"]),
                  unit: " mm",
                },
                {
                  icon: Wind,
                  label: "Wind",
                  value: val(["wind_speed", "windspeed"]),
                  unit: " km/h",
                },
              ].map(({ icon: Icon, label, value, unit }) => (
                <div
                  key={label}
                  className="rounded-lg bg-weather-soft p-4"
                >
                  <Icon className="size-5 text-weather" />

                  <p className="mt-3 text-xs font-bold uppercase text-muted-foreground">
                    {label}
                  </p>

                  <p className="mt-1 text-lg font-bold">
                    {value || "—"}
                    {value ? unit : ""}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="size-4" />
              {val(["location", "city", "name"]) || city}
            </div>
          </Result>
        )}
      </div>
    </AppShell>
  );
}