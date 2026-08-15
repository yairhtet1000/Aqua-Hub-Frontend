import { useEffect, useState, useCallback } from "react";
import { ChevronDown, Loader2, ShieldCheck, User, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import { useToast } from "../../hooks";

const UserManager = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rolesLoading, setRolesLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const { addToast } = useToast();

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page };
      if (search.trim()) {
        params.search = search.trim();
      }
      const response = await api.get("/admin/users", { params });
      setUsers(response.data.data || []);
      setTotalPages(response.data.last_page || 1);
    } catch {
      addToast("Failed to load users.", "error");
    } finally {
      setLoading(false);
    }
  }, [addToast, page, search]);

  const fetchRoles = useCallback(async () => {
    setRolesLoading(true);
    try {
      const response = await api.get("/admin/roles");
      setRoles(response.data || []);
    } catch {
      addToast("Failed to load roles.", "error");
    } finally {
      setRolesLoading(false);
    }
  }, [addToast]);

  useEffect(() => {
    fetchUsers();
    fetchRoles();
  }, [fetchUsers, fetchRoles]);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handleRoleChange = async (userId, newRoleId) => {
    setUpdatingId(userId);
    try {
      await api.patch(`/admin/users/${userId}/role`, {
        role_id: parseInt(newRoleId, 10),
      });
      setUsers((prev) =>
        prev.map((u) =>
          u.id === userId
            ? {
                ...u,
                role:
                  roles.find((r) => r.id === parseInt(newRoleId, 10)) || u.role,
              }
            : u,
        ),
      );
      addToast("User role updated successfully.", "success");
    } catch {
      addToast("Failed to update user role.", "error");
    } finally {
      setUpdatingId(null);
    }
  };

  const getRoleBadge = (roleName) => {
    const styles = {
      Admin: "bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-200",
      Moderator:
        "bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-200",
      Member:
        "bg-slate-100 text-slate-600 dark:bg-slate-900 dark:text-slate-300",
    };
    return (
      <span
        className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-bold ${styles[roleName] || styles.Member}`}
      >
        {roleName}
      </span>
    );
  };

  return (
    <div className="mx-auto w-[min(1200px,100%)] grid gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-950 dark:text-white">
            User Management
          </h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            View and manage user roles across the platform.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              value={search}
              onChange={handleSearchChange}
              placeholder="Search users..."
              className="h-10 rounded-xl border border-slate-200 bg-white pl-9 pr-4 text-sm font-semibold text-slate-700 focus:outline-teal-700 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200"
            />
          </div>
          <button
            onClick={fetchUsers}
            className="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-bold text-slate-700 transition hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-900"
          >
            <ShieldCheck size={16} />
            Refresh
          </button>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950">
        {loading || rolesLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 size={28} className="animate-spin text-teal-700" />
          </div>
        ) : users.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-500">
            <User size={40} className="mb-3 opacity-40" />
            <p className="text-sm font-semibold">No users found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800">
                  <th className="px-6 py-4 font-bold text-slate-500 dark:text-slate-400">
                    User
                  </th>
                  <th className="px-6 py-4 font-bold text-slate-500 dark:text-slate-400">
                    Email
                  </th>
                  <th className="px-6 py-4 font-bold text-slate-500 dark:text-slate-400">
                    Role
                  </th>
                  <th className="px-6 py-4 font-bold text-slate-500 dark:text-slate-400">
                    Joined
                  </th>
                  <th className="px-6 py-4 font-bold text-slate-500 dark:text-slate-400">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {users.map((u) => (
                  <tr
                    key={u.id}
                    className="transition hover:bg-slate-50 dark:hover:bg-slate-900"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="grid h-9 w-9 place-items-center rounded-full bg-slate-100 text-xs font-black text-slate-600 dark:bg-slate-900 dark:text-slate-300">
                          {u.name?.charAt(0).toUpperCase() || "U"}
                        </div>
                        <span className="font-semibold text-slate-950 dark:text-white">
                          {u.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-300">
                      {u.email}
                    </td>
                    <td className="px-6 py-4">{getRoleBadge(u.role?.name)}</td>
                    <td className="px-6 py-4 text-slate-500 dark:text-slate-400">
                      {u.created_at
                        ? new Date(u.created_at).toLocaleDateString()
                        : "—"}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => navigate(`/admin/users/${u.id}/edit`)}
                          className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 text-xs font-bold text-slate-700 transition hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-900"
                        >
                          Edit
                        </button>
                        <div className="relative">
                          <select
                            value={u.role?.id || ""}
                            onChange={(e) =>
                              handleRoleChange(u.id, e.target.value)
                            }
                            disabled={updatingId === u.id}
                            className="h-9 appearance-none rounded-lg border border-slate-200 bg-white pl-3 pr-8 text-xs font-bold text-slate-700 focus:outline-teal-700 disabled:opacity-60 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200"
                          >
                            {roles.map((role) => (
                              <option key={role.id} value={role.id}>
                                {role.name}
                              </option>
                            ))}
                          </select>
                          <ChevronDown
                            size={14}
                            className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-slate-400"
                          />
                        </div>
                        {updatingId === u.id && (
                          <Loader2
                            size={16}
                            className="animate-spin text-teal-700"
                          />
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-3 border-t border-slate-200 px-6 py-4 dark:border-slate-800">
            <button
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              disabled={page <= 1}
              className="inline-flex h-9 items-center justify-center rounded-lg border border-slate-200 bg-white px-4 text-sm font-bold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200"
            >
              Previous
            </button>
            <span className="text-sm font-semibold text-slate-600 dark:text-slate-400">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={page >= totalPages}
              className="inline-flex h-9 items-center justify-center rounded-lg border border-slate-200 bg-white px-4 text-sm font-bold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserManager;
