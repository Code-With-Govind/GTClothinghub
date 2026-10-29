import React, { useEffect, useState } from 'react';
import { Printer, RotateCcw, AlertTriangle, CheckCircle2 } from 'lucide-react';
import AdminSidebar from '../../components/admin/AdminSidebar';
import SEO from '../../components/common/SEO';
import api from '../../services/api';
import { formatPrice, formatDate, getStatusBadgeColor } from '../../utils/formatters';

export default function OrderList() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [reviewOrder, setReviewOrder] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [courier, setCourier] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  
  // Return review form state
  const [adminNotes, setAdminNotes] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [reviewLoading, setReviewLoading] = useState(false);
  const [reviewError, setReviewError] = useState('');

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const url = statusFilter === 'RETURN_REQUESTED'
        ? '/admin/orders?status=RETURN_REQUESTED'
        : statusFilter === 'DELIVERED'
        ? '/admin/orders?status=DELIVERED'
        : '/admin/orders';
      const res = await api.get(url);
      setOrders(res.orders || []);
    } catch (err) {
      console.warn('Failed to load admin orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [statusFilter]);

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

  const handleReturnReview = async (decision) => {
    if (!reviewOrder) return;
    setReviewError('');

    if (decision === 'REJECTED' && (!rejectionReason || rejectionReason.trim().length < 10)) {
      setReviewError('Please provide a detailed rejection reason (minimum 10 characters).');
      return;
    }

    setReviewLoading(true);
    try {
      const res = await api.put(`/admin/orders/${reviewOrder._id}/return-request`, {
        status: decision,
        adminNotes,
        rejectionReason,
      });
      alert(res.message || 'Return request updated');
      setReviewOrder(null);
      setAdminNotes('');
      setRejectionReason('');
      fetchOrders();
    } catch (err) {
      setReviewError(err.message || 'Failed to update return request');
    } finally {
      setReviewLoading(false);
    }
  };

  const filteredOrders = statusFilter === 'LEGACY_RETURNS'
    ? orders.filter((o) => o.returnRequest?.isLegacyReview && o.returnRequest?.status === 'PENDING')
    : orders;

  return (
    <div className="flex min-h-screen bg-[#F7F5F0]">
      <SEO title="Order Management" />
      <AdminSidebar />

      <main className="flex-1 p-8 space-y-8 overflow-y-auto">
        <div className="border-b border-neutral-200 pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold text-[#C8A96B] tracking-widest uppercase font-mono">Fulfillment Operations</span>
            <h1 className="text-3xl font-black text-[#171717] uppercase font-display tracking-tight">Order Management</h1>
          </div>

          {/* Quick Filter Tabs */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setStatusFilter('ALL')}
              className={`px-3 py-1.5 text-xs font-bold uppercase rounded-lg transition-colors font-mono ${
                statusFilter === 'ALL' ? 'bg-[#111111] text-white' : 'bg-white border border-[#E5E2DC] text-[#666666] hover:text-[#111111]'
              }`}
            >
              All Orders
            </button>
            <button
              onClick={() => setStatusFilter('RETURN_REQUESTED')}
              className={`px-3 py-1.5 text-xs font-bold uppercase rounded-lg transition-colors font-mono flex items-center gap-1.5 ${
                statusFilter === 'RETURN_REQUESTED' ? 'bg-[#111111] text-white' : 'bg-white border border-[#E5E2DC] text-[#666666] hover:text-[#111111]'
              }`}
            >
              <RotateCcw className="w-3.5 h-3.5 text-amber-600" /> Return Requests
            </button>
            <button
              onClick={() => setStatusFilter('LEGACY_RETURNS')}
              className={`px-3 py-1.5 text-xs font-bold uppercase rounded-lg transition-colors font-mono ${
                statusFilter === 'LEGACY_RETURNS' ? 'bg-[#111111] text-white' : 'bg-white border border-[#E5E2DC] text-[#666666] hover:text-[#111111]'
              }`}
            >
              Legacy Reviews
            </button>
            <button
              onClick={() => setStatusFilter('DELIVERED')}
              className={`px-3 py-1.5 text-xs font-bold uppercase rounded-lg transition-colors font-mono ${
                statusFilter === 'DELIVERED' ? 'bg-[#111111] text-white' : 'bg-white border border-[#E5E2DC] text-[#666666] hover:text-[#111111]'
              }`}
            >
              Delivered
            </button>
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
                  {filteredOrders.map((ord) => (
                    <tr key={ord._id} className="hover:bg-neutral-50 transition-colors">
                      <td className="p-3 font-bold text-[#171717]">
                        <div>{ord.orderNumber}</div>
                        {ord.returnRequest?.isLegacyReview && ord.returnRequest?.status === 'PENDING' && (
                          <span className="inline-block mt-1 px-2 py-0.5 text-[9px] font-bold text-amber-900 bg-amber-100 rounded border border-amber-300">
                            LEGACY REVIEW
                          </span>
                        )}
                      </td>
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
                        {ord.returnRequest?.status && ord.returnRequest.status !== 'NONE' && (
                          <div className="text-[10px] text-neutral-500 font-sans mt-0.5">
                            Return: <strong className="text-[#111111]">{ord.returnRequest.status}</strong>
                          </div>
                        )}
                      </td>
                      <td className="p-3">
                        {ord.podOrderId ? (
                          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">Pushed ({ord.podOrderId})</span>
                        ) : (
                          <span className="text-[10px] text-neutral-400">Not Submitted</span>
                        )}
                      </td>
                      <td className="p-3 text-right space-x-2">
                        {ord.returnRequest?.status === 'PENDING' && (
                          <button
                            onClick={() => {
                              setReviewOrder(ord);
                              setAdminNotes(ord.returnRequest?.adminNotes || '');
                              setRejectionReason(ord.returnRequest?.rejectionReason || '');
                              setReviewError('');
                            }}
                            className="px-2.5 py-1 bg-amber-500 hover:bg-amber-600 text-white text-[10px] font-bold uppercase rounded-lg transition-all"
                          >
                            <RotateCcw className="w-3 h-3 inline mr-1" /> Review Return
                          </button>
                        )}
                        {!ord.podOrderId && ord.orderStatus !== 'CANCELLED' && (
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
                <label className="block text-xs font-bold text-neutral-700 uppercase mb-1 font-mono">Order Status</label>
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
                  <option value="RETURN_REQUESTED">RETURN_REQUESTED</option>
                  <option value="RETURNED">RETURNED</option>
                  <option value="REFUND_PENDING">REFUND_PENDING</option>
                  <option value="REFUNDED">REFUNDED</option>
                  <option value="RTO">RTO</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 uppercase mb-1 font-mono">Courier Carrier</label>
                <input
                  type="text"
                  value={courier}
                  onChange={(e) => setCourier(e.target.value)}
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-xl p-3 text-xs text-[#171717] focus:outline-none focus:border-[#111111]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 uppercase mb-1 font-mono">Tracking Number</label>
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

        {/* Review Return Request Modal */}
        {reviewOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
            <div className="bg-white rounded-2xl p-6 max-w-lg w-full border border-neutral-200 shadow-xl space-y-4 my-8">
              <div className="border-b pb-3">
                <h3 className="font-bold text-[#171717] text-base uppercase font-display">
                  Review Return Request #{reviewOrder.orderNumber}
                </h3>
                <p className="text-xs text-neutral-500 font-mono mt-0.5">
                  Requested on {formatDate(reviewOrder.returnRequest?.requestedAt)}
                </p>
              </div>

              {reviewError && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0 text-red-600" />
                  <span>{reviewError}</span>
                </div>
              )}

              {/* Legacy Order Warning */}
              {reviewOrder.returnRequest?.isLegacyReview && (
                <div className="p-3.5 bg-amber-50 border border-amber-300 rounded-xl text-amber-900 text-xs space-y-1">
                  <div className="flex items-center gap-2 font-bold font-mono uppercase text-[11px]">
                    <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0" />
                    <span>Legacy Order Notice</span>
                  </div>
                  <p className="text-[11px] leading-relaxed">
                    Automated delivery tracking was not recorded for this order. You MUST manually verify courier delivery records to confirm receipt occurred within the 7-day policy window before approving.
                  </p>
                </div>
              )}

              {/* Request Details */}
              <div className="p-3.5 bg-neutral-50 rounded-xl border border-neutral-200 space-y-1.5 text-xs">
                <p>
                  <span className="font-bold text-[#171717]">Customer:</span> {reviewOrder.shippingAddress?.fullName} ({reviewOrder.shippingAddress?.phone || reviewOrder.shippingAddress?.email})
                </p>
                <p>
                  <span className="font-bold text-[#171717]">Reason:</span> {reviewOrder.returnRequest?.reason}
                </p>
                {reviewOrder.returnRequest?.details && (
                  <p>
                    <span className="font-bold text-[#171717]">Customer Details:</span> {reviewOrder.returnRequest.details}
                  </p>
                )}
                {reviewOrder.returnRequest?.items && reviewOrder.returnRequest.items.length > 0 && (
                  <div className="pt-1">
                    <span className="font-bold text-[#171717]">Requested Items:</span>
                    <ul className="list-disc list-inside mt-1 text-[11px] space-y-0.5">
                      {reviewOrder.returnRequest.items.map((it, idx) => (
                        <li key={idx}>
                          {it.name} ({it.size || 'N/A'}, {it.color || 'N/A'}) — Qty: {it.quantity}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Admin Return Instructions */}
              <div>
                <label className="block text-xs font-bold text-neutral-700 uppercase mb-1 font-mono">
                  Return Instructions for Customer (Optional if Approving)
                </label>
                <textarea
                  rows={2}
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="Enter specific instructions or studio return address for the customer..."
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-xl p-3 text-xs text-[#171717] focus:outline-none focus:border-[#111111]"
                />
              </div>

              {/* Rejection Reason */}
              <div>
                <label className="block text-xs font-bold text-neutral-700 uppercase mb-1 font-mono">
                  Rejection Reason (Required if Declining)
                </label>
                <textarea
                  rows={2}
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="Reason for declining the return request (minimum 10 characters)..."
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-xl p-3 text-xs text-[#171717] focus:outline-none focus:border-[#111111]"
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setReviewOrder(null)}
                  disabled={reviewLoading}
                  className="w-full py-2.5 bg-neutral-100 text-[#171717] text-xs font-bold uppercase rounded-xl hover:bg-neutral-200 transition-colors"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={() => handleReturnReview('REJECTED')}
                  disabled={reviewLoading}
                  className="w-full py-2.5 bg-rose-600 text-white text-xs font-bold uppercase rounded-xl hover:bg-rose-700 transition-colors disabled:opacity-50"
                >
                  Decline Request
                </button>
                <button
                  type="button"
                  onClick={() => handleReturnReview('APPROVED')}
                  disabled={reviewLoading}
                  className="w-full py-2.5 bg-emerald-600 text-white text-xs font-bold uppercase rounded-xl hover:bg-emerald-700 transition-colors disabled:opacity-50"
                >
                  Approve Request
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

