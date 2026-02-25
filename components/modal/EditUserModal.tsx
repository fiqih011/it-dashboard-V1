"use client";

import { useState, useEffect } from "react";
import { X, User, Shield, ToggleLeft, ToggleRight, AlertCircle, Save } from "lucide-react";
import { useToast } from "@/lib/swal";

type UserRow = {
  id: string;
  username: string;
  fullName: string;
  role: "Admin" | "User";
  status: "Active" | "Inactive";
  lastLogin: string | null;
};

type Props = {
  open: boolean;
  user: UserRow | null;
  totalAdmins: number;
  onClose: () => void;
  onSuccess: () => void;
};

export default function EditUserModal({ open, user, totalAdmins, onClose, onSuccess }: Props) {
  const [fullName, setFullName] = useState("");
  const [role, setRole]         = useState<"Admin" | "User">("User");
  const [status, setStatus]     = useState<"Active" | "Inactive">("Active");
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState<string | null>(null);
  const { showToast } = useToast();

  useEffect(() => {
    if (user) {
      setFullName(user.fullName);
      setRole(user.role);
      setStatus(user.status);
      setError(null);
    }
  }, [user]);

  const isAdmin         = user?.role === "Admin";
  const isLastAdmin     = isAdmin && totalAdmins <= 1;
  const canDeactivate   = !isAdmin;
  const canChangeRole   = !(isAdmin && isLastAdmin);

  const hasChanges =
    user &&
    (fullName.trim() !== user.fullName || role !== user.role || status !== user.status);

  const handleSubmit = async () => {
    if (!user || !hasChanges) return;
    if (!fullName.trim()) { setError("Full name is required"); return; }

    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/user-management/${user.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName: fullName.trim(), role, status }),
      });

      // Guard: 500 responses sometimes return empty body — parse safely
      const text = await res.text();
      const data = text ? JSON.parse(text) : {};
      if (!res.ok) throw new Error(data.message || `Server error (${res.status})`);
      showToast("success", `User ${user.username} berhasil diperbarui`);
      onSuccess();
      handleClose();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to update user";
      setError(msg);
      showToast("error", msg);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setError(null);
    onClose();
  };

  if (!open || !user) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md border border-gray-200 overflow-hidden">

        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-700 to-indigo-600 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-white">Edit User</h2>
            <p className="text-xs text-indigo-200 mt-0.5">Update user account information</p>
          </div>
          <button onClick={handleClose} className="text-indigo-200 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">

          {/* User identity — read only */}
          <div className="flex items-center gap-3 p-3 bg-indigo-50 border border-indigo-100 rounded-xl">
            <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center flex-shrink-0">
              {isAdmin
                ? <Shield className="w-5 h-5 text-indigo-600" />
                : <User className="w-5 h-5 text-indigo-600" />}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-gray-800">{user.username}</p>
              <p className="text-xs text-gray-400 mt-0.5 truncate">{user.fullName}</p>
            </div>
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border flex-shrink-0 ${
              isAdmin
                ? "bg-indigo-50 text-indigo-700 border-indigo-200"
                : "bg-gray-100 text-gray-600 border-gray-200"
            }`}>
              {user.role}
            </span>
          </div>

          {/* Last admin warning */}
          {isLastAdmin && (
            <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-100 rounded-xl">
              <AlertCircle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-amber-700">
                This is the only administrator account. Role and status cannot be changed.
              </p>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />{error}
            </div>
          )}

          {/* Full Name */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Full Name</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => { setFullName(e.target.value); setError(null); }}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-800 placeholder-gray-300 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all"
              placeholder="Enter full name"
            />
          </div>

          {/* Role */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-2">Role</label>
            <div className="grid grid-cols-2 gap-2">
              {(["User", "Admin"] as const).map((r) => (
                <button
                  key={r}
                  type="button"
                  disabled={!canChangeRole}
                  onClick={() => setRole(r)}
                  className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl border text-sm font-semibold transition-all ${
                    role === r
                      ? "bg-indigo-50 border-indigo-400 text-indigo-700"
                      : "bg-white border-gray-200 text-gray-500 hover:border-gray-300"
                  } disabled:opacity-40 disabled:cursor-not-allowed`}
                >
                  {r === "Admin"
                    ? <Shield className={`w-4 h-4 ${role === r ? "text-indigo-600" : "text-gray-400"}`} />
                    : <User className={`w-4 h-4 ${role === r ? "text-indigo-600" : "text-gray-400"}`} />}
                  {r}
                </button>
              ))}
            </div>
          </div>

          {/* Status */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-2">Status</label>
            <button
              type="button"
              disabled={!canDeactivate}
              onClick={() => setStatus(status === "Active" ? "Inactive" : "Active")}
              className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl border transition-all ${
                status === "Active"
                  ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                  : "bg-gray-50 border-gray-200 text-gray-500"
              } disabled:opacity-40 disabled:cursor-not-allowed`}
            >
              <div className="flex items-center gap-2.5">
                <div className={`w-2 h-2 rounded-full ${status === "Active" ? "bg-emerald-500" : "bg-gray-400"}`} />
                <span className="text-sm font-semibold">{status}</span>
              </div>
              {status === "Active"
                ? <ToggleRight className="w-5 h-5 text-emerald-500" />
                : <ToggleLeft className="w-5 h-5 text-gray-400" />}
            </button>
            {isAdmin && (
              <p className="text-xs text-gray-400 mt-1.5 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                Administrator accounts cannot be deactivated
              </p>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex justify-between items-center">
          <p className="text-xs text-gray-400">
            {hasChanges ? "You have unsaved changes" : "No changes made"}
          </p>
          <div className="flex gap-3">
            <button onClick={handleClose}
              className="px-4 py-2 text-sm font-semibold text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-100 transition">
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={!hasChanges || loading}
              className="px-4 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2 transition"
            >
              {loading
                ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Saving...</>
                : <><Save className="w-4 h-4" />Save Changes</>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}