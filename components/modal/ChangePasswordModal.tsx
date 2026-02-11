"use client";

import { useState } from "react";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import { useToast } from "@/lib/swal";
import Swal from "sweetalert2";
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

type Props = {
  open: boolean;
  userId: string;
  username: string;
  fullName?: string;
  onClose: () => void;
};

type PasswordRequirement = {
  label: string;
  test: (password: string) => boolean;
};

const passwordRequirements: PasswordRequirement[] = [
  { label: "At least 8 characters", test: (p) => p.length >= 8 },
  { label: "Contains uppercase letter", test: (p) => /[A-Z]/.test(p) },
  { label: "Contains lowercase letter", test: (p) => /[a-z]/.test(p) },
  { label: "Contains number", test: (p) => /[0-9]/.test(p) },
  { label: "Contains special character", test: (p) => /[!@#$%^&*(),.?":{}|<>]/.test(p) },
];

export default function ChangePasswordModal({
  open,
  userId,
  username,
  fullName,
  onClose,
}: Props) {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { showToast } = useToast();

  // Validation
  const passwordsMatch = newPassword === confirmPassword && confirmPassword !== "";
  const allRequirementsMet = passwordRequirements.every((req) => req.test(newPassword));
  const canSubmit = newPassword.trim() !== "" && passwordsMatch && allRequirementsMet;

  const handleSubmit = async () => {
    if (!canSubmit) {
      setError("Please ensure all password requirements are met");
      return;
    }

    // Konfirmasi
    const result = await Swal.fire({
      title: `Change password untuk ${username}?`,
      html: `Password baru akan diterapkan untuk administrator <strong>${username}</strong>.<br/>Admin harus menggunakan password baru ini untuk login.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#7c3aed",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Ya, ubah password",
      cancelButtonText: "Batal",
    });

    if (!result.isConfirmed) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/user-management/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          newPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to change password");
      }

      showToast("success", `Password untuk ${username} berhasil diubah`);
      handleClose();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to change password";
      setError(errorMessage);
      showToast("error", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setNewPassword("");
    setConfirmPassword("");
    setShowNewPassword(false);
    setShowConfirmPassword(false);
    setError(null);
    onClose();
  };

  return (
    <Modal
      open={open}
      title="Change Administrator Password"
      onClose={handleClose}
      footer={
        <>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit} disabled={!canSubmit || loading}>
            {loading ? (
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Changing...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Lock className="w-4 h-4" />
                Change Password
              </span>
            )}
          </Button>
        </>
      }
    >
      <div className="space-y-5">
        {/* Target User Info */}
        <div className="flex items-start gap-3 p-4 bg-violet-50 border border-violet-200 rounded-lg">
          <Shield className="w-5 h-5 text-violet-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-medium text-violet-900">
              Change Password for Administrator
            </p>
            <div className="mt-2 text-xs text-violet-700">
              <p className="font-medium">{username}</p>
              {fullName && <p className="text-violet-600">{fullName}</p>}
            </div>
          </div>
        </div>

        {/* Info Notice */}
        <div className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-medium text-blue-900">Manual Password Change</p>
            <p className="mt-1 text-xs text-blue-700">
              Enter a new password for this administrator. The admin will use this password for their next login.
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

        {/* New Password */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type={showNewPassword ? "text" : "password"}
              value={newPassword}
              onChange={(e) => {
                setNewPassword(e.target.value);
                setError(null);
              }}
              className="w-full pl-10 pr-12 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              placeholder="Enter new password"
            />
            <button
              type="button"
              onClick={() => setShowNewPassword(!showNewPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 transition-colors"
            >
              {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Password Requirements */}
        {newPassword && (
          <div className="bg-slate-50 border border-gray-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <ShieldCheck className="w-4 h-4 text-gray-600" />
              <h4 className="text-sm font-medium text-gray-900">Password Requirements</h4>
            </div>
            <div className="space-y-2">
              {passwordRequirements.map((req, index) => {
                const passed = req.test(newPassword);
                return (
                  <div key={index} className="flex items-center gap-2 text-xs">
                    {passed ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    ) : (
                      <XCircle className="w-4 h-4 text-gray-300 flex-shrink-0" />
                    )}
                    <span className={passed ? "text-emerald-700 font-medium" : "text-gray-500"}>
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
                  : "border-gray-200 focus:ring-blue-500 focus:border-transparent"
              }`}
              placeholder="Re-enter new password"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 transition-colors"
            >
              {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
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
            <p className="text-sm font-medium text-amber-900">Security Reminder</p>
            <ul className="mt-2 space-y-1 text-xs text-amber-700">
              <li>• Make sure to securely communicate this password to the administrator</li>
              <li>• Recommend they change it after first login</li>
              <li>• Administrator passwords do not expire</li>
            </ul>
          </div>
        </div>
      </div>
    </Modal>
  );
}