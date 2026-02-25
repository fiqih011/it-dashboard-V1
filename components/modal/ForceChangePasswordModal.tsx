"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Lock, Eye, EyeOff, CheckCircle2, XCircle, AlertCircle, ShieldCheck, Info, Shield } from "lucide-react";

const passwordRequirements = [
  { label: "At least 8 characters",      test: (p: string) => p.length >= 8 },
  { label: "Contains uppercase letter",  test: (p: string) => /[A-Z]/.test(p) },
  { label: "Contains lowercase letter",  test: (p: string) => /[a-z]/.test(p) },
  { label: "Contains number",            test: (p: string) => /[0-9]/.test(p) },
  { label: "Contains special character", test: (p: string) => /[!@#$%^&*(),.?":{}|<>]/.test(p) },
];

function PasswordInput({ label, value, show, onToggle, onChange, error }: {
  label: string; value: string; show: boolean;
  onToggle: () => void; onChange: (v: string) => void; error?: boolean;
}) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-600 mb-1.5">{label}</label>
      <div className="relative">
        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type={show ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full pl-10 pr-10 py-2.5 border rounded-xl text-sm text-gray-800 placeholder-gray-300 outline-none focus:ring-2 transition-all ${
            error ? "border-red-300 focus:ring-red-100" : "border-gray-200 focus:border-indigo-400 focus:ring-indigo-100"
          }`}
          placeholder={`Enter ${label.toLowerCase()}`}
        />
        <button type="button" onClick={onToggle}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
          {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
}

export default function ForceChangePasswordModal() {
  const { data: session, update } = useSession();
  const router = useRouter();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword]         = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent]         = useState(false);
  const [showNew, setShowNew]                 = useState(false);
  const [showConfirm, setShowConfirm]         = useState(false);
  const [loading, setLoading]                 = useState(false);
  const [error, setError]                     = useState<string | null>(null);

  if (!session?.user) return null;
  const user = session.user as any;
  if (!user.forceChangePassword) return null;

  const passwordsMatch = newPassword === confirmPassword && confirmPassword !== "";
  const allMet         = passwordRequirements.every((r) => r.test(newPassword));
  const canSubmit      = currentPassword.trim() !== "" && newPassword.trim() !== "" && passwordsMatch && allMet;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) { setError("Please ensure all password requirements are met"); return; }
    setLoading(true); setError(null);
    try {
      const res = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword, confirmPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to change password");
      await update();
      router.refresh();
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to change password");
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">

        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-700 to-indigo-600 px-6 py-5 text-center">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-3">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-base font-bold text-white">Password Change Required</h2>
          <p className="text-xs text-indigo-200 mt-1">You must change your password before continuing</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">

          {/* Security notice */}
          <div className="flex items-start gap-2 p-3 bg-blue-50 border border-blue-100 rounded-xl">
            <Info className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-blue-700">For security reasons, you must change your temporary password. Your new password will be valid for 3 months.</p>
          </div>

          {/* Error */}
          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700">
              <XCircle className="w-4 h-4 flex-shrink-0" />{error}
            </div>
          )}

          <PasswordInput label="Current Password" value={currentPassword} show={showCurrent}
            onToggle={() => setShowCurrent(!showCurrent)} onChange={(v) => { setCurrentPassword(v); setError(null); }} />

          <PasswordInput label="New Password" value={newPassword} show={showNew}
            onToggle={() => setShowNew(!showNew)} onChange={(v) => { setNewPassword(v); setError(null); }} />

          {newPassword && (
            <div className="bg-gray-50 border border-gray-100 rounded-xl p-3">
              <div className="flex items-center gap-1.5 mb-2">
                <ShieldCheck className="w-3.5 h-3.5 text-gray-500" />
                <p className="text-xs font-semibold text-gray-600">Password Requirements</p>
              </div>
              <div className="space-y-1.5">
                {passwordRequirements.map((r, i) => {
                  const ok = r.test(newPassword);
                  return (
                    <div key={i} className="flex items-center gap-2 text-xs">
                      {ok
                        ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                        : <XCircle className="w-3.5 h-3.5 text-gray-300 flex-shrink-0" />}
                      <span className={ok ? "text-emerald-700 font-medium" : "text-gray-400"}>{r.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <PasswordInput label="Confirm New Password" value={confirmPassword} show={showConfirm}
            error={!!confirmPassword && !passwordsMatch}
            onToggle={() => setShowConfirm(!showConfirm)} onChange={(v) => { setConfirmPassword(v); setError(null); }} />
          {confirmPassword && !passwordsMatch && (
            <p className="text-xs text-red-500 flex items-center gap-1"><XCircle className="w-3 h-3" />Passwords do not match</p>
          )}
          {confirmPassword && passwordsMatch && (
            <p className="text-xs text-emerald-600 flex items-center gap-1"><CheckCircle2 className="w-3 h-3" />Passwords match</p>
          )}

          <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-100 rounded-xl">
            <AlertCircle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
            <ul className="text-xs text-amber-700 space-y-0.5">
              <li>• Use a strong, unique password</li>
              <li>• Don't share your password with anyone</li>
              <li>• Your password will expire in 3 months</li>
            </ul>
          </div>

          <button type="submit" disabled={!canSubmit || loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 px-4 rounded-xl font-semibold text-sm disabled:opacity-40 disabled:cursor-not-allowed transition flex items-center justify-center gap-2">
            {loading
              ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Changing Password...</>
              : <><Lock className="w-4 h-4" />Change Password</>}
          </button>
        </form>
      </div>
    </div>
  );
}