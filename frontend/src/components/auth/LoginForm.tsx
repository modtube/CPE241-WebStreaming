import type { FormEvent, ReactNode } from "react";
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

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    navigate("/admin/dashboard");
  };

  return (
    <form
      onSubmit={handleSubmit}
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
          />
        </AuthField>

        <AuthField htmlFor="password" label="Password">
          <input
            id="password"
            type="password"
            placeholder="••••••••"
            className="input-field"
          />
        </AuthField>

        <div className="flex justify-between items-center gap-2 text-sm text-slate-600">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
            />
            Remember me
          </label>
          <a href="#" className="text-blue-600 hover:text-blue-800 font-medium">
            Forgot password?
          </a>
        </div>

        <button
          type="submit"
          className="bg-brand-maroon btn-primary w-full py-3 text-lg font-semibold"
          id="admin"
        >
          Sign In
        </button>

        {/* Dumb-Button to /customer/*/}
        <button
          type="button"
          onClick={() => navigate("/customer/home")}
          className="bg-gray-500 btn-primary w-full py-3 text-lg font-semibold text-white hover:bg-gray-600"
        >
          Go to Customer Home
        </button>

        <div className="text-center text-sm text-gray-600 mt-2">
          Don't have an account?{" "}
          <a
            href="#"
            className="text-brand-maroon hover:text-brand-maroon font-semibold"
          >
            Sign up
          </a>
        </div>
      </div>
    </form>
  );
}
