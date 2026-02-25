"use client";

import { useEffect, useMemo, useState } from "react";
import { Users, UserCheck, UserX, Shield, Search, Plus, Lock, Pencil, Trash2 } from "lucide-react";
import CreateUserModal from "@/components/modal/CreateUserModal";
import ResetPasswordModal from "@/components/modal/ResetPasswordModal";
import ChangePasswordModal from "@/components/modal/ChangePasswordModal";
import EditUserModal from "@/components/modal/EditUserModal";
import ChangeMyPasswordModal from "@/components/modal/ChangeMyPasswordModal";
import { useToast, confirmDelete } from "@/lib/swal";

type UserRow = {
  id: string;
  username: string;
  fullName: string;
  role: "Admin" | "User";
  status: "Active" | "Inactive";
  lastLogin: string | null;
};

// ─────────────────────────────────────────────
// SUMMARY CARDS — same pattern as other pages
// ─────────────────────────────────────────────
function SummaryCard({
  label, value, sub, gradient, icon: Icon,
}: {
  label: string; value: number; sub: string; gradient: string;
  icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <div className={`bg-gradient-to-br ${gradient} rounded-2xl p-5 text-white`}>
      <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center mb-3">
        <Icon className="w-5 h-5 text-white" />
      </div>
      <p className="text-xs font-bold uppercase tracking-wide text-white/70 mb-1">{label}</p>
      <p className="text-3xl font-bold">{value}</p>
      <p className="text-xs text-white/60 mt-0.5">{sub}</p>
    </div>
  );
}

