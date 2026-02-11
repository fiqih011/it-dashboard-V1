"use client";

import { useState } from "react";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import {
  KeyRound,
  AlertTriangle,
  Copy,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  User,
  ShieldAlert,
  Info,
} from "lucide-react";

type Props = {
  open: boolean;
  userId: string;
  username: string;
  fullName?: string;
  onClose: () => void;
};

export default function ResetPasswordModal({
  open,
  userId,
  username,
  fullName,
  onClose,
}: Props) {
  const [generatedPassword, setGeneratedPassword] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleReset = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch("/api/user-management/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to reset password");
      }

      const data = await response.json();
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
    setGeneratedPassword(null);
    setShowPassword(false);
    setCopied(false);
    setError(null);
    onClose();
  };

  return (
    <Modal
      open={open}
      title={!generatedPassword ? "Reset Password" : "Password Reset Successful"}
      onClose={handleClose}
      size="sm"
      footer={
        !generatedPassword ? (
          <>
            <Button variant="secondary" onClick={handleClose}>
              Cancel
            </Button>
            <Button 
              variant="danger" 
              onClick={handleReset}
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Resetting...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4" />
                  Reset Password
                </span>
              )}
            </Button>
          </>
        ) : (
          <Button variant="primary" onClick={handleClose}>
            Close
          </Button>
        )
      }
    >
      {!generatedPassword ? (
        <div className="space-y-5">
          {/* Error Message */}
          {error && (
            <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-red-900">Error</p>
                <p className="mt-1 text-xs text-red-700">{error}</p>
              </div>
            </div>
          )}

          {/* User Info */}
          <div className="bg-slate-50 border border-gray-200 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-900 mb-3">Target User</h4>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white border border-gray-200 rounded-lg">
                <User className="w-5 h-5 text-gray-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">{username}</p>
                {fullName && (
                  <p className="text-xs text-gray-500">{fullName}</p>
                )}
              </div>
            </div>
          </div>

          {/* Warning */}
          <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
            <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium text-red-900">
                Critical Action Warning
              </p>
              <p className="mt-1 text-xs text-red-700">
                Resetting this password will immediately invalidate the user's current password.
                The user will be required to use the new temporary password and change it on their next login.
              </p>
            </div>
          </div>

          {/* Impact Notice */}
          <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <Info className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium text-amber-900">What happens next?</p>
              <ul className="mt-2 space-y-1 text-xs text-amber-700">
                <li>• Current password becomes invalid immediately</li>
                <li>• A new random password will be generated automatically</li>
                <li>• User must use the new temporary password to login</li>
                <li>• User will be forced to change password on first login</li>
                <li>• You are responsible for securely sharing the password</li>
              </ul>
            </div>
          </div>

          {/* Confirmation Text */}
          <p className="text-sm text-gray-700">
            Please confirm that you want to proceed with resetting the password for this user account.
          </p>
        </div>
      ) : (
        <div className="space-y-5">
          {/* Success Banner */}
          <div className="flex items-start gap-3 p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium text-emerald-900">
                Password reset successful
              </p>
              <p className="mt-1 text-xs text-emerald-700">
                A new temporary password has been generated for <span className="font-medium">{username}</span>
              </p>
            </div>
          </div>

          {/* User Details */}
          <div className="bg-slate-50 border border-gray-200 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-900 mb-3">Reset Details</h4>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Username:</span>
                <span className="font-medium text-gray-900">{username}</span>
              </div>
              {fullName && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Full Name:</span>
                  <span className="font-medium text-gray-900">{fullName}</span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Reset Time:</span>
                <span className="font-medium text-gray-900">
                  {new Date().toLocaleString('id-ID', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Status:</span>
                <span className="inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 text-xs font-medium bg-amber-50 text-amber-700 border-amber-300">
                  <AlertCircle className="w-3 h-3" />
                  Must Change on Login
                </span>
              </div>
            </div>
          </div>

          {/* Password Display */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-gray-900">
                Temporary Password
              </label>
              <button
                onClick={() => setShowPassword(!showPassword)}
                className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-700 transition-colors"
              >
                {showPassword ? (
                  <>
                    <EyeOff className="w-3.5 h-3.5" />
                    Hide
                  </>
                ) : (
                  <>
                    <Eye className="w-3.5 h-3.5" />
                    Show
                  </>
                )}
              </button>
            </div>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={generatedPassword}
                readOnly
                className="w-full pr-12 pl-4 py-3 bg-white border-2 border-amber-300 rounded-lg font-mono text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
              <button
                onClick={handleCopy}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded transition-colors"
                title="Copy password"
              >
                {copied ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </div>

            {copied && (
              <p className="mt-1.5 text-xs text-emerald-600 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                Password copied to clipboard
              </p>
            )}
          </div>

          {/* Security Notice */}
          <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium text-amber-900">
                Important Security Notice
              </p>
              <ul className="mt-2 space-y-1 text-xs text-amber-700">
                <li>• This password will only be shown once and cannot be retrieved later</li>
                <li>• Copy and share it securely with the user (avoid email or messaging apps)</li>
                <li>• User must change this password immediately on first login</li>
                <li>• This action has been logged for security audit purposes</li>
              </ul>
            </div>
          </div>

          {/* Best Practices */}
          <div className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium text-blue-900">
                Recommended Actions
              </p>
              <ul className="mt-2 space-y-1 text-xs text-blue-700">
                <li>• Share password through secure channel (in-person, phone, encrypted message)</li>
                <li>• Verify user's identity before sharing the password</li>
                <li>• Inform user to change password immediately after first login</li>
                <li>• Monitor user's first login to ensure successful password change</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
}