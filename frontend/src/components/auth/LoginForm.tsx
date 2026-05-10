import { useState, type FormEvent, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";

function FormHeader() {
  return (
    <div className="text-center mb-3">
      <h1 className="m-0 text-4xl font-bold tracking-wide text-gray-900">
        MOD<span className="text-brand-maroon">TUBE</span>
      </h1>
      <p className="mt-3 text-gray-600 max-w-xs mx-auto leading-relaxed">
        Sign in to enjoy watching movies and access admin controls.
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
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleRealLogin = async (event: FormEvent) => {
    event.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("userRole", data.user.role);

        if (data.user.role === "admin") {
          navigate("/admin/dashboard");
        } else {
          navigate("/customer/home");
        }
      } else {
        alert(data.message);
      }
    } catch (error) {
      alert("เชื่อมต่อเซิร์ฟเวอร์ไม่ได้");
    }
  };

  return (
    <form
      onSubmit={handleRealLogin}
      className="w-full max-w-md bg-white border border-gray-200 rounded-3xl p-8 flex flex-col gap-6 shadow-large"
    >
      <FormHeader />
      <div className="grid gap-6">
        <AuthField htmlFor="username" label="Username or Email">
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

        <AuthField htmlFor="password" label="Password">
          <input
            id="password"
            type="password"
            placeholder="••••••••"
            className="input-field"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </AuthField>

        <button
          type="submit"
          className="bg-blue-600 btn-primary w-full py-3 text-lg font-semibold text-white hover:bg-blue-700"
        >
          Real Sign In
        </button>

        <div className="flex flex-col gap-2">
          <button
            type="button"
            onClick={() => navigate("/admin/dashboard")}
            className="bg-gray-500 btn-primary w-full py-2 text-sm text-white"
          >
            Dummy Admin Btn
          </button>
          <button
            type="button"
            onClick={() => navigate("/customer/home")}
            className="bg-gray-500 btn-primary w-full py-2 text-sm text-white"
          >
            Dummy Customer Btn
          </button>
        </div>
      </div>
    </form>
  );
}
