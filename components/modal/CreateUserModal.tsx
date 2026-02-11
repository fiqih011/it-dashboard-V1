"use client";

import { useState } from "react";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import { 
  User, 
  UserCircle, 
  Shield, 
  CheckCircle2, 
  Copy, 
  Eye, 
  EyeOff,
  AlertCircle,
  Info
} from "lucide-react";

type Props = {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
};

export default function CreateUserModal({ open, onClose, onSuccess }: Props) {
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [role, setRole] = useState<"User" | "Admin">("User");
  const [status, setStatus] = useState<"Active" | "Inactive">("Active");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [generatedPassword, setGeneratedPassword] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCreate = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/user-management/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: username.trim(),
          fullName: fullName.trim(),
          role,
          status,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to create user");
      }

      const data = await response.json();
      setGeneratedPassword(data.temporaryPassword);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create user");
    } finally {
      setLoading(false);
    }
  };

  const handleCopyPassword = async () => {
    if (generatedPassword) {
      await navigator.clipboard.writeText(generatedPassword);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleClose = () => {
    if (generatedPassword) {
      onSuccess(); // Trigger refresh
    }
    
    // Reset state
    setFullName("");
    setUsername("");
    setRole("User");
    setStatus("Active");
    setGeneratedPassword(null);
    setShowPassword(false);
    setCopied(false);
    setError(null);
    onClose();
  };

  return (
    <Modal
      open={open}
      title={!generatedPassword ? "Create User" : "User Created Successfully"}
      onClose={handleClose}
      footer={
        !generatedPassword ? (
          <>
            <Button variant="secondary" onClick={handleClose}>
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleCreate}
              disabled={!fullName.trim() || !username.trim() || loading}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Creating...
                </span>
              ) : (
                "Create User"
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

          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Name
            </label>
            <div className="relative">
              <UserCircle className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={fullName}
                onChange={(e) => {
                  setFullName(e.target.value);
                  setError(null);
                }}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                placeholder="e.g. Andi Pratama"
              />
            </div>
          </div>

          {/* Username */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Username
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  setError(null);
                }}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                placeholder="e.g. andi.pratama"
              />
            </div>
            <p className="mt-1.5 text-xs text-gray-500">
              Username will be used for login authentication
            </p>
          </div>

          {/* Role */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              User Role
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setRole("User")}
                className={`relative flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 text-sm font-medium transition-all ${
                  role === "User"
                    ? "border-slate-500 bg-slate-50 text-slate-700"
                    : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
                }`}
              >
                <User className={`w-4 h-4 ${role === "User" ? "text-slate-600" : "text-gray-400"}`} />
                User
                {role === "User" && (
                  <CheckCircle2 className="absolute right-3 w-4 h-4 text-slate-600" />
                )}
              </button>
              
              <button
                type="button"
                onClick={() => setRole("Admin")}
                className={`relative flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 text-sm font-medium transition-all ${
                  role === "Admin"
                    ? "border-violet-500 bg-violet-50 text-violet-700"
                    : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
                }`}
              >
                <Shield className={`w-4 h-4 ${role === "Admin" ? "text-violet-600" : "text-gray-400"}`} />
                Admin
                {role === "Admin" && (
                  <CheckCircle2 className="absolute right-3 w-4 h-4 text-violet-600" />
                )}
              </button>
            </div>
            
            <div className="mt-2 text-xs text-gray-500">
              {role === "Admin" 
                ? "Administrator users have full system access and management privileges"
                : "Standard users have limited access based on permissions"}
            </div>
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Account Status
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setStatus("Active")}
                className={`relative flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 text-sm font-medium transition-all ${
                  status === "Active"
                    ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                    : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${status === "Active" ? "bg-emerald-500" : "bg-gray-300"}`} />
                Active
                {status === "Active" && (
                  <CheckCircle2 className="absolute right-3 w-4 h-4 text-emerald-600" />
                )}
              </button>
              
              <button
                type="button"
                onClick={() => setStatus("Inactive")}
                className={`relative flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 text-sm font-medium transition-all ${
                  status === "Inactive"
                    ? "border-slate-400 bg-slate-50 text-slate-700"
                    : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${status === "Inactive" ? "bg-slate-400" : "bg-gray-300"}`} />
                Inactive
                {status === "Inactive" && (
                  <CheckCircle2 className="absolute right-3 w-4 h-4 text-slate-600" />
                )}
              </button>
            </div>

            <div className="mt-2 text-xs text-gray-500">
              {status === "Active"
                ? "User can log in and access the system immediately"
                : "User account will be created but login access will be disabled"}
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-5">
          {/* Success Message */}
          <div className="flex items-start gap-3 p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium text-emerald-900">
                User account created successfully
              </p>
              <p className="mt-1 text-xs text-emerald-700">
                The user <span className="font-medium">{username}</span> has been added to the system
              </p>
            </div>
          </div>

          {/* User Details Summary */}
          <div className="bg-slate-50 border border-gray-200 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-900 mb-3">Account Details</h4>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Full Name:</span>
                <span className="font-medium text-gray-900">{fullName}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Username:</span>
                <span className="font-medium text-gray-900">{username}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Role:</span>
                <span
                  className={`inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 text-xs font-medium ${
                    role === "Admin"
                      ? "bg-violet-50 text-violet-700 border-violet-200"
                      : "bg-slate-100 text-slate-700 border-slate-300"
                  }`}
                >
                  {role === "Admin" && <Shield className="w-3 h-3" />}
                  {role}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Status:</span>
                <span
                  className={`inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 text-xs font-medium ${
                    status === "Active"
                      ? "bg-green-50 text-green-700 border-green-300"
                      : "bg-slate-100 text-slate-500 border-slate-300"
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      status === "Active" ? "bg-green-500" : "bg-slate-400"
                    }`}
                  />
                  {status}
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
                onClick={handleCopyPassword}
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

          {/* Security Warning */}
          <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium text-amber-900">
                Important Security Notice
              </p>
              <ul className="mt-2 space-y-1 text-xs text-amber-700">
                <li>• This password will only be shown once and cannot be retrieved later</li>
                <li>• Please copy and share it securely with the user</li>
                <li>• User must change this password on first login</li>
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
              </ul>
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
}