import React, { useEffect, useState } from 'react';
import { Printer } from 'lucide-react';
import AdminSidebar from '../../components/admin/AdminSidebar';
import SEO from '../../components/common/SEO';
import api from '../../services/api';
import { formatPrice, formatDate, getStatusBadgeColor } from '../../utils/formatters';

export default function OrderList() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [courier, setCourier] = useState('');

  const fetchOrders = async () => {
    try {
      const res = await api.get('/admin/orders');
      setOrders(res.orders || []);
    } catch (err) {
      console.warn('Failed to load admin orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handlePushToPOD = async (orderId) => {
    try {
      const res = await api.post(`/pod/orders/${orderId}/submit`);
      alert(res.message);
      fetchOrders();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleUpdateStatus = async (e) => {
    e.preventDefault();
    if (!selectedOrder) return;
    try {
      await api.put(`/admin/orders/${selectedOrder._id}/status`, {
        orderStatus: newStatus,
        trackingNumber,
        courier,
      });
      alert('Order status updated');
      setSelectedOrder(null);
      fetchOrders();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#F7F5F0]">
      <SEO title="Order Management" />
      <AdminSidebar />

      <main className="flex-1 p-8 space-y-8 overflow-y-auto">
        <div className="border-b border-neutral-200 pb-6 flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-[#C8A96B] tracking-widest uppercase font-mono">Fulfillment Operations</span>
            <h1 className="text-3xl font-black text-[#171717] uppercase font-display tracking-tight">Order Management</h1>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-neutral-200/80 shadow-sm">
          {loading ? (
            <div className="h-64 animate-pulse bg-neutral-100 rounded-xl" />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-neutral-600">
                <thead>
                  <tr className="border-b border-neutral-200 text-neutral-500 font-bold uppercase tracking-wider">
                    <th className="p-3">Order Number</th>
                    <th className="p-3">Customer</th>
                    <th className="p-3">Total</th>
                    <th className="p-3">Payment</th>
                    <th className="p-3">Order Status</th>
                    <th className="p-3">POD Status</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 font-mono">
                  {orders.map((ord) => (
                    <tr key={ord._id} className="hover:bg-neutral-50 transition-colors">
                      <td className="p-3 font-bold text-[#171717]">{ord.orderNumber}</td>
                      <td className="p-3 font-sans">
                        <div className="font-bold text-[#171717]">{ord.shippingAddress?.fullName || 'N/A'}</div>
                        <div className="text-[10px] text-neutral-400">{ord.shippingAddress?.phone}</div>
                      </td>
                      <td className="p-3 font-bold text-[#111111]">{formatPrice(ord.total)}</td>
                      <td className="p-3">
                        <span className="text-[10px] font-bold text-neutral-700 bg-neutral-100 px-2 py-0.5 rounded">
                          {ord.paymentStatus} ({ord.paymentMethod})
                        </span>
                      </td>
                      <td className="p-3">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${getStatusBadgeColor(ord.orderStatus)}`}>
                          {ord.orderStatus}
                        </span>
                      </td>
                      <td className="p-3">
                        {ord.podOrderId ? (
                          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">Pushed ({ord.podOrderId})</span>
                        ) : (
                          <span className="text-[10px] text-neutral-400">Not Submitted</span>
                        )}
                      </td>
                      <td className="p-3 text-right space-x-2">
                        {!ord.podOrderId && (
                          <button
                            onClick={() => handlePushToPOD(ord._id)}
                            className="px-3 py-1 bg-[#111111] hover:bg-neutral-800 text-white text-[10px] font-bold uppercase rounded-lg transition-all"
                          >
                            <Printer className="w-3 h-3 inline mr-1" /> Push POD
                          </button>
                        )}
                        <button
                          onClick={() => {
                            setSelectedOrder(ord);
                            setNewStatus(ord.orderStatus);
                            setTrackingNumber(ord.trackingNumber || '');
                            setCourier(ord.courier || 'Delhivery');
                          }}
                          className="px-3 py-1 bg-neutral-100 hover:bg-neutral-200 text-[#171717] text-[10px] font-bold uppercase rounded-lg transition-all"
                        >
                          Update
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Update Status Modal */}
        {selectedOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <form onSubmit={handleUpdateStatus} className="bg-white rounded-2xl p-6 max-w-md w-full border border-neutral-200 shadow-xl space-y-4">
              <h3 className="font-bold text-[#171717] text-base uppercase font-display">Update Order #{selectedOrder.orderNumber}</h3>
              <div>
                <label className="block text-xs font-bold text-neutral-700 uppercase mb-1">Order Status</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-xl p-3 text-xs text-[#171717] focus:outline-none focus:border-[#111111]"
                >
                  <option value="PENDING_PAYMENT">PENDING_PAYMENT</option>
                  <option value="PAID">PAID</option>
                  <option value="PROCESSING">PROCESSING</option>
                  <option value="FULFILLMENT_PENDING">FULFILLMENT_PENDING</option>
                  <option value="SHIPPED">SHIPPED</option>
                  <option value="OUT_FOR_DELIVERY">OUT_FOR_DELIVERY</option>
                  <option value="DELIVERED">DELIVERED</option>
                  <option value="CANCELLED">CANCELLED</option>
                  <option value="RTO">RTO</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 uppercase mb-1">Courier Carrier</label>
                <input
                  type="text"
                  value={courier}
                  onChange={(e) => setCourier(e.target.value)}
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-xl p-3 text-xs text-[#171717] focus:outline-none focus:border-[#111111]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 uppercase mb-1">Tracking Number</label>
                <input
                  type="text"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-xl p-3 text-xs text-[#171717] focus:outline-none focus:border-[#111111]"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setSelectedOrder(null)} className="w-full py-2.5 bg-neutral-100 text-[#171717] text-xs font-bold uppercase rounded-xl hover:bg-neutral-200">Cancel</button>
                <button type="submit" className="w-full py-2.5 bg-[#111111] text-white text-xs font-bold uppercase rounded-xl hover:bg-neutral-800">Save Changes</button>
              </div>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}

