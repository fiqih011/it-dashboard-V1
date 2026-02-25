"use client";

import { useState, FormEvent } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Eye,
  EyeOff,
  Lock,
  User,
  AlertCircle,
  Loader2,
  ArrowLeft,
  BarChart3,
  Shield,
} from "lucide-react";

export default function LoginPage() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const result = await signIn("credentials", {
        username,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid username or password. Please try again.");
        setLoading(false);
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("An error occurred. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* ─── LEFT PANEL — Brand ─── */}
      <div className="hidden lg:flex lg:w-[52%] bg-gradient-to-br from-indigo-900 via-indigo-800 to-indigo-700 relative overflow-hidden flex-col justify-between p-12">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-32 -right-32 w-[480px] h-[480px] rounded-full bg-white/5" />
          <div className="absolute -bottom-24 -left-24 w-[320px] h-[320px] rounded-full bg-white/5" />
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "radial-gradient(circle, rgba(255,255,255,0.07) 1px, transparent 1px)",
              backgroundSize: "32px 32px",
            }}
          />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-indigo-500/10 blur-3xl" />
        </div>

        {/* Top — Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-9 h-9 bg-white/15 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/20">
            <BarChart3 className="w-5 h-5 text-white" />
          </div>
          <span className="text-white font-bold text-base tracking-tight">
            IT Budget Monitoring
          </span>
        </div>

        {/* Center — Main copy */}
        <div className="relative z-10 space-y-7">
          <div className="space-y-4">

            <h1 className="text-5xl font-extrabold text-white leading-tight tracking-tight">
              IT Budget
              <br />
              <span className="text-indigo-300">Monitoring</span>
            </h1>
            <p className="text-indigo-200/65 text-sm leading-relaxed max-w-xs">
              Centralized platform for OPEX and CAPEX budget planning, tracking,
              and analysis across your organization.
            </p>
          </div>

          {/* Feature checklist */}
          <div className="space-y-3">
            {[
              "OPEX & CAPEX budget planning",
              "Real-time utilization dashboard",
              "Transaction tracking & approval",
              "Role-based access control",
            ].map((item) => (
              <div key={item} className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center flex-shrink-0">
                  <svg className="w-3 h-3 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-sm text-white/80">{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom — Footer note */}
        <div className="relative z-10">
          <div className="flex items-center gap-2 text-indigo-300/60 text-xs">
            <Shield className="w-3.5 h-3.5" />
            <span>Secured access — authorized personnel only</span>
          </div>
        </div>
      </div>

      {/* ─── RIGHT PANEL — Form ─── */}
      <div className="flex-1 flex flex-col bg-gray-50">
        {/* Top bar */}
        <div className="flex items-center justify-between px-8 py-5 border-b border-gray-200 bg-white">
          {/* Mobile logo */}
          <div className="flex items-center gap-2.5 lg:hidden">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-gray-800 text-sm">
              IT Budget Monitoring
            </span>
          </div>
          <div className="hidden lg:block" />

          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Dashboard
          </Link>
        </div>

        {/* Center — Form */}
        <div className="flex-1 flex items-center justify-center px-6 py-12">
          <div className="w-full max-w-sm">
            {/* Heading */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900">Welcome back</h2>
              <p className="text-sm text-gray-500 mt-1">
                Sign in to continue to IT Budget Monitoring
              </p>
            </div>

            {/* Error alert */}
            {error && (
              <div className="flex items-start gap-3 p-3.5 bg-red-50 border border-red-200 rounded-xl mb-6">
                <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-red-800">
                    Login Failed
                  </p>
                  <p className="text-xs text-red-600 mt-0.5">{error}</p>
                </div>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Username */}
              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide mb-1.5">
                  Username
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => {
                      setUsername(e.target.value);
                      setError(null);
                    }}
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 transition-all"
                    placeholder="Enter your username"
                    required
                    autoComplete="username"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setError(null);
                    }}
                    className="w-full pl-10 pr-11 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 transition-all"
                    placeholder="Enter your password"
                    required
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading || !username || !password}
                className="w-full mt-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white py-2.5 px-4 rounded-xl font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all flex items-center justify-center gap-2 shadow-sm shadow-indigo-600/20"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    Sign In
                  </>
                )}
              </button>
            </form>

            {/* Help note */}
            <div className="mt-6 flex items-start gap-2.5 p-3.5 bg-indigo-50 border border-indigo-100 rounded-xl">
              <AlertCircle className="w-4 h-4 text-indigo-400 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-indigo-600 leading-relaxed">
                Contact your system administrator if you need help accessing
                your account.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom footer */}
        <div className="px-8 py-4 border-t border-gray-200 bg-white">
          <p className="text-center text-xs text-gray-400">
            © {new Date().getFullYear()} IT Budget Monitoring — All rights
            reserved
          </p>
        </div>
      </div>
    </div>
  );
}