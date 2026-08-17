'use client';

import React, { useEffect, useState } from 'react';
import { Users, Shield, ShieldOff, Search, UserCheck } from 'lucide-react';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'USER' | 'ADMIN';
  createdAt: string;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/users');
      if (res.ok) {
        const json = await res.json();
        setUsers(json.users || []);
      }
    } finally {
      setLoading(false);
    }
  }

  async function toggleRole(user: User) {
    const newRole = user.role === 'ADMIN' ? 'USER' : 'ADMIN';
    if (!confirm(`Change ${user.name}'s role to ${newRole}?`)) return;

    setUpdating(user.id);
    try {
      const res = await fetch(`/api/admin/users/${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: newRole }),
      });
      if (res.ok) {
        setUsers((prev) =>
          prev.map((u) => (u.id === user.id ? { ...u, role: newRole } : u))
        );
      }
    } finally {
      setUpdating(null);
    }
  }

  const filtered = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <Users className="h-6 w-6 text-blue-500" /> User Management
          </h1>
          <p className="text-sm text-gray-400">{users.length} registered members</p>
        </div>
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-gray-900 border border-gray-800 rounded text-sm text-white focus:border-orange-500 focus:outline-none"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20 gap-2">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-orange-500" />
          <span className="text-sm text-gray-400">Loading users...</span>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-gray-800 rounded-lg">
          <UserCheck className="h-12 w-12 text-gray-700 mx-auto mb-3" />
          <p className="text-gray-400 text-sm">No users found</p>
        </div>
      ) : (
        <div className="rounded-lg border border-gray-800 overflow-hidden">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-900/60">
              <tr className="border-b border-gray-800 text-gray-400 uppercase text-[10px] tracking-widest">
                <th className="px-4 py-3 font-semibold">Name</th>
                <th className="px-4 py-3 font-semibold">Email</th>
                <th className="px-4 py-3 font-semibold">Role</th>
                <th className="px-4 py-3 font-semibold">Joined</th>
                <th className="px-4 py-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/50">
              {filtered.map((user) => (
                <tr key={user.id} className="hover:bg-gray-900/30 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <div className="h-8 w-8 rounded-full bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400 font-bold text-xs uppercase">
                        {user.name.substring(0, 2)}
                      </div>
                      <span className="text-white font-medium">{user.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-400">{user.email}</td>
                  <td className="px-4 py-3">
                    {user.role === 'ADMIN' ? (
                      <span className="inline-flex items-center gap-1 bg-purple-500/10 text-purple-400 border border-purple-500/20 px-2 py-0.5 rounded text-[10px] font-bold uppercase">
                        <Shield className="h-3 w-3" /> Admin
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded text-[10px] font-bold uppercase">
                        <UserCheck className="h-3 w-3" /> User
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-gray-500 text-xs">
                    {new Date(user.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => toggleRole(user)}
                      disabled={updating === user.id}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-bold transition-colors ${
                        user.role === 'ADMIN'
                          ? 'bg-gray-800 hover:bg-rose-500/10 text-gray-400 hover:text-rose-400 border border-gray-700 hover:border-rose-500/30'
                          : 'bg-gray-800 hover:bg-purple-500/10 text-gray-400 hover:text-purple-400 border border-gray-700 hover:border-purple-500/30'
                      }`}
                    >
                      {updating === user.id ? (
                        <div className="h-3 w-3 animate-spin rounded-full border-b border-current" />
                      ) : user.role === 'ADMIN' ? (
                        <><ShieldOff className="h-3 w-3" /> Revoke Admin</>
                      ) : (
                        <><Shield className="h-3 w-3" /> Make Admin</>
                      )}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
