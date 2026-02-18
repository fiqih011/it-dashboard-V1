"use client";

import { useEffect, useMemo, useState } from "react";
import { Icons } from "@/components/icons";
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
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      showToast("error", "Gagal memuat data user");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesSearch =
        user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.fullName.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesRole = roleFilter === "All" || user.role === roleFilter;
      const matchesStatus = statusFilter === "All" || user.status === statusFilter;

      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [users, searchQuery, roleFilter, statusFilter]);

  const stats = useMemo(() => {
    return {
      total: users.length,
      active: users.filter((u) => u.status === "Active").length,
      inactive: users.filter((u) => u.status === "Inactive").length,
      admins: users.filter((u) => u.role === "Admin").length,
    };
  }, [users]);

  const handleEdit = (user: UserRow) => {
    setSelectedUser(user);
    setOpenEdit(true);
  };

  const handleChangePassword = (user: UserRow) => {
    setSelectedUser(user);
    setOpenChange(true);
  };

  const handleReset = (user: UserRow) => {
    setSelectedUser(user);
    setOpenReset(true);
  };

  const handleDelete = async (user: UserRow) => {
    if (user.role === "Admin") {
      showToast("error", "Admin tidak dapat dihapus");
      return;
    }

    const confirmed = await confirmDelete(
      `Hapus user ${user.username}?`,
      "Aksi ini tidak dapat dibatalkan."
    );

    if (!confirmed) return;

    try {
      const res = await fetch(`/api/user-management/${user.id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Gagal menghapus user");

      await fetchUsers();
      showToast("success", "User berhasil dihapus");
    } catch {
      showToast("error", "Gagal menghapus user");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
            <p className="text-sm text-gray-600 mt-1">
              Manage user accounts, roles, and access permissions
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setOpenChangeMyPassword(true)}
              className="inline-flex items-center gap-2 bg-white border-2 border-gray-300 hover:border-gray-400 text-gray-700 px-4 py-2.5 rounded-lg text-sm font-medium transition-all"
            >
              <Icons.Lock />
              Change My Password
            </button>

            <button
              onClick={() => setOpenCreate(true)}
              className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-lg text-sm font-medium shadow-sm transition-all"
            >
              <Icons.Add />
              Create User
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4">
          {[
            { label: "Total Users", value: stats.total, bg: "bg-blue-50" },
            { label: "Active Users", value: stats.active, bg: "bg-emerald-50" },
            { label: "Inactive Users", value: stats.inactive, bg: "bg-gray-50" },
            { label: "Administrators", value: stats.admins, bg: "bg-purple-50" },
          ].map((stat, i) => (
            <div key={i} className={`${stat.bg} rounded-xl border border-gray-200 p-4`}>
              <p className="text-xs text-gray-600 font-medium">{stat.label}</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {stat.value}
              </p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <Icons.Search />
              </div>
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                type="text"
                placeholder="Search by username or name..."
                className="w-full pl-10 pr-4 py-2.5 rounded-lg text-sm border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value as any)}
              className="px-4 py-2.5 rounded-lg text-sm border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
            >
              <option value="All">All Roles</option>
              <option value="Admin">Admin</option>
              <option value="User">User</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="px-4 py-2.5 rounded-lg text-sm border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
            >
              <option value="All">All Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </div>

        {/* Admin Notice */}
        {stats.admins > 0 && (
          <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 flex gap-3">
            <div className="text-purple-600">
              <Icons.Shield />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-purple-900">
                Administrator Account Protection
              </h4>
              <p className="text-sm text-purple-700 mt-1">
                Administrator accounts cannot be deactivated or deleted for security reasons.
              </p>
            </div>
          </div>
        )}

        {/* Table */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                {["Username", "Role", "Status", "Last Login", "Actions"].map((h, i) => (
                  <th key={i} className="px-6 py-3 text-left">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-gray-700 uppercase">
                        {h}
                      </span>
                      {i < 4 && <Icons.Sort />}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {filteredUsers.map((user) => {
                const isAdmin = user.role === "Admin";

                return (
                  <tr
                    key={user.id}
                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-gray-900">
                        {user.username}
                      </p>
                      <p className="text-xs text-gray-500">
                        {user.fullName}
                      </p>
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${
                          isAdmin
                            ? "bg-purple-100 text-purple-700 border-purple-200"
                            : "bg-gray-100 text-gray-700 border-gray-200"
                        }`}
                      >
                        {user.role}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                        {user.status}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-600">
                      {user.lastLogin ?? "Never"}
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEdit(user)}
                          className="p-2 hover:bg-indigo-50 rounded-lg transition-colors text-gray-600 hover:text-indigo-600"
                        >
                          <Icons.Edit />
                        </button>

                        {isAdmin ? (
                          <button
                            onClick={() => handleChangePassword(user)}
                            className="p-2 hover:bg-indigo-50 rounded-lg transition-colors text-gray-600 hover:text-indigo-600"
                          >
                            <Icons.Lock />
                          </button>
                        ) : (
                          <button
                            onClick={() => handleReset(user)}
                            className="p-2 hover:bg-indigo-50 rounded-lg transition-colors text-gray-600 hover:text-indigo-600"
                          >
                            <Icons.Lock />
                          </button>
                        )}

                        {!isAdmin && (
                          <button
                            onClick={() => handleDelete(user)}
                            className="p-2 hover:bg-red-50 rounded-lg transition-colors text-red-600"
                          >
                            <Icons.Delete />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODALS */}
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
