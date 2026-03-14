import React from 'react';

const AdminLogs = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">System Audit Logs</h2>
          <p className="text-slate-500 text-sm mt-1">Track all platform activities, logins, and data modifications.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-8 border border-slate-100 shadow-sm text-center">
        <div className="max-w-md mx-auto py-12">
          <svg className="w-16 h-16 text-slate-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 className="text-xl font-bold text-slate-800 mb-2">Audit Logging Inactive</h3>
          <p className="text-slate-500 text-sm leading-relaxed mb-6">
            The advanced system audit logging module is currently pending backend integration. Once activated, this page will display real-time tracking of staff and parent activity across the Syndicate.
          </p>
          <button disabled className="px-6 py-2.5 bg-slate-100 text-slate-400 font-bold rounded-xl text-sm transition-colors cursor-not-allowed">
            Export Logs (Unavailable)
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminLogs;
