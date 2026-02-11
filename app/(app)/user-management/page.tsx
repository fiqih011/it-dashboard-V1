"use client";

import { useMemo, useState, useEffect } from "react";
import DataTable from "@/components/table/DataTable";
import Button from "@/components/ui/Button";
import CreateUserModal from "@/components/modal/CreateUserModal";
import ResetPasswordModal from "@/components/modal/ResetPasswordModal";
import ChangePasswordModal from "@/components/modal/ChangePasswordModal"; // ✅ TAMBAH
import EditUserModal from "@/components/modal/EditUserModal";
import ChangeMyPasswordModal from "@/components/modal/ChangeMyPasswordModal";
import { useToast, confirmDelete } from "@/lib/swal";
import {
  Search,
  UserPlus,
  Pencil,
  KeyRound,
  Trash2,
  Users,
  UserCheck,
  UserX,
  Shield,
  ShieldAlert,
  Lock,
} from "lucide-react";

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
  const [openChange, setOpenChange] = useState(false); // ✅ TAMBAH untuk admin
  const [openReset, setOpenReset] = useState(false); // untuk user
  const [openEdit, setOpenEdit] = useState(false);
  const [openChangeMyPassword, setOpenChangeMyPassword] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserRow | null>(null);

  const { showToast } = useToast();

  // Fetch users from API
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/user-management/users");
      
      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }

      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
      showToast("error", "Gagal memuat data user. Silakan refresh halaman.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Filter data
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

  // Statistics
  const stats = useMemo(() => {
    const total = users.length;
    const active = users.filter((u) => u.status === "Active").length;
    const inactive = users.filter((u) => u.status === "Inactive").length;
    const admins = users.filter((u) => u.role === "Admin").length;

    return { total, active, inactive, admins };
  }, [users]);

  const handleEdit = (user: UserRow) => {
    setSelectedUser(user);
    setOpenEdit(true);
  };

  // ✅ TAMBAH: Handler untuk Change Password (admin - manual input)
  const handleChangePassword = (user: UserRow) => {
    setSelectedUser(user);
    setOpenChange(true);
  };

  // Handler untuk Reset Password (user - auto-generate)
  const handleReset = (user: UserRow) => {
    setSelectedUser(user);
    setOpenReset(true);
  };

  const handleDelete = async (user: UserRow) => {
    // Prevent deleting any admin
    if (user.role === "Admin") {
      showToast("error", "Akun administrator tidak dapat dihapus karena alasan keamanan");
      return;
    }

    const confirmed = await confirmDelete(
      `Hapus user ${user.username}?`,
      "Aksi ini tidak dapat dibatalkan. User akan dihapus secara permanen."
    );

    if (!confirmed) return;

    try {
      const response = await fetch(`/api/user-management/${user.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to delete user");
      }

      await fetchUsers();
      showToast("success", `User ${user.username} berhasil dihapus`);
    } catch (error) {
      console.error("Delete error:", error);
      showToast("error", error instanceof Error ? error.message : "Gagal menghapus user");
    }
  };

  const handleUserCreated = () => {
    setOpenCreate(false);
    fetchUsers();
  };

  const handleUserUpdated = () => {
    setOpenEdit(false);
    setSelectedUser(null);
    fetchUsers();
  };

  // ✅ TAMBAH: Handler untuk Change Password success
  const handlePasswordChanged = () => {
    setOpenChange(false);
    setSelectedUser(null);
    fetchUsers();
  };

  // Handler untuk Reset Password success
  const handlePasswordReset = () => {
    setOpenReset(false);
    setSelectedUser(null);
    fetchUsers();
  };

  const columns = useMemo(
    () => [
      {
        header: "Username",
        accessor: (row: UserRow) => (
          <div className="flex flex-col gap-0.5">
            <span className="font-medium text-gray-900">{row.username}</span>
            <span className="text-xs text-gray-500">{row.fullName}</span>
          </div>
        ),
      },
      {
        header: "Role",
        accessor: (row: UserRow) => (
          <span
            className={`inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs font-medium ${
              row.role === "Admin"
                ? "bg-violet-50 text-violet-700 border-violet-200"
                : "bg-slate-100 text-slate-700 border-slate-300"
            }`}
          >
            {row.role === "Admin" && <Shield className="w-3 h-3" />}
            {row.role}
          </span>
        ),
      },
      {
        header: "Status",
        accessor: (row: UserRow) => (
          <span
            className={`inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs font-medium ${
              row.status === "Active"
                ? "bg-green-50 text-green-700 border-green-300"
                : "bg-slate-100 text-slate-500 border-slate-300"
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                row.status === "Active" ? "bg-green-500" : "bg-slate-400"
              }`}
            />
            {row.status}
          </span>
        ),
      },
      {
        header: "Last Login",
        accessor: (row: UserRow) => (
          <span className="text-sm text-gray-700">
            {row.lastLogin ?? <span className="text-gray-400">Never</span>}
          </span>
        ),
      },
      {
        header: "Actions",
        accessor: (row: UserRow) => {
          const isAdmin = row.role === "Admin";

          return (
            <div className="flex items-center gap-1">
              {/* Edit Button */}
              <button
                onClick={() => handleEdit(row)}
                className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                title="Edit user"
              >
                <Pencil className="w-4 h-4" />
              </button>

              {/* ✅ KONDISIONAL: Change Password (admin) atau Reset Password (user) */}
              {isAdmin ? (
                <button
                  onClick={() => handleChangePassword(row)}
                  className="p-1.5 text-gray-400 hover:text-violet-600 hover:bg-violet-50 rounded transition-colors"
                  title="Change password"
                >
                  <Lock className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={() => handleReset(row)}
                  className="p-1.5 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded transition-colors"
                  title="Reset password"
                >
                  <KeyRound className="w-4 h-4" />
                </button>
              )}

              {/* Delete Button */}
              <button
                onClick={() => handleDelete(row)}
                disabled={isAdmin}
                className={`p-1.5 rounded transition-colors ${
                  isAdmin
                    ? "text-gray-300 cursor-not-allowed"
                    : "text-gray-400 hover:text-red-600 hover:bg-red-50"
                }`}
                title={
                  isAdmin
                    ? "Admin accounts cannot be deleted"
                    : "Delete user"
                }
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          );
        },
      },
    ],
    []
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm text-gray-600">Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Page Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">
                User Management
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                Manage user accounts, roles, and access permissions
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
              <Button
                variant="secondary"
                onClick={() => setOpenChangeMyPassword(true)}
                className="flex items-center justify-center gap-2"
              >
                <Lock className="w-4 h-4" />
                Change My Password
              </Button>

              <Button
                variant="primary"
                onClick={() => setOpenCreate(true)}
                className="flex items-center justify-center gap-2"
              >
                <UserPlus className="w-4 h-4" />
                Create User
              </Button>
            </div>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Total Users */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-500">Total Users</p>
                  <p className="mt-2 text-2xl font-semibold text-gray-900">
                    {stats.total}
                  </p>
                </div>
                <div className="flex-shrink-0 p-3 bg-blue-50 rounded-lg">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>

            {/* Active Users */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-500">Active Users</p>
                  <p className="mt-2 text-2xl font-semibold text-emerald-600">
                    {stats.active}
                  </p>
                </div>
                <div className="flex-shrink-0 p-3 bg-emerald-50 rounded-lg">
                  <UserCheck className="w-6 h-6 text-emerald-600" />
                </div>
              </div>
            </div>

            {/* Inactive Users */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-500">Inactive Users</p>
                  <p className="mt-2 text-2xl font-semibold text-gray-700">
                    {stats.inactive}
                  </p>
                </div>
                <div className="flex-shrink-0 p-3 bg-slate-100 rounded-lg">
                  <UserX className="w-6 h-6 text-gray-600" />
                </div>
              </div>
            </div>

            {/* Administrators */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-500">Administrators</p>
                  <p className="mt-2 text-2xl font-semibold text-violet-600">
                    {stats.admins}
                  </p>
                </div>
                <div className="flex-shrink-0 p-3 bg-violet-50 rounded-lg">
                  <Shield className="w-6 h-6 text-violet-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Filters & Search */}
          <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
            <div className="flex flex-col md:flex-row gap-3">
              {/* Search */}
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by username or name..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Role Filter */}
              <div className="w-full md:w-40">
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value as typeof roleFilter)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="All">All Roles</option>
                  <option value="Admin">Admin</option>
                  <option value="User">User</option>
                </select>
              </div>

              {/* Status Filter */}
              <div className="w-full md:w-40">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="All">All Status</option>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </div>

            {/* Active Filters Info */}
            {(searchQuery || roleFilter !== "All" || statusFilter !== "All") && (
              <div className="mt-3 flex flex-wrap items-center gap-2 text-sm">
                <span className="text-gray-700">
                  Showing {filteredUsers.length} of {users.length} users
                </span>
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setRoleFilter("All");
                    setStatusFilter("All");
                  }}
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  Clear filters
                </button>
              </div>
            )}
          </div>

          {/* Admin Protection Notice */}
          {stats.admins > 0 && (
            <div className="flex items-start gap-3 p-4 bg-violet-50 border border-violet-200 rounded-lg">
              <ShieldAlert className="w-5 h-5 text-violet-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-violet-900">
                  Administrator Account Protection
                </p>
                <p className="mt-1 text-xs text-violet-700">
                  Administrator accounts cannot be deactivated or deleted for security reasons. 
                  This ensures continuous system access and management capability.
                </p>
              </div>
            </div>
          )}

          {/* Table */}
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
            {filteredUsers.length > 0 ? (
              <div className="overflow-x-auto">
                <DataTable<UserRow> columns={columns} data={filteredUsers} />
              </div>
            ) : (
              <div className="py-16 text-center">
                <Users className="mx-auto w-12 h-12 text-gray-300" />
                <h3 className="mt-4 text-sm font-medium text-gray-900">
                  No users found
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  {searchQuery || roleFilter !== "All" || statusFilter !== "All"
                    ? "Try adjusting your search or filter criteria"
                    : "Get started by creating a new user"}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      <CreateUserModal 
        open={openCreate} 
        onClose={() => setOpenCreate(false)}
        onSuccess={handleUserCreated}
      />

      {/* ✅ TAMBAH: Change Password Modal (untuk admin - manual input) */}
      <ChangePasswordModal
        open={openChange}
        userId={selectedUser?.id ?? ""}
        username={selectedUser?.username ?? ""}
        fullName={selectedUser?.fullName}
        onClose={handlePasswordChanged}
      />

      {/* Reset Password Modal (untuk user - auto-generate) */}
      <ResetPasswordModal
        open={openReset}
        userId={selectedUser?.id ?? ""}
        username={selectedUser?.username ?? ""}
        fullName={selectedUser?.fullName}
        onClose={handlePasswordReset}
      />

      <EditUserModal
        open={openEdit}
        user={selectedUser}
        totalAdmins={stats.admins}
        onClose={() => {
          setOpenEdit(false);
          setSelectedUser(null);
        }}
        onSuccess={handleUserUpdated}
      />

      <ChangeMyPasswordModal
        open={openChangeMyPassword}
        onClose={() => setOpenChangeMyPassword(false)}
      />
    </>
  );
}