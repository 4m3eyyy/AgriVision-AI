import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useNavigate } from "@tanstack/react-router";
import { api, type ApiRecord, textValue } from "./api";

type User = {
  name: string;
  email: string;
  role?: string;
};

type AuthContextValue = {
  user: User | null;
  ready: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

function parseUser(
  data: ApiRecord,
  fallbackEmail: string,
  fallbackName = "Farmer",
): User {
  const nested =
    typeof data.user === "object" && data.user
      ? (data.user as ApiRecord)
      : data;

  return {
    name: textValue(nested, ["name", "full_name"]) || fallbackName,
    email: textValue(nested, ["email"]) || fallbackEmail,
    role: textValue(nested, ["role"]) || undefined,
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate();

  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("agrivision_user");

      if (saved) {
        setUser(JSON.parse(saved) as User);
      }
    } finally {
      setReady(true);
    }
  }, []);

  const save = (data: ApiRecord, email: string, name?: string) => {
    const next = parseUser(data, email, name);

    const authToken = textValue(data, ["token", "access_token"]);

    if (authToken) {
      localStorage.setItem("agrivision_token", authToken);
    }

    localStorage.setItem("agrivision_user", JSON.stringify(next));
    setUser(next);
  };

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      ready,

      login: async (email, password) => {
        save(await api.login({ email, password }), email);
      },

      register: async (name, email, password) => {
        save(
          await api.register({
            full_name: name,
            email,
            password,
          }),
          email,
          name,
        );
      },

      logout: () => {
        localStorage.removeItem("agrivision_token");
        localStorage.removeItem("agrivision_user");
        setUser(null);
        navigate({ to: "/auth" });
      },
    }),
    [user, ready, navigate],
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const value = useContext(AuthContext);

  if (!value) {
    throw new Error("AuthProvider is missing");
  }

  return value;
}