/**
 * Admin Users Page
 * Manage all registered users
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Shield, User, Search, ToggleLeft, ToggleRight, UserPlus } from 'lucide-react';
import api from '../../services/api';
import AdminSidebar from '../../components/layout/AdminSidebar';
import { LoadingSpinner, EmptyState, Pagination } from '../../components/common/index.jsx';
import { formatDate } from '../../utils/helpers';
import toast from 'react-hot-toast';

const ROLE_COLORS = {
  citizen: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
  police: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
  admin: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
};

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [roleFilter, setRoleFilter] = useState('');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchUsers = async (page = 1) => {
    setLoading(true);
    try {
      const res = await api.get('/admin/users', { params: { page, limit: 15, role: roleFilter } });
      setUsers(res.data.users);
      setPagination(res.data.pagination);
    } catch {
      toast.error('Failed to load users.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(1); }, [roleFilter]);

  const toggleUser = async (userId, currentStatus) => {
    try {
      await api.put(`/admin/users/${userId}/toggle`);
      toast.success(`User ${currentStatus ? 'deactivated' : 'activated'}.`);
      fetchUsers(pagination.page);
    } catch {
      toast.error('Failed to update user status.');
    }
  };

  const filtered = search
    ? users.filter(u =>
        u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase())
      )
    : users;

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-900">
      <AdminSidebar />
      <main className="flex-1 ml-16 md:ml-60 p-6 lg:p-8">
        <div className="pt-2 mb-8 flex items-center justify-between">
          <div>
            <h1 className="font-heading text-3xl font-bold text-slate-800 dark:text-white flex items-center gap-3">
              <Users className="w-8 h-8 text-blue-900 dark:text-blue-400" /> User Management
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">{pagination.total} registered users</p>
          </div>
        </div>

        {/* Filters */}
        <div className="glass-card rounded-2xl p-4 mb-6 flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-48">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-field pl-10 py-2.5"
            />
          </div>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="input-field py-2.5 w-auto min-w-40"
          >
            <option value="">All Roles</option>
            <option value="citizen">Citizens</option>
            <option value="police">Police Officers</option>
            <option value="admin">Admins</option>
          </select>
        </div>

        {/* Users Table */}
        <div className="glass-card rounded-2xl overflow-hidden">
          {loading ? (
            <LoadingSpinner />
          ) : filtered.length === 0 ? (
            <EmptyState icon={Users} title="No Users Found" description="No users match your search criteria." />
          ) : (
            <>
              {/* Desktop Table */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-slate-800/80">
                      {['User', 'Role', 'Phone', 'Station / Badge', 'Joined', 'Status', 'Action'].map(h => (
                        <th key={h} className="px-5 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
                    {filtered.map((u, i) => (
                      <motion.tr
                        key={u._id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: i * 0.04 }}
                        className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                      >
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-blue-900 flex items-center justify-center text-white font-bold text-sm shrink-0">
                              {u.name?.[0]?.toUpperCase()}
                            </div>
                            <div>
                              <p className="text-sm font-medium text-slate-800 dark:text-slate-200">{u.name}</p>
                              <p className="text-xs text-slate-400">{u.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${ROLE_COLORS[u.role]}`}>
                            {u.role === 'admin' ? <Shield className="w-3 h-3" /> : <User className="w-3 h-3" />}
                            {u.role}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-sm text-slate-600 dark:text-slate-400">{u.phone || '—'}</td>
                        <td className="px-5 py-4 text-sm text-slate-600 dark:text-slate-400">
                          {u.stationName ? `${u.stationName} / ${u.badgeNumber}` : '—'}
                        </td>
                        <td className="px-5 py-4 text-sm text-slate-400">{formatDate(u.createdAt)}</td>
                        <td className="px-5 py-4">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                            u.isActive
                              ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                              : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                          }`}>
                            {u.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <button
                            onClick={() => toggleUser(u._id, u.isActive)}
                            title={u.isActive ? 'Deactivate' : 'Activate'}
                            className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-all"
                          >
                            {u.isActive
                              ? <ToggleRight className="w-6 h-6 text-green-500" />
                              : <ToggleLeft className="w-6 h-6 text-slate-400" />
                            }
                          </button>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards */}
              <div className="md:hidden divide-y divide-slate-100 dark:divide-slate-700">
                {filtered.map((u) => (
                  <div key={u._id} className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-blue-900 rounded-full flex items-center justify-center text-white text-sm font-bold">
                          {u.name?.[0]}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-800 dark:text-white">{u.name}</p>
                          <p className="text-xs text-slate-400">{u.email}</p>
                        </div>
                      </div>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold capitalize ${ROLE_COLORS[u.role]}`}>
                        {u.role}
                      </span>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <span className={`text-xs font-semibold ${u.isActive ? 'text-green-600' : 'text-red-500'}`}>
                        {u.isActive ? 'Active' : 'Inactive'}
                      </span>
                      <button onClick={() => toggleUser(u._id, u.isActive)}>
                        {u.isActive
                          ? <ToggleRight className="w-6 h-6 text-green-500" />
                          : <ToggleLeft className="w-6 h-6 text-slate-400" />
                        }
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-6">
                <Pagination
                  currentPage={pagination.page}
                  totalPages={pagination.totalPages}
                  onPageChange={(p) => fetchUsers(p)}
                />
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminUsers;
