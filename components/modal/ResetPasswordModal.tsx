"use client";

import { useState } from "react";
import { X, KeyRound, AlertTriangle, Copy, Eye, EyeOff, CheckCircle2, AlertCircle, User, ShieldAlert, Info } from "lucide-react";

type Props = {
  open: boolean;
  userId: string;
  username: string;
  fullName?: string;
  onClose: () => void;
};

export default function ResetPasswordModal({ open, userId, username, fullName, onClose }: Props) {
  const [generatedPassword, setGeneratedPassword] = useState<string | null>(null);
  const [showPassword, setShowPassword]           = useState(false);
  const [copied, setCopied]                       = useState(false);
  const [loading, setLoading]                     = useState(false);
  const [error, setError]                         = useState<string | null>(null);

  const handleReset = async () => {
    setLoading(true); setError(null);
    try {
      const res = await fetch("/api/user-management/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to reset password");
      }
      const data = await res.json();
      setGeneratedPassword(data.temporaryPassword);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!generatedPassword) return;
    await navigator.clipboard.writeText(generatedPassword);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClose = () => {
    setGeneratedPassword(null); setShowPassword(false);
    setCopied(false); setError(null); onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md border border-gray-200 overflow-hidden">

        {/* Header */}
        <div className={`bg-gradient-to-r px-6 py-4 flex items-center justify-between ${
          generatedPassword ? "from-emerald-600 to-emerald-500" : "from-indigo-700 to-indigo-600"
        }`}>
          <div>
            <h2 className="text-base font-bold text-white">
              {generatedPassword ? "Password Reset Successful" : "Reset User Password"}
            </h2>
            <p className="text-xs text-white/70 mt-0.5">
              {generatedPassword ? "Share the temporary password securely" : "Generate a new temporary password"}
            </p>
          </div>
          <button onClick={handleClose} className="text-white/70 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">

          {!generatedPassword ? (
            <>
              {/* Target user */}
              <div className="flex items-center gap-3 p-3 bg-indigo-50 border border-indigo-100 rounded-xl">
                <div className="w-9 h-9 bg-indigo-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <User className="w-4 h-4 text-indigo-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-800">{username}</p>
                  {fullName && <p className="text-xs text-gray-400">{fullName}</p>}
                </div>
              </div>

              {/* Error */}
              {error && (
                <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />{error}
                </div>
              )}

              {/* Warning */}
              <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-100 rounded-xl">
                <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-semibold text-red-800">Critical Action Warning</p>
                  <p className="text-xs text-red-700 mt-0.5">This will immediately invalidate the user's current password. They must use the new temporary password to login.</p>
                </div>
              </div>

              {/* What happens */}
              <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-100 rounded-xl">
                <Info className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-semibold text-amber-800">What happens next?</p>
                  <ul className="text-xs text-amber-700 mt-1 space-y-0.5">
                    <li>• Current password becomes invalid immediately</li>
                    <li>• A new random password will be generated</li>
                    <li>• User must change password on first login</li>
                  </ul>
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Success */}
              <div className="flex items-center gap-2 p-3 bg-emerald-50 border border-emerald-100 rounded-xl text-xs text-emerald-700">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                <span>New temporary password generated for <strong>{username}</strong></span>
              </div>

              {/* Details */}
              <div className="bg-gray-50 border border-gray-100 rounded-xl p-3 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400 text-xs">Username</span>
                  <span className="font-semibold text-gray-800 text-xs">{username}</span>
                </div>
                {fullName && (
                  <div className="flex justify-between">
                    <span className="text-gray-400 text-xs">Full Name</span>
                    <span className="font-semibold text-gray-800 text-xs">{fullName}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-400 text-xs">Reset Time</span>
                  <span className="font-semibold text-gray-800 text-xs">
                    {new Date().toLocaleString("id-ID", { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-xs">Status</span>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-50 text-amber-700 border border-amber-200 rounded-full text-xs font-semibold">
                    <AlertCircle className="w-3 h-3" />Must Change on Login
                  </span>
                </div>
              </div>

              {/* Password display */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-gray-600">Temporary Password</label>
                  <button onClick={() => setShowPassword(!showPassword)}
                    className="text-xs text-gray-400 hover:text-gray-600 flex items-center gap-1">
                    {showPassword ? <><EyeOff className="w-3 h-3" />Hide</> : <><Eye className="w-3 h-3" />Show</>}
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={generatedPassword}
                    readOnly
                    className="w-full pr-10 pl-4 py-2.5 bg-amber-50 border-2 border-amber-300 rounded-xl font-mono text-sm text-gray-800 outline-none"
                  />
                  <button onClick={handleCopy}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-gray-400 hover:text-amber-600 hover:bg-amber-100 rounded-lg transition-colors">
                    {copied ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
                {copied && <p className="mt-1 text-xs text-emerald-600 flex items-center gap-1"><CheckCircle2 className="w-3 h-3" />Copied to clipboard</p>}
              </div>

              {/* Security notice */}
              <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-100 rounded-xl">
                <AlertCircle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-semibold text-amber-800">Important — One-time display</p>
                  <p className="text-xs text-amber-700 mt-0.5">This password is shown once and cannot be retrieved. Share securely (in-person or phone) and ask user to change immediately.</p>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
          {!generatedPassword ? (
            <>
              <button onClick={handleClose}
                className="px-4 py-2 text-sm font-semibold text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-100 transition">
                Cancel
              </button>
              <button onClick={handleReset} disabled={loading}
                className="px-4 py-2 text-sm font-semibold text-white bg-red-600 rounded-xl hover:bg-red-700 disabled:opacity-40 flex items-center gap-2 transition">
                {loading
                  ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Resetting...</>
                  : <><ShieldAlert className="w-4 h-4" />Reset Password</>}
              </button>
            </>
          ) : (
            <button onClick={handleClose}
              className="px-4 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 transition">
              Done
            </button>
          )}
        </div>
      </div>
    </div>
  );
}