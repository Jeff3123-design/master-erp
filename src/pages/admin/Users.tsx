import React from 'react';

export const UsersPage: React.FC = () => {
  const usersList = [
    { id: 'usr-1', name: 'Alex Morgan', email: 'admin@nexuserp.io', role: 'owner', status: 'Active' },
    { id: 'usr-2', name: 'Jordan Hayes', email: 'jordan@nexuserp.io', role: 'admin', status: 'Active' },
    { id: 'usr-3', name: 'Taylor Vance', email: 'sales@nexuserp.io', role: 'sales_team', status: 'Active' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">User Management</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">Manage user accounts, credentials, and RBAC role assignments.</p>
      </div>

      <div className="bg-white dark:bg-navy-900 rounded-2xl border border-slate-200 dark:border-navy-800 overflow-hidden shadow-xs">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 dark:bg-navy-950/80 border-b border-slate-200 dark:border-navy-800 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              <th className="py-3.5 px-4">User Name</th>
              <th className="py-3.5 px-4">Email Address</th>
              <th className="py-3.5 px-4">Role</th>
              <th className="py-3.5 px-4">Status</th>
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
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
