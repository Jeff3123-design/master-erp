import React, { useState } from 'react';
import { UserRole } from '../../types';
import { useApp } from '../../context/AppContext';
import { Plus, UserCheck, Shield, Edit2, X } from 'lucide-react';

interface ManagedUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: string;
}

export const UsersPage: React.FC = () => {
  const { addAuditLog, showToast } = useApp();
  const [usersList, setUsersList] = useState<ManagedUser[]>([
    { id: 'usr-1', name: 'Alex Morgan', email: 'admin@nexuserp.io', role: 'owner', status: 'Active' },
    { id: 'usr-2', name: 'Jordan Hayes', email: 'jordan@nexuserp.io', role: 'admin', status: 'Active' },
    { id: 'usr-3', name: 'Taylor Vance', email: 'sales@nexuserp.io', role: 'sales_team', status: 'Active' },
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingUser, setEditingUser] = useState<ManagedUser | null>(null);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<UserRole>('sales_team');

  const handleOpenAdd = () => {
    setEditingUser(null);
    setName('');
    setEmail('');
    setRole('sales_team');
    setShowAddModal(true);
  };

  const handleOpenEdit = (user: ManagedUser) => {
    setEditingUser(user);
    setName(user.name);
    setEmail(user.email);
    setRole(user.role);
    setShowAddModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;

    if (editingUser) {
      const prevRole = editingUser.role;
      setUsersList((prev) =>
        prev.map((u) => (u.id === editingUser.id ? { ...u, name, email, role } : u))
      );

      addAuditLog('USER_ROLE_CHANGED', 'Users', editingUser.id, { role: prevRole }, { role });
      showToast(`User ${name} role updated to ${role}`);
    } else {
      const newUser: ManagedUser = {
        id: `usr-${Date.now()}`,
        name,
        email,
        role,
        status: 'Active',
      };
      setUsersList((prev) => [...prev, newUser]);
      addAuditLog('USER_CREATED', 'Users', newUser.id, null, newUser);
      showToast(`New user ${name} created successfully`);
    }

    setShowAddModal(false);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">User Management</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Manage user accounts, credentials, and RBAC role assignments.</p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="flex items-center space-x-2 px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-sm font-semibold shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Add New User</span>
        </button>
      </div>

      <div className="bg-white dark:bg-navy-900 rounded-2xl border border-slate-200 dark:border-navy-800 overflow-hidden shadow-xs">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 dark:bg-navy-950/80 border-b border-slate-200 dark:border-navy-800 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              <th className="py-3.5 px-4">User Name</th>
              <th className="py-3.5 px-4">Email Address</th>
              <th className="py-3.5 px-4">Role</th>
              <th className="py-3.5 px-4">Status</th>
              <th className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-navy-800 text-sm">
            {usersList.map((u) => (
              <tr key={u.id} className="hover:bg-slate-50/60 dark:hover:bg-navy-800/40">
                <td className="py-3 px-4 font-bold text-slate-800 dark:text-slate-200">{u.name}</td>
                <td className="py-3 px-4 text-xs text-slate-500">{u.email}</td>
                <td className="py-3 px-4 text-xs font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400">
                  {u.role.replace('_', ' ')}
                </td>
                <td className="py-3 px-4">
                  <span className="px-2.5 py-0.5 rounded text-xs font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400">
                    {u.status}
                  </span>
                </td>
                <td className="py-3 px-4 text-right">
                  <button
                    onClick={() => handleOpenEdit(u)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-brand-600"
                    title="Edit Role"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <form onSubmit={handleSubmit} className="bg-white dark:bg-navy-900 rounded-2xl border border-slate-200 dark:border-navy-800 max-w-md w-full p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-200 dark:border-navy-800 pb-3">
              <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100">
                {editingUser ? 'Edit User Role' : 'Create User Account'}
              </h3>
              <button type="button" onClick={() => setShowAddModal(false)} className="text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-400 block mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full p-2 bg-slate-50 dark:bg-navy-800 border border-slate-200 dark:border-navy-700 rounded-xl"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-400 block mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="john@company.com"
                  className="w-full p-2 bg-slate-50 dark:bg-navy-800 border border-slate-200 dark:border-navy-700 rounded-xl"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-400 block mb-1">Assigned Role</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as UserRole)}
                  className="w-full p-2 bg-slate-50 dark:bg-navy-800 border border-slate-200 dark:border-navy-700 rounded-xl font-bold"
                >
                  <option value="sales_team">Sales Team</option>
                  <option value="manager">Manager</option>
                  <option value="admin">Admin</option>
                  <option value="owner">Owner</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end space-x-2 pt-3">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="px-3 py-2 text-xs font-semibold text-slate-500 hover:bg-slate-100 dark:hover:bg-navy-800 rounded-xl"
              >
                Cancel
              </button>
              <button type="submit" className="px-4 py-2 bg-brand-600 text-white font-bold text-xs rounded-xl">
                {editingUser ? 'Update User' : 'Create User'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
