"use client";

import { useState } from "react";
import { X, Lock, Eye, EyeOff, CheckCircle2, XCircle, AlertCircle, ShieldCheck, Info } from "lucide-react";

type Props = { open: boolean; onClose: () => void };

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

export default function ChangeMyPasswordModal({ open, onClose }: Props) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword]         = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent]         = useState(false);
  const [showNew, setShowNew]                 = useState(false);
  const [showConfirm, setShowConfirm]         = useState(false);
  const [loading, setLoading]                 = useState(false);
  const [error, setError]                     = useState<string | null>(null);
  const [success, setSuccess]                 = useState(false);

  const passwordsMatch = newPassword === confirmPassword && confirmPassword !== "";
  const allMet         = passwordRequirements.every((r) => r.test(newPassword));
  const canSubmit      = currentPassword.trim() !== "" && newPassword.trim() !== "" && passwordsMatch && allMet;

  const handleSubmit = async () => {
    if (!canSubmit) { setError("Please ensure all password requirements are met"); return; }
    setLoading(true); setError(null);
    try {
      const res = await fetch("/api/user-management/change-my-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to change password");
      }
      setSuccess(true);
      setTimeout(() => handleClose(), 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to change password");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setCurrentPassword(""); setNewPassword(""); setConfirmPassword("");
    setShowCurrent(false); setShowNew(false); setShowConfirm(false);
    setError(null); setSuccess(false); onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md border border-gray-200 overflow-hidden">

        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-700 to-indigo-600 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-white">Change My Password</h2>
            <p className="text-xs text-indigo-200 mt-0.5">Update your account password</p>
          </div>
          <button onClick={handleClose} className="text-indigo-200 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">

          {success ? (
            <div className="py-8 flex flex-col items-center gap-4 text-center">
              <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8 text-emerald-500" />
              </div>
              <div>
                <p className="text-base font-bold text-gray-800">Password Changed Successfully</p>
                <p className="text-sm text-gray-400 mt-1">You can now use your new password</p>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <div className="w-4 h-4 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" />
                Closing...
              </div>
            </div>
          ) : (
            <>
              {/* Info */}
              <div className="flex items-start gap-2 p-3 bg-blue-50 border border-blue-100 rounded-xl">
                <Info className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-blue-700">Enter your current password and choose a new secure password.</p>
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
                <p className="text-xs text-red-500 flex items-center gap-1 -mt-2"><XCircle className="w-3 h-3" />Passwords do not match</p>
              )}
              {confirmPassword && passwordsMatch && (
                <p className="text-xs text-emerald-600 flex items-center gap-1 -mt-2"><CheckCircle2 className="w-3 h-3" />Passwords match</p>
              )}

              <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-100 rounded-xl">
                <AlertCircle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-amber-700">Use a unique password you don't use elsewhere. Consider using a password manager.</p>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        {!success && (
          <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
            <button onClick={handleClose}
              className="px-4 py-2 text-sm font-semibold text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-100 transition">
              Cancel
            </button>
            <button onClick={handleSubmit} disabled={!canSubmit || loading}
              className="px-4 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2 transition">
              {loading
                ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Changing...</>
                : <><Lock className="w-4 h-4" />Change Password</>}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}