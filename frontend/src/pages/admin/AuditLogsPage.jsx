import React, { useEffect, useState } from 'react';
import AdminSidebar from '../../components/admin/AdminSidebar';
import SEO from '../../components/common/SEO';
import api from '../../services/api';
import { formatDate } from '../../utils/formatters';

export default function AuditLogsPage() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    api.get('/admin/audit-logs').then((res) => setLogs(res.logs || []));
  }, []);

  return (
    <div className="flex min-h-screen bg-[#F7F5F0]">
      <SEO title="Admin Audit Logs" />
      <AdminSidebar />
      <main className="flex-1 p-8 space-y-8 overflow-y-auto">
        <div className="border-b border-neutral-200 pb-6">
          <span className="text-xs font-bold text-[#C8A96B] tracking-widest uppercase font-mono">Security & Operations</span>
          <h1 className="text-3xl font-black text-[#171717] uppercase font-display tracking-tight">Admin Security Audit Logs</h1>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-neutral-200/80 shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-neutral-600">
              <thead>
                <tr className="border-b border-neutral-200 font-bold uppercase tracking-wider text-neutral-500">
                  <th className="p-3">Timestamp</th>
                  <th className="p-3">Admin Email</th>
                  <th className="p-3">Action</th>
                  <th className="p-3">Entity</th>
                  <th className="p-3">Entity ID</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 font-mono">
                {logs.map((log) => (
                  <tr key={log._id} className="hover:bg-neutral-50 transition-colors">
                    <td className="p-3 text-neutral-500">{formatDate(log.createdAt)}</td>
                    <td className="p-3 font-bold text-[#171717]">{log.adminEmail}</td>
                    <td className="p-3 text-[#111111] font-bold"><span className="px-2 py-0.5 bg-neutral-100 text-[#171717] rounded text-[10px]">{log.action}</span></td>
                    <td className="p-3 font-sans text-neutral-600">{log.entity}</td>
                    <td className="p-3 text-neutral-400">{log.entityId}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}

