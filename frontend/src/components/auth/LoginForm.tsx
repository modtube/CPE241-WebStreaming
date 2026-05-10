import { useState, type FormEvent, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { api, setCurrentUser, type SessionUser } from "../../../lib/api";

function FormHeader({ mode }: { mode: "login" | "register" }) {
  return (
    <div className="text-center mb-3">
      <h1 className="m-0 text-4xl font-bold tracking-wide text-gray-900">
        MOD<span className="text-brand-maroon">TUBE</span>
      </h1>
      <p className="mt-3 text-gray-600 max-w-xs mx-auto leading-relaxed">
        {mode === "login"
          ? "Sign in to enjoy watching movies and access admin controls."
          : "Create your account to start watching."}
      </p>
    </div>
  );
}

function AuthField({
  htmlFor,
  label,
  children,
}: {
  htmlFor: string;
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={htmlFor} className="text-sm font-semibold text-gray-700">
        {label}
      </label>
      {children}
    </div>
  );
}

export default function LoginForm() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (mode === "login") {
        const result = await api.post<{ user: SessionUser }>("/api/auth/login", {
          username,
          password,
        });
        setCurrentUser(result.user);
        // route ตาม role
        if (result.user.user_role === "admin") {
          navigate("/admin/dashboard");
        } else {
          navigate("/customer/home");
        }
      } else {
        const result = await api.post<{ user: SessionUser }>("/api/auth/register", {
          username,
          email,
          password,
        });
        setCurrentUser(result.user);
        navigate("/customer/home");
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "เกิดข้อผิดพลาด";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-md bg-white border border-gray-200 rounded-3xl p-8 flex flex-col gap-6 shadow-large"
    >
      <FormHeader mode={mode} />

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded text-sm">
          {error}
        </div>
      )}

      <div className="grid gap-6">
        <AuthField htmlFor="username" label="Username">
          <input
            id="username"
            type="text"
            placeholder="Enter your username"
            className="input-field"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </AuthField>

        {mode === "register" && (
          <AuthField htmlFor="email" label="Email">
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              className="input-field"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </AuthField>
        )}

        <AuthField htmlFor="password" label="Password">
          <input
            id="password"
            type="password"
            placeholder="••••••••"
            className="input-field"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={mode === "register" ? 6 : undefined}
          />
        </AuthField>

        <button
          type="submit"
          disabled={loading}
          className="bg-brand-maroon btn-primary w-full py-3 text-lg font-semibold disabled:opacity-50"
        >
          {loading
            ? "กำลังโหลด..."
            : mode === "login"
            ? "Sign In"
            : "Create Account"}
        </button>

        <div className="text-center text-sm text-gray-600 mt-2">
          {mode === "login" ? (
            <>
              Don't have an account?{" "}
              <button
                type="button"
                onClick={() => {
                  setMode("register");
                  setError(null);
                }}
                className="text-brand-maroon hover:text-brand-maroon font-semibold"
              >
                Sign up
              </button>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => {
                  setMode("login");
                  setError(null);
                }}
                className="text-brand-maroon hover:text-brand-maroon font-semibold"
              >
                Sign in
              </button>
            </>
          )}
        </div>
      </div>
    </form>
  );
}
