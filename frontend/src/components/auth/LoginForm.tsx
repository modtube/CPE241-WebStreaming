import { useState, useEffect, type FormEvent, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { message } from "antd"; // ใช้สำหรับแจ้งเตือนตอนเชื่อมต่อเซิร์ฟเวอร์ไม่ได้

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
  const [error, setError] = useState(""); // 🟢 State สำหรับเก็บข้อความ Error
  const [loading, setLoading] = useState(false); // 🟢 State สำหรับ Loading

  // 🟢 1. ตรวจสอบ Token เมื่อเข้าหน้านี้ (Auto Redirect)
  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("userRole");

    if (token && role) {
      if (role === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/customer/home");
      }
    }
  }, [navigate]);

  const handleRealLogin = async (event: FormEvent) => {
    event.preventDefault();
    setError(""); // ล้าง error เก่าก่อนเริ่ม
    setLoading(true);

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
        // 🟢 เพิ่มบรรทัดนี้เพื่อเก็บชื่อไปแสดงที่ Sidebar
        localStorage.setItem("id", data.user.id);
        localStorage.setItem("username", data.user.username);
        localStorage.setItem("email", data.user.email);

        if (data.user.role === "admin") {
          navigate("/admin/dashboard");
        } else {
          navigate("/customer/home");
        }
      } else {
        // 🟢 2. เซ็ตข้อความ Error แทนการใช้ alert
        setError(data.message || "Username หรือ Password ไม่ถูกต้อง");
      }
    } catch (err) {
      message.error("ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้");
    } finally {
      setLoading(false);
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
            className={`input-field ${error ? "border-red-500" : ""}`}
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
            className={`input-field ${error ? "border-red-500" : ""}`}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </AuthField>

        {/* 🟢 3. แสดงข้อความ Error สีแดงใต้ช่องกรอก */}
        {error && (
          <div className="text-red-500 text-sm font-medium animate-pulse">
            * {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className={`btn-primary w-full py-3 text-lg font-semibold text-white transition-all 
            ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"}`}
        >
          {loading ? "Signing In..." : "Real Sign In"}
        </button>

        <div className="flex flex-col gap-2 border-t pt-4">
          <p className="text-xs text-gray-400 text-center mb-1">
            Quick Access (Dev Only)
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => navigate("/admin/dashboard")}
              className="bg-gray-100 hover:bg-gray-200 text-gray-600 btn-primary flex-1 py-2 text-xs"
            >
              Dummy Admin
            </button>
            <button
              type="button"
              onClick={() => navigate("/customer/home")}
              className="bg-gray-100 hover:bg-gray-200 text-gray-600 btn-primary flex-1 py-2 text-xs"
            >
              Dummy Customer
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
