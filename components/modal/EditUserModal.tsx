"use client";

import { useState, useEffect } from "react";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import { useToast } from "@/lib/swal";
import Swal from "sweetalert2";
import { 
  UserCircle, 
  User, 
  Shield,
  Pencil,
  AlertCircle,
  AlertTriangle,
  Info,
  Save,
  CheckCircle2
} from "lucide-react";

type User = {
  id: string;
  username: string;
  fullName: string;
  role: "Admin" | "User";
  status: "Active" | "Inactive";
};

type Props = {
  open: boolean;
  user: User | null;
  onClose: () => void;
  onSuccess: () => void;
  totalAdmins?: number;
};

export default function EditUserModal({ 
  open, 
  user, 
  onClose, 
  onSuccess,
  totalAdmins = 1 
}: Props) {
  const [fullName, setFullName] = useState("");
  const [role, setRole] = useState<"Admin" | "User">("User");
  const [status, setStatus] = useState<"Active" | "Inactive">("Active");
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasChanges, setHasChanges] = useState(false);

  const { showToast } = useToast();

  useEffect(() => {
    if (user) {
      setFullName(user.fullName);
      setRole(user.role);
      setStatus(user.status);
      setHasChanges(false);
      setError(null);
    }
  }, [user]);

  // Check if there are changes
  useEffect(() => {
    if (user) {
      const changed = 
        fullName !== user.fullName ||
        role !== user.role ||
        status !== user.status;
      setHasChanges(changed);
    }
  }, [fullName, role, status, user]);

  const handleSave = async () => {
    if (!user) return;

    // Validate: Cannot demote last admin
    if (user.role === "Admin" && role === "User" && totalAdmins === 1) {
      setError("Cannot change role of the last administrator. At least one admin account is required.");
      return;
    }

    // Validate: Cannot deactivate admin
    if (role === "Admin" && status === "Inactive") {
      setError("Administrator accounts cannot be deactivated for security reasons.");
      return;
    }

    // Confirmation for critical role changes
    if (user.role === "Admin" && role === "User") {
      const result = await Swal.fire({
        title: "Turunkan Hak Admin?",
        html: `Anda akan menghapus hak administrator dari <strong>${user.username}</strong>.<br/>User ini akan kehilangan semua akses admin.`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#dc2626",
        cancelButtonColor: "#6b7280",
        confirmButtonText: "Ya, turunkan",
        cancelButtonText: "Batal",
      });
      if (!result.isConfirmed) return;
    }

    if (user.role === "User" && role === "Admin") {
      const result = await Swal.fire({
        title: "Berikan Hak Admin?",
        html: `Anda akan memberikan hak administrator ke <strong>${user.username}</strong>.<br/>User ini akan memiliki akses penuh ke sistem.`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#7c3aed",
        cancelButtonColor: "#6b7280",
        confirmButtonText: "Ya, jadikan admin",
        cancelButtonText: "Batal",
      });
      if (!result.isConfirmed) return;
    }

    // Confirmation for deactivation
    if (user.status === "Active" && status === "Inactive") {
      const result = await Swal.fire({
        title: `Nonaktifkan user ${user.username}?`,
        text: "User tidak akan bisa login sampai diaktifkan kembali.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#dc2626",
        cancelButtonColor: "#6b7280",
        confirmButtonText: "Ya, nonaktifkan",
        cancelButtonText: "Batal",
      });
      if (!result.isConfirmed) return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/user-management/${user.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: fullName.trim(),
          role,
          status,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to update user");
      }

      showToast("success", `User ${user.username} berhasil diupdate`);
      onSuccess();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update user");
      showToast("error", err instanceof Error ? err.message : "Gagal mengupdate user");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = async () => {
    if (hasChanges) {
      const result = await Swal.fire({
        title: "Ada perubahan belum disimpan",
        text: "Yakin ingin menutup tanpa menyimpan?",
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#dc2626",
        cancelButtonColor: "#6b7280",
        confirmButtonText: "Ya, tutup",
        cancelButtonText: "Batal",
      });
      if (!result.isConfirmed) return;
    }
    setError(null);
    onClose();
  };

  const canSave = 
    fullName.trim() !== "" && 
    hasChanges;

  const isLastAdmin = user?.role === "Admin" && totalAdmins === 1;
  const isAdmin = role === "Admin";
  const canDeactivate = !isAdmin;

  if (!user) return null;

  return (
    <Modal
      open={open}
      title="Edit User"
      onClose={handleClose}
      footer={
        <>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleSave}
            disabled={!canSave || loading}
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Saving...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Save className="w-4 h-4" />
                Save Changes
              </span>
            )}
          </Button>
        </>
      }
    >
      {/* ✅ CHILDREN DIMULAI DI SINI */}
      <div className="space-y-5">
        {/* Current User Info */}
        <div className="bg-slate-50 border border-gray-200 rounded-lg p-4">
          <h4 className="text-sm font-medium text-gray-900 mb-3">Current Information</h4>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white border border-gray-200 rounded-lg">
              <UserCircle className="w-5 h-5 text-gray-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">{user.username}</p>
              <p className="text-xs text-gray-500">{user.fullName}</p>
            </div>
            <div className="flex items-center gap-2">
              <span
                className={`inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 text-xs font-medium ${
                  user.role === "Admin"
                    ? "bg-violet-50 text-violet-700 border-violet-200"
                    : "bg-slate-100 text-slate-700 border-slate-300"
                }`}
              >
                {user.role === "Admin" && <Shield className="w-3 h-3" />}
                {user.role}
              </span>
              <span
                className={`inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 text-xs font-medium ${
                  user.status === "Active"
                    ? "bg-green-50 text-green-700 border-green-300"
                    : "bg-slate-100 text-slate-500 border-slate-300"
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    user.status === "Active" ? "bg-green-500" : "bg-slate-400"
                  }`}
                />
                {user.status}
              </span>
            </div>
          </div>
        </div>

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

        {/* Last Admin Warning */}
        {isLastAdmin && (
          <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
            <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium text-red-900">
                Last Administrator Account
              </p>
              <p className="mt-1 text-xs text-red-700">
                This is the only administrator account in the system. The role cannot be changed to ensure continuous system access.
              </p>
            </div>
          </div>
        )}

        {/* Info Notice */}
        <div className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-medium text-blue-900">
              Editing User Information
            </p>
            <p className="mt-1 text-xs text-blue-700">
              Changes will be applied immediately after saving. The user may need to log out and log back in to see some changes reflected.
            </p>
          </div>
        </div>

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
          {fullName.trim() === "" && (
            <p className="mt-1.5 text-xs text-red-600 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              Full name is required
            </p>
          )}
          {fullName !== user.fullName && fullName.trim() !== "" && (
            <p className="mt-1.5 text-xs text-amber-600 flex items-center gap-1">
              <Pencil className="w-3 h-3" />
              Changed from: {user.fullName}
            </p>
          )}
        </div>

        {/* Role Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            User Role
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => !isLastAdmin && setRole("User")}
              disabled={isLastAdmin && role === "Admin"}
              className={`relative flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 text-sm font-medium transition-all ${
                role === "User"
                  ? "border-slate-500 bg-slate-50 text-slate-700"
                  : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
              } ${isLastAdmin && role === "Admin" ? "opacity-50 cursor-not-allowed" : ""}`}
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

          {role !== user.role && (
            <p className="mt-1.5 text-xs text-amber-600 flex items-center gap-1">
              <Pencil className="w-3 h-3" />
              Changed from: {user.role}
            </p>
          )}
        </div>

        {/* Status Selection */}
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
              onClick={() => canDeactivate && setStatus("Inactive")}
              disabled={!canDeactivate}
              className={`relative flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 text-sm font-medium transition-all ${
                status === "Inactive"
                  ? "border-slate-400 bg-slate-50 text-slate-700"
                  : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
              } ${!canDeactivate ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              <span className={`w-2 h-2 rounded-full ${status === "Inactive" ? "bg-slate-400" : "bg-gray-300"}`} />
              Inactive
              {status === "Inactive" && (
                <CheckCircle2 className="absolute right-3 w-4 h-4 text-slate-600" />
              )}
            </button>
          </div>
          
          <div className="mt-2 text-xs text-gray-500">
            {!canDeactivate
              ? "Administrator accounts must remain active for system access"
              : status === "Active"
              ? "User can log in and access the system"
              : "User cannot log in (account suspended)"}
          </div>

          {status !== user.status && (
            <p className="mt-1.5 text-xs text-amber-600 flex items-center gap-1">
              <Pencil className="w-3 h-3" />
              Changed from: {user.status}
            </p>
          )}
        </div>

        {/* Warning for admin deactivation attempt */}
        {isAdmin && status === "Inactive" && (
          <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
            <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium text-red-900">
                Cannot Deactivate Administrator
              </p>
              <p className="mt-1 text-xs text-red-700">
                Administrator accounts cannot be deactivated for security reasons. Change the role to User first if you need to deactivate this account.
              </p>
            </div>
          </div>
        )}

        {/* Warning for role downgrade (Admin → User) */}
        {user.role === "Admin" && role === "User" && !isLastAdmin && (
          <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
            <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium text-red-900">
                Critical Role Change
              </p>
              <p className="mt-1 text-xs text-red-700">
                You are removing administrator privileges from this user. They will immediately lose access to all admin features and settings. This action requires confirmation before saving.
              </p>
            </div>
          </div>
        )}

        {/* Warning for role upgrade (User → Admin) */}
        {user.role === "User" && role === "Admin" && (
          <div className="flex items-start gap-3 p-4 bg-violet-50 border border-violet-200 rounded-lg">
            <Shield className="w-5 h-5 text-violet-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium text-violet-900">
                Administrator Privileges
              </p>
              <p className="mt-1 text-xs text-violet-700">
                You are granting administrator privileges to this user. They will have full system access including user management, configuration changes, and sensitive data. This action requires confirmation before saving.
              </p>
            </div>
          </div>
        )}

        {/* Warning for deactivation */}
        {user.status === "Active" && status === "Inactive" && canDeactivate && (
          <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium text-amber-900">
                Account Deactivation
              </p>
              <p className="mt-1 text-xs text-amber-700">
                Deactivating this account will prevent the user from logging in. They will lose access to all system features until reactivated. This action requires confirmation before saving.
              </p>
            </div>
          </div>
        )}

        {/* Changes Summary */}
        {hasChanges && (
          <div className="bg-slate-50 border border-gray-200 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-900 mb-2 flex items-center gap-2">
              <Pencil className="w-4 h-4 text-gray-600" />
              Pending Changes
            </h4>
            <div className="space-y-1.5">
              {fullName !== user.fullName && (
                <div className="text-xs">
                  <span className="text-gray-500">Full Name:</span>{" "}
                  <span className="text-red-600 line-through">{user.fullName}</span>{" "}
                  <span className="text-gray-400">→</span>{" "}
                  <span className="text-emerald-600 font-medium">{fullName}</span>
                </div>
              )}
              {role !== user.role && (
                <div className="text-xs">
                  <span className="text-gray-500">Role:</span>{" "}
                  <span className="text-red-600 line-through">{user.role}</span>{" "}
                  <span className="text-gray-400">→</span>{" "}
                  <span className="text-emerald-600 font-medium">{role}</span>
                </div>
              )}
              {status !== user.status && (
                <div className="text-xs">
                  <span className="text-gray-500">Status:</span>{" "}
                  <span className="text-red-600 line-through">{user.status}</span>{" "}
                  <span className="text-gray-400">→</span>{" "}
                  <span className="text-emerald-600 font-medium">{status}</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      {/* ✅ CHILDREN SELESAI DI SINI */}
    </Modal>
  );
}