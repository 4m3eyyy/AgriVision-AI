export type ApiRecord = Record<string, unknown>;

const base = (import.meta.env.VITE_API_BASE_URL ?? "").replace(/\/$/, "");

function token() {
  if (typeof window === "undefined") return null;

  return window.localStorage.getItem("agrivision_token");
}

async function request<T>(
  path: string,
  init: RequestInit = {},
): Promise<T> {
  const headers = new Headers(init.headers);
  const authToken = token();

  if (authToken) {
    headers.set("Authorization", `Bearer ${authToken}`);
  }

  if (!(init.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  try {
    const response = await fetch(`${base}${path}`, {
      ...init,
      headers,
    });

    const data = (await response.json().catch(() => ({}))) as ApiRecord;
    if (!response.ok) {
      const message = textValue(data, ["message", "error"]);

    throw new Error(
      message || "We couldn't complete that request. Please try again.",
    );
    }

    return data as T;
  } catch (error) {
    if (
      error instanceof Error &&
      error.message !== "Failed to fetch"
    ) {
      throw error;
    }

    throw new Error(
      "We couldn't reach AgriVision right now. Please check your connection and try again.",
    );
  }
}

export const api = {
  login: (body: { email: string; password: string }) =>
    request<ApiRecord>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(body),
    }),

  register: (body: {
    full_name: string;
    email: string;
    password: string;
  }) =>
    request<ApiRecord>("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(body),
    }),

  crop: (body: ApiRecord) =>
    request<ApiRecord>("/api/crop/recommend", {
      method: "POST",
      body: JSON.stringify(body),
    }),

  disease: (file: File) => {
    const body = new FormData();
    body.append("image", file);

    return request<ApiRecord>("/api/disease/predict", {
      method: "POST",
      body,
    });
  },

  fertilizer: (body: ApiRecord) =>
    request<ApiRecord>("/api/fertilizer/recommend", {
      method: "POST",
      body: JSON.stringify(body),
    }),

  weather: (city: string) =>
    request<ApiRecord>(
      `/api/weather?city=${encodeURIComponent(city)}`,
    ),

  weatherByLocation: (latitude: number, longitude: number) =>
    request<ApiRecord>(
      `/api/weather?latitude=${latitude}&longitude=${longitude}`,
    ),

  market: (body: ApiRecord) =>
    request<ApiRecord>("/api/market/predict", {
      method: "POST",
      body: JSON.stringify(body),
    }),

  chat: (message: string) =>
    request<ApiRecord>("/api/chat", {
      method: "POST",
      body: JSON.stringify({ message }),
    }),
};

export function textValue(
  data: ApiRecord,
  keys: string[],
) {
  for (const key of keys) {
    if (
      typeof data[key] === "string" ||
      typeof data[key] === "number"
    ) {
      return String(data[key]);
    }
  }

  return "";
}