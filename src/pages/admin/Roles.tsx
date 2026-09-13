import React from 'react';

export const RolesPage: React.FC = () => {
  const roles = [
    { name: 'Owner', desc: 'Full system ownership, financial compliance, and audit log access.', users: 1 },
    { name: 'Admin', desc: 'System configuration, user management, and module assignment control.', users: 2 },
    { name: 'Manager', desc: 'Inventory control, purchasing approval, and financial oversight.', users: 3 },
    { name: 'Sales Team', desc: 'POS cashier terminal, customer service, and sales execution.', users: 8 },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Role-Based Access Control (RBAC)</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">Security privilege levels and organizational roles.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {roles.map((r) => (
          <div key={r.name} className="bg-white dark:bg-navy-900 p-5 rounded-2xl border border-slate-200 dark:border-navy-800 space-y-2">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base">{r.name}</h3>
              <span className="text-xs bg-slate-100 dark:bg-navy-800 px-2 py-0.5 rounded font-bold text-slate-600 dark:text-slate-300">
                {r.users} users
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">{r.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