export default function UserManagementPage() {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<"All" | "Admin" | "User">("All");
  const [statusFilter, setStatusFilter] = useState<"All" | "Active" | "Inactive">("All");

  const [openCreate, setOpenCreate] = useState(false);
  const [openChange, setOpenChange] = useState(false);
  const [openReset, setOpenReset] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openChangeMyPassword, setOpenChangeMyPassword] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserRow | null>(null);

  const { showToast } = useToast();

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/user-management/users");
      if (!res.ok) throw new Error("Failed to fetch users");
      setUsers(await res.json());
    } catch {
      showToast("error", "Gagal memuat data user");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const filteredUsers = useMemo(() =>
    users.filter((u) => {
      const q = searchQuery.toLowerCase();
      return (
        (u.username.toLowerCase().includes(q) || u.fullName.toLowerCase().includes(q)) &&
        (roleFilter === "All" || u.role === roleFilter) &&
        (statusFilter === "All" || u.status === statusFilter)
      );
    }),
    [users, searchQuery, roleFilter, statusFilter]
  );

  const stats = useMemo(() => ({
    total: users.length,
    active: users.filter((u) => u.status === "Active").length,
    inactive: users.filter((u) => u.status === "Inactive").length,
    admins: users.filter((u) => u.role === "Admin").length,
  }), [users]);

  const handleDelete = async (user: UserRow) => {
    if (user.role === "Admin") { showToast("error", "Admin tidak dapat dihapus"); return; }
    const ok = await confirmDelete(`Hapus user ${user.username}?`, "Aksi ini tidak dapat dibatalkan.");
    if (!ok) return;
    try {
      const res = await fetch(`/api/user-management/${user.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      await fetchUsers();
      showToast("success", "User berhasil dihapus");
    } catch {
      showToast("error", "Gagal menghapus user");
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">

        {/* ── Page Header ── */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">User Management</h1>
            <p className="text-sm text-gray-500 mt-1">
              Kelola akun pengguna, role, dan hak akses sistem
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setOpenChangeMyPassword(true)}
              className="inline-flex items-center gap-2 bg-white border border-gray-200 hover:border-indigo-300 hover:bg-indigo-50 text-gray-700 hover:text-indigo-700 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-sm"
            >
              <Lock className="w-4 h-4" />
              Change My Password
            </button>
            <button
              onClick={() => setOpenCreate(true)}
              className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-xl text-sm font-semibold shadow-sm transition-all"
            >
              <Plus className="w-4 h-4" />
              Create User
            </button>
          </div>
        </div>

        {/* ── Summary Cards ── */}
        <div className="grid grid-cols-4 gap-4">
          <SummaryCard label="Total Users"      value={stats.total}    sub="All registered users"  gradient="from-indigo-600 to-indigo-500" icon={Users} />
          <SummaryCard label="Active Users"     value={stats.active}   sub="Currently active"      gradient="from-emerald-600 to-emerald-500" icon={UserCheck} />
          <SummaryCard label="Inactive Users"   value={stats.inactive} sub="Disabled accounts"     gradient="from-amber-500 to-orange-400"   icon={UserX} />
          <SummaryCard label="Administrators"   value={stats.admins}   sub="With admin access"     gradient="from-blue-600 to-blue-500"      icon={Shield} />
        </div>

        {/* ── Filter Bar ── */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-4">
          <div className="flex items-center gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                type="text"
                placeholder="Search by username or name..."
                className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition"
              />
            </div>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value as any)}
              className="px-4 py-2.5 rounded-xl text-sm border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none text-gray-700"
            >
              <option value="All">All Roles</option>
              <option value="Admin">Admin</option>
              <option value="User">User</option>
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="px-4 py-2.5 rounded-xl text-sm border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none text-gray-700"
            >
              <option value="All">All Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </div>

        {/* ── Admin Notice ── */}
        {stats.admins > 0 && (
          <div className="bg-indigo-50 border border-indigo-200 rounded-2xl p-4 flex gap-3">
            <Shield className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-indigo-800">Administrator Account Protection</p>
              <p className="text-sm text-indigo-600 mt-0.5">
                Administrator accounts cannot be deactivated or deleted for security reasons.
              </p>
            </div>
          </div>
        )}

        {/* ── Table ── */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
          <table className="w-full border-collapse text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                {["Username", "Role", "Status", "Last Login", "Actions"].map((h) => (
                  <th key={h} className="px-4 py-2.5 text-left text-xs font-bold uppercase tracking-wide text-gray-700 border-r border-gray-200 last:border-r-0">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-16 text-center text-sm text-gray-400">
                    Tidak ada user yang ditemukan
                  </td>
                </tr>
              ) : filteredUsers.map((user, index) => {
                const isAdmin = user.role === "Admin";
                const rowBg = index % 2 === 0 ? "bg-white" : "bg-gray-50";
                return (
                  <tr key={user.id} className={`${rowBg} hover:bg-indigo-50/30 transition-colors`}>
                    {/* Username */}
                    <td className="px-4 py-3 border-r border-gray-100">
                      <p className="font-semibold text-gray-800">{user.username}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{user.fullName}</p>
                    </td>

                    {/* Role */}
                    <td className="px-4 py-3 border-r border-gray-100">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                        isAdmin
                          ? "bg-indigo-50 text-indigo-700 border-indigo-200"
                          : "bg-gray-100 text-gray-600 border-gray-200"
                      }`}>
                        {isAdmin && <Shield className="w-3 h-3" />}
                        {user.role}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="px-4 py-3 border-r border-gray-100">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                        user.status === "Active"
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : "bg-gray-100 text-gray-500 border-gray-200"
                      }`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${user.status === "Active" ? "bg-emerald-500" : "bg-gray-400"}`} />
                        {user.status}
                      </span>
                    </td>

                    {/* Last Login */}
                    <td className="px-4 py-3 border-r border-gray-100 text-sm text-gray-500">
                      {user.lastLogin ?? (
                        <span className="text-gray-300 italic text-xs">Never</span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        {/* Edit */}
                        <button
                          onClick={() => { setSelectedUser(user); setOpenEdit(true); }}
                          title="Edit user"
                          className="p-2 rounded-lg hover:bg-indigo-50 text-gray-400 hover:text-indigo-600 transition-colors"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>

                        {/* Change / Reset Password */}
                        <button
                          onClick={() => {
                            setSelectedUser(user);
                            isAdmin ? setOpenChange(true) : setOpenReset(true);
                          }}
                          title={isAdmin ? "Change password" : "Reset password"}
                          className="p-2 rounded-lg hover:bg-indigo-50 text-gray-400 hover:text-indigo-600 transition-colors"
                        >
                          <Lock className="w-4 h-4" />
                        </button>

                        {/* Delete */}
                        {!isAdmin && (
                          <button
                            onClick={() => handleDelete(user)}
                            title="Delete user"
                            className="p-2 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-600 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* Table Footer */}
          <div className="px-4 py-3 border-t border-gray-100 bg-gray-50 text-xs text-gray-400">
            Showing {filteredUsers.length} of {users.length} users
          </div>
        </div>
      </div>

      {/* ── Modals ── */}
      <CreateUserModal
        open={openCreate}
        onClose={() => setOpenCreate(false)}
        onSuccess={fetchUsers}
      />
      <ChangePasswordModal
        open={openChange}
        userId={selectedUser?.id ?? ""}
        username={selectedUser?.username ?? ""}
        fullName={selectedUser?.fullName}
        onClose={() => setOpenChange(false)}
      />
      <ResetPasswordModal
        open={openReset}
        userId={selectedUser?.id ?? ""}
        username={selectedUser?.username ?? ""}
        fullName={selectedUser?.fullName}
        onClose={() => setOpenReset(false)}
      />
      <EditUserModal
        open={openEdit}
        user={selectedUser}
        totalAdmins={stats.admins}
        onClose={() => setOpenEdit(false)}
        onSuccess={fetchUsers}
      />
      <ChangeMyPasswordModal
        open={openChangeMyPassword}
        onClose={() => setOpenChangeMyPassword(false)}
      />
    </>
  );
}