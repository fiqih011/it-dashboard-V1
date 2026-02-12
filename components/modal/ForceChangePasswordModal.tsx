"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ShieldCheck,
  Info,
  Shield,
} from "lucide-react";

type PasswordRequirement = {
  label: string;
  test: (password: string) => boolean;
};

const passwordRequirements: PasswordRequirement[] = [
  { label: "At least 8 characters", test: (p) => p.length >= 8 },
  { label: "Contains uppercase letter", test: (p) => /[A-Z]/.test(p) },
  { label: "Contains lowercase letter", test: (p) => /[a-z]/.test(p) },
  { label: "Contains number", test: (p) => /[0-9]/.test(p) },
  {
    label: "Contains special character",
    test: (p) => /[!@#$%^&*(),.?":{}|<>]/.test(p),
  },
];

export default function ForceChangePasswordModal() {
  const { data: session, update } = useSession();
  const router = useRouter();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Don't render if not forced to change
  if (!session?.user) return null;
  const user = session.user as any;
  if (!user.forceChangePassword) return null;

  // Validation
  const passwordsMatch =
    newPassword === confirmPassword && confirmPassword !== "";
  const allRequirementsMet = passwordRequirements.every((req) =>
    req.test(newPassword)
  );
  const canSubmit =
    currentPassword.trim() !== "" &&
    newPassword.trim() !== "" &&
    passwordsMatch &&
    allRequirementsMet;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!canSubmit) {
      setError("Please ensure all password requirements are met");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword,
          newPassword,
          confirmPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to change password");
      }

      // Update session to clear force change flag
      await update();

      // Refresh and redirect
      router.refresh();
      router.push("/dashboard");
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to change password";
      setError(errorMessage);
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white w-full max-w-2xl rounded-xl shadow-2xl border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-violet-600 to-blue-600 p-6 text-center">
          <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mx-auto mb-3">
            <Shield className="w-7 h-7 text-white" />
          </div>
          <h2 className="text-xl font-bold text-white mb-1">
            Password Change Required
          </h2>
          <p className="text-violet-100 text-sm">
            You must change your password before continuing
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Info Notice */}
          <div className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium text-blue-900">
                Security Requirement
              </p>
              <p className="mt-1 text-xs text-blue-700">
                For security reasons, you need to change your temporary password.
                Your new password will be valid for 3 months.
              </p>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
              <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-red-900">Error</p>
                <p className="mt-1 text-xs text-red-700">{error}</p>
              </div>
            </div>
          )}

          {/* Current Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Current Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type={showCurrentPassword ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => {
                  setCurrentPassword(e.target.value);
                  setError(null);
                }}
                className="w-full pl-10 pr-12 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-colors"
                placeholder="Enter your temporary password"
                required
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showCurrentPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {/* New Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              New Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type={showNewPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => {
                  setNewPassword(e.target.value);
                  setError(null);
                }}
                className="w-full pl-10 pr-12 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-colors"
                placeholder="Enter new password"
                required
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showNewPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {/* Password Requirements */}
          {newPassword && (
            <div className="bg-slate-50 border border-gray-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <ShieldCheck className="w-4 h-4 text-gray-600" />
                <h4 className="text-sm font-medium text-gray-900">
                  Password Requirements
                </h4>
              </div>
              <div className="space-y-2">
                {passwordRequirements.map((req, index) => {
                  const passed = req.test(newPassword);
                  return (
                    <div
                      key={index}
                      className="flex items-center gap-2 text-xs"
                    >
                      {passed ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                      ) : (
                        <XCircle className="w-4 h-4 text-gray-300 flex-shrink-0" />
                      )}
                      <span
                        className={
                          passed
                            ? "text-emerald-700 font-medium"
                            : "text-gray-500"
                        }
                      >
                        {req.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Confirm New Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  setError(null);
                }}
                className={`w-full pl-10 pr-12 py-2.5 border rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 transition-colors ${
                  confirmPassword && !passwordsMatch
                    ? "border-red-300 focus:ring-red-500 focus:border-transparent"
                    : "border-gray-200 focus:ring-violet-500 focus:border-transparent"
                }`}
                placeholder="Re-enter new password"
                required
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showConfirmPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
            {confirmPassword && !passwordsMatch && (
              <p className="mt-1.5 text-xs text-red-600 flex items-center gap-1">
                <XCircle className="w-3 h-3" />
                Passwords do not match
              </p>
            )}
            {confirmPassword && passwordsMatch && (
              <p className="mt-1.5 text-xs text-emerald-600 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                Passwords match
              </p>
            )}
          </div>

          {/* Security Tips */}
          <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium text-amber-900">
                Security Tips
              </p>
              <ul className="mt-2 space-y-1 text-xs text-amber-700">
                <li>• Use a strong, unique password</li>
                <li>• Don't share your password with anyone</li>
                <li>• Your password will expire in 3 months</li>
              </ul>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!canSubmit || loading}
            className="w-full bg-gradient-to-r from-violet-600 to-blue-600 text-white py-3 px-4 rounded-lg font-medium text-sm hover:from-violet-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Changing Password...
              </>
            ) : (
              <>
                <Lock className="w-5 h-5" />
                Change Password
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}