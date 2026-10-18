import React, { useEffect, useState } from 'react';
import { Wifi, RefreshCw, CheckCircle2, AlertTriangle } from 'lucide-react';
import AdminSidebar from '../../components/admin/AdminSidebar';
import SEO from '../../components/common/SEO';
import api from '../../services/api';

export default function PODList() {
  const [podOrders, setPodOrders] = useState([]);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState(null);

  useEffect(() => {
    api.get('/pod/orders').then((res) => setPodOrders(res.podOrders || []));
  }, []);

  const handleTestConnection = async () => {
    setTesting(true);
    setTestResult(null);
    try {
      const res = await api.post('/pod/test-connection');
      setTestResult(res);
    } catch (err) {
      setTestResult({
        success: false,
        message: err.message || 'Connection test failed',
      });
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#F7F5F0]">
      <SEO title="POD Fulfillment Queue" />
      <AdminSidebar />
      <main className="flex-1 p-8 space-y-8 overflow-y-auto">
        <div className="border-b border-neutral-200 pb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <span className="text-xs font-bold text-[#C8A96B] tracking-widest uppercase font-mono">Qikink POD Integration</span>
            <h1 className="text-3xl font-black text-[#171717] uppercase font-display tracking-tight">POD Provider Orders</h1>
          </div>
          <button
            onClick={handleTestConnection}
            disabled={testing}
            type="button"
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#111111] hover:bg-neutral-800 disabled:opacity-50 text-white text-xs font-bold uppercase rounded-xl transition-all shadow-sm shrink-0"
          >
            {testing ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Wifi className="w-3.5 h-3.5" />
            )}
            {testing ? 'Testing Sandbox...' : 'Test Qikink Connection'}
          </button>
        </div>

        {testResult && (
          <div
            className={`p-4 rounded-xl border flex items-start gap-3 transition-all ${
              testResult.success
                ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                : 'bg-rose-50 border-rose-200 text-rose-800'
            }`}
          >
            {testResult.success ? (
              <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-emerald-600 mt-0.5" />
            ) : (
              <AlertTriangle className="w-5 h-5 flex-shrink-0 text-rose-600 mt-0.5" />
            )}
            <div className="text-xs space-y-1">
              <p className="font-bold">
                {testResult.success ? 'Qikink Sandbox Connected' : 'Qikink Connection Failed'}
              </p>
              <p className="font-mono text-[11px] opacity-90">{testResult.message}</p>
              {testResult.apiUrl && (
                <p className="text-[10px] opacity-75">Target URL: {testResult.apiUrl} | Mode: {testResult.mode}</p>
              )}
            </div>
          </div>
        )}

        <div className="bg-white rounded-2xl p-6 border border-neutral-200/80 shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-neutral-600">
              <thead>
                <tr className="border-b border-neutral-200 font-bold uppercase tracking-wider text-neutral-500">
                  <th className="p-3">POD Order ID</th>
                  <th className="p-3">Internal Order</th>
                  <th className="p-3">Provider</th>
                  <th className="p-3">POD Status</th>
                  <th className="p-3">Tracking</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 font-mono">
                {podOrders.map((pod) => (
                  <tr key={pod._id} className="hover:bg-neutral-50 transition-colors">
                    <td className="p-3 font-bold text-[#171717]">{pod.podOrderId}</td>
                    <td className="p-3 text-[#111111] font-bold">{pod.order?.orderNumber}</td>
                    <td className="p-3 font-sans"><span className="px-2 py-0.5 bg-neutral-100 text-[#171717] rounded text-[10px] font-bold">{pod.podProvider}</span></td>
                    <td className="p-3 font-bold text-emerald-700">{pod.podStatus}</td>
                    <td className="p-3 text-neutral-500">{pod.trackingNumber || 'Pending'}</td>
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

