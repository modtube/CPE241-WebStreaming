import { useState, useEffect, type FormEvent, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { message } from "antd";

// ── ส่วนหัวของฟอร์ม ─────────────────────────────────────
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

// ── ส่วนจัดการฟิลด์ Input ─────────────────────────────────────
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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // 1. States สำหรับ Login
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // 2. States สำหรับ Register Modal
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [registerError, setRegisterError] = useState("");
  const [registerData, setRegisterData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    country: "",
    img_path: "",
  });

  // 3. States สำหรับ Forgot Password Modal
  const [isForgotOpen, setIsForgotOpen] = useState(false);
  const [forgotData, setForgotData] = useState({
    identifier: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [forgotStatus, setForgotStatus] = useState<{
    type: "success" | "error" | null;
    msg: string;
  }>({ type: null, msg: "" });

  const [countries, setCountries] = useState<any[]>([]);

  // ดึงข้อมูลประเทศมาไว้รอ
  useEffect(() => {
    fetch("http://localhost:5000/api/countries")
      .then((res) => res.json())
      .then((json) => setCountries(json.data || []))
      .catch((err) => console.error(err));
  }, []);

  // เช็ค Token ถ้าล็อกอินอยู่แล้วให้ข้ามไปเลย
  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("userRole");
    if (token && role) {
      role === "admin"
        ? navigate("/admin/dashboard")
        : navigate("/customer/home");
    }
  }, [navigate]);

  // ── ฟังก์ชันกลางสำหรับการ Login ─────────────────────────────
  const executeLogin = async (credentials: {
    username: string;
    password: string;
  }) => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("userRole", data.user.role);
        localStorage.setItem("id", data.user.id);
        localStorage.setItem("username", data.user.username);
        localStorage.setItem("email", data.user.email);
        message.success(`ยินดีต้อนรับกลับมา, ${data.user.username}!`);
        data.user.role === "admin"
          ? navigate("/admin/dashboard")
          : navigate("/customer/home");
      } else {
        setError(data.message || "Username หรือ Password ไม่ถูกต้อง");
      }
    } catch (err) {
      message.error("ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้");
    } finally {
      setLoading(false);
    }
  };

  // ── ฟังก์ชันสำหรับการสมัครสมาชิก (Register) ────────────────────────
  const handleRegister = async () => {
    setRegisterError("");
    if (
      !registerData.username ||
      !registerData.email ||
      !registerData.password
    ) {
      setRegisterError("กรุณากรอกข้อมูลที่จำเป็นให้ครบถ้วน");
      return;
    }
    if (registerData.password !== registerData.confirmPassword) {
      setRegisterError("รหัสผ่านใหม่ไม่ตรงกัน");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: registerData.username,
          email: registerData.email,
          password: registerData.password,
          confirm_password: registerData.confirmPassword,
          img_path: registerData.img_path,
          country_code: registerData.country,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        message.success("สร้างบัญชีสำเร็จ!");
        setIsRegisterOpen(false);
        // Auto Login ทันที
        await executeLogin({
          username: registerData.username,
          password: registerData.password,
        });
      } else {
        setRegisterError(data.message || "สมัครไม่สำเร็จ");
      }
    } catch (err) {
      message.error("Connection Error");
    } finally {
      setLoading(false);
    }
  };

  // ── ฟังก์ชันสำหรับลืมรหัสผ่าน (Forgot Password) ───────────────────
  const handleResetPassword = async () => {
    if (
      !forgotData.identifier ||
      !forgotData.newPassword ||
      !forgotData.confirmPassword
    ) {
      setForgotStatus({ type: "error", msg: "กรุณากรอกข้อมูลให้ครบ" });
      return;
    }
    if (forgotData.newPassword !== forgotData.confirmPassword) {
      setForgotStatus({ type: "error", msg: "รหัสผ่านไม่ตรงกัน" });
      return;
    }

    setLoading(true);
    setForgotStatus({ type: null, msg: "" });
    try {
      const response = await fetch(
        "http://localhost:5000/api/users/reset-password",
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            identifier: forgotData.identifier,
            new_password: forgotData.newPassword,
            confirm_password: forgotData.confirmPassword,
          }),
        },
      );
      const data = await response.json();
      if (response.ok) {
        setForgotStatus({ type: "success", msg: "Reset Successful!" });
        setTimeout(() => {
          setIsForgotOpen(false);
          window.location.reload(); // Redirect โดยการรีเฟรชหน้า Login
        }, 2000);
      } else {
        setForgotStatus({ type: "error", msg: data.message || "Failed" });
      }
    } catch (err) {
      setForgotStatus({ type: "error", msg: "Error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* ── Login Form ── */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          executeLogin({ username, password });
        }}
        className="w-full max-w-md bg-white border border-gray-200 rounded-3xl p-8 flex flex-col gap-6 shadow-large"
      >
        <FormHeader />
        <div className="grid gap-6">
          <AuthField htmlFor="username" label="Username or Email">
            <input
              id="username"
              type="text"
              placeholder="Enter username"
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
            <div className="text-right">
              <button
                type="button"
                onClick={() => setIsForgotOpen(true)}
                className="text-[10px] font-bold text-gray-400 hover:text-brand-maroon uppercase tracking-widest transition-colors"
              >
                Forgot Password?
              </button>
            </div>
          </AuthField>

          {error && (
            <div className="text-red-500 text-sm font-medium animate-pulse">
              * {error}
            </div>
          )}

          <div className="flex flex-col gap-3">
            <button
              type="submit"
              disabled={loading}
              className={`btn-primary w-full py-3 text-lg font-semibold text-white transition-all ${loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"}`}
            >
              {loading ? "Signing In..." : "Real Sign In"}
            </button>
            <div className="text-center">
              <button
                type="button"
                onClick={() => setIsRegisterOpen(true)}
                className="text-sm font-bold text-gray-500 hover:text-brand-maroon"
              >
                Don't have an account?{" "}
                <span className="underline">Create Account</span>
              </button>
            </div>
          </div>

          {/* Quick Access (Dev Only) */}
          <div className="flex flex-col gap-3 border-t pt-4">
            <p className="text-[10px] text-gray-400 text-center font-bold uppercase tracking-widest">
              Quick Access
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() =>
                  executeLogin({
                    username: "somchai_t",
                    password: "$2a$10$hashedpassword01",
                  })
                }
                className="flex-1 bg-gray-50 hover:bg-gray-100 border border-gray-200 py-3 rounded-xl text-[11px] font-bold text-gray-600 flex items-center justify-center gap-2"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>{" "}
                Quick Admin
              </button>
              <button
                type="button"
                onClick={() =>
                  executeLogin({
                    username: "emily_jones",
                    password: "$2a$10$hashedpassword05",
                  })
                }
                className="flex-1 bg-gray-50 hover:bg-gray-100 border border-gray-200 py-3 rounded-xl text-[11px] font-bold text-gray-600 flex items-center justify-center gap-2"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-brand-maroon"></span>{" "}
                Quick Customer
              </button>
            </div>
          </div>
        </div>
      </form>

      {/* ── Register Modal ── */}
      {isRegisterOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-300">
          <div
            className="bg-white p-8 md:p-10 rounded-[2.5rem] max-w-lg w-full relative shadow-2xl animate-in zoom-in-95 duration-200 overflow-y-auto max-h-[90vh] scrollbar-none"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsRegisterOpen(false)}
              className="absolute top-6 right-6 text-gray-400 hover:text-black"
            >
              ✕
            </button>
            <div className="text-center mb-6">
              <h2 className="text-3xl font-bold text-gray-900 mb-1">
                Create Account
              </h2>
              <p className="text-xs text-gray-400 font-bold uppercase tracking-widest opacity-60">
                Join ModTube Community
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <AuthField htmlFor="reg-img" label="Profile Image Path">
                  <div className="flex gap-3 items-center">
                    <div className="w-12 h-12 rounded-2xl bg-gray-100 flex-shrink-0 overflow-hidden border border-gray-100">
                      <img
                        src={
                          registerData.img_path ||
                          "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"
                        }
                        alt=""
                        className="w-full h-full object-cover"
                        onError={(e) =>
                          (e.currentTarget.src =
                            "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix")
                        }
                      />
                    </div>
                    <input
                      type="text"
                      placeholder="/img/profiles/user.jpg"
                      className="input-field-register text-sm bg-gray-50/50"
                      value={registerData.img_path}
                      onChange={(e) =>
                        setRegisterData({
                          ...registerData,
                          img_path: e.target.value,
                        })
                      }
                    />
                  </div>
                </AuthField>
              </div>
              <AuthField htmlFor="reg-user" label="Username">
                <input
                  type="text"
                  className="input-field-register text-sm"
                  value={registerData.username}
                  onChange={(e) =>
                    setRegisterData({
                      ...registerData,
                      username: e.target.value,
                    })
                  }
                />
              </AuthField>
              <AuthField htmlFor="reg-email" label="Email">
                <input
                  type="email"
                  className="input-field-register text-sm"
                  value={registerData.email}
                  onChange={(e) =>
                    setRegisterData({ ...registerData, email: e.target.value })
                  }
                />
              </AuthField>
              <AuthField htmlFor="reg-pass" label="Password">
                <input
                  type="password"
                  className="input-field-register text-sm"
                  value={registerData.password}
                  onChange={(e) =>
                    setRegisterData({
                      ...registerData,
                      password: e.target.value,
                    })
                  }
                />
              </AuthField>
              <AuthField htmlFor="reg-conf" label="Confirm Password">
                <input
                  type="password"
                  className="input-field-register text-sm"
                  value={registerData.confirmPassword}
                  onChange={(e) =>
                    setRegisterData({
                      ...registerData,
                      confirmPassword: e.target.value,
                    })
                  }
                />
              </AuthField>
              <div className="md:col-span-2">
                <AuthField htmlFor="reg-country" label="Country">
                  <select
                    className="input-field-register text-sm bg-gray-50/50 outline-none appearance-none"
                    value={registerData.country}
                    onChange={(e) =>
                      setRegisterData({
                        ...registerData,
                        country: e.target.value,
                      })
                    }
                  >
                    <option value="" disabled>
                      Select location
                    </option>
                    {countries.map((c) => (
                      <option key={c.country_code} value={c.country_code}>
                        {c.country_name}
                      </option>
                    ))}
                  </select>
                </AuthField>
              </div>
            </div>
            {registerError && (
              <div className="mt-4 text-red-500 text-xs font-bold bg-red-50 p-3 rounded-xl border border-red-100">
                * {registerError}
              </div>
            )}
            <div className="mt-8 space-y-4">
              <button
                disabled={loading}
                className={`w-full py-4 rounded-2xl text-white font-bold transition-all shadow-xl active:scale-95 ${loading ? "bg-gray-400" : "bg-brand-maroon hover:bg-black shadow-brand-maroon/10"}`}
                onClick={handleRegister}
              >
                {loading ? "Processing..." : "Sign Up & Continue"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Forgot Password Modal ── */}
      {isForgotOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-300">
          <div className="bg-white p-8 md:p-10 rounded-[2.5rem] max-w-sm w-full relative shadow-2xl animate-in zoom-in-95 duration-200">
            <button
              onClick={() => setIsForgotOpen(false)}
              className="absolute top-6 right-6 text-gray-400 hover:text-black"
            >
              ✕
            </button>
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-1">
                Reset Password
              </h2>
              <p className="text-xs text-gray-400 font-medium tracking-tight">
                Identity verify required
              </p>
            </div>
            <div className="space-y-4">
              <AuthField htmlFor="ident" label="Username or Email">
                <input
                  type="text"
                  placeholder="Who are you?"
                  className="input-field-register text-sm bg-gray-50/50"
                  value={forgotData.identifier}
                  onChange={(e) =>
                    setForgotData({ ...forgotData, identifier: e.target.value })
                  }
                />
              </AuthField>
              <AuthField htmlFor="new-pass" label="New Password">
                <input
                  type="password"
                  placeholder="••••••••"
                  className="input-field-register text-sm bg-gray-50/50"
                  value={forgotData.newPassword}
                  onChange={(e) =>
                    setForgotData({
                      ...forgotData,
                      newPassword: e.target.value,
                    })
                  }
                />
              </AuthField>
              <AuthField htmlFor="conf-pass" label="Confirm Password">
                <input
                  type="password"
                  placeholder="••••••••"
                  className="input-field-register text-sm bg-gray-50/50"
                  value={forgotData.confirmPassword}
                  onChange={(e) =>
                    setForgotData({
                      ...forgotData,
                      confirmPassword: e.target.value,
                    })
                  }
                />
              </AuthField>
            </div>
            <div className="mt-8 flex items-center gap-3">
              <button
                onClick={handleResetPassword}
                disabled={loading}
                className="bg-brand-maroon hover:bg-black text-white rounded-2xl px-6 py-3 text-sm font-bold transition-all disabled:opacity-50"
              >
                {loading ? "Processing..." : "Reset"}
              </button>
              {forgotStatus.msg && (
                <span
                  className={`text-[11px] font-bold ${forgotStatus.type === "success" ? "text-green-500" : "text-red-500"}`}
                >
                  {forgotStatus.msg}
                </span>
              )}
              <button
                onClick={() => setIsForgotOpen(false)}
                className="flex-1 bg-gray-100 text-gray-500 rounded-2xl py-3 text-sm font-bold"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .input-field-register { @apply w-full px-4 py-3 rounded-2xl border border-gray-100 bg-gray-50/50 outline-none transition-all; }
        .input-field-register:focus { @apply border-brand-maroon bg-white ring-2 ring-brand-maroon/5; }
      `}</style>
    </>
  );
}
