import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Package,
  Truck,
  CreditCard,
  MapPin,
  AlertTriangle,
  RotateCcw,
  ExternalLink,
  Printer,
  Clock,
  CheckCircle2,
} from 'lucide-react';
import SEO from '../../components/common/SEO';
import UserLayout from '../../components/user/UserLayout';
import api from '../../services/api';
import { formatDate, formatPrice, getStatusBadgeColor } from '../../utils/formatters';

export default function OrderDetail() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [returnReason, setReturnReason] = useState('');
  const [returnDetails, setReturnDetails] = useState('');
  const [selectedItems, setSelectedItems] = useState({});
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [returnSuccess, setReturnSuccess] = useState('');
  const [returnError, setReturnError] = useState('');
  const [submittingReturn, setSubmittingReturn] = useState(false);

  const fetchOrder = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get(`/orders/${id}`);
      if (res.order) {
        setOrder(res.order);
        // Initialize selected items for return modal
        const initialSelections = {};
        (res.order.items || []).forEach((item) => {
          initialSelections[item._id] = { selected: true, quantity: item.quantity };
        });
        setSelectedItems(initialSelections);
      } else {
        setError('Order not found');
      }
    } catch (err) {
      setError(err.message || 'Failed to load order details');
      setOrder(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const toggleItemSelection = (itemId) => {
    setSelectedItems((prev) => ({
      ...prev,
      [itemId]: {
        ...prev[itemId],
        selected: !prev[itemId]?.selected,
      },
    }));
  };

  const updateItemQuantity = (itemId, qty, maxQty) => {
    const validQty = Math.max(1, Math.min(Number(qty) || 1, maxQty));
    setSelectedItems((prev) => ({
      ...prev,
      [itemId]: {
        ...prev[itemId],
        quantity: validQty,
      },
    }));
  };

  const handleReturnSubmit = async (e) => {
    e.preventDefault();
    setReturnError('');
    setReturnSuccess('');

    // Filter items chosen by customer
    const itemsToReturn = (order.items || [])
      .filter((item) => selectedItems[item._id]?.selected)
      .map((item) => ({
        orderItemId: item._id,
        quantity: selectedItems[item._id]?.quantity || 1,
      }));

    if (itemsToReturn.length === 0) {
      setReturnError('Please select at least one item from your order to return.');
      return;
    }

    setSubmittingReturn(true);
    try {
      const res = await api.post(`/orders/${id}/return`, {
        reason: returnReason,
        details: returnDetails,
        items: itemsToReturn,
      });
      setReturnSuccess(res.message || 'Return request submitted successfully.');
      setShowReturnModal(false);
      fetchOrder();
    } catch (err) {
      setReturnError(err.message || 'Failed to submit return request');
    } finally {
      setSubmittingReturn(false);
    }
  };

  const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;
  const isDelivered = order?.orderStatus === 'DELIVERED';
  const hasDeliveredAt = Boolean(order?.deliveredAt);
  const isExpired = hasDeliveredAt && (Date.now() - new Date(order.deliveredAt).getTime() > SEVEN_DAYS_MS);
  const hasReturnRequest = order?.returnRequest && order.returnRequest.status !== 'NONE';
  const isEligibleToRequest = isDelivered && !isExpired && !hasReturnRequest;

  return (
    <UserLayout>
      <SEO title={order ? `Order #${order.orderNumber} | GT Clothing Hub` : 'Order Details | GT Clothing Hub'} />

      <div className="space-y-6">
        {/* Navigation Bar */}
        <div className="flex items-center justify-between">
          <Link
            to="/account/orders"
            className="inline-flex items-center gap-2 text-xs font-bold text-[#666666] hover:text-[#111111] transition-colors uppercase tracking-wider font-mono"
          >
            <ArrowLeft className="w-4 h-4" /> Back to My Orders
          </Link>
          {order && (
            <button
              onClick={() => window.print()}
              type="button"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#666666] hover:text-[#111111] transition-colors uppercase tracking-wider font-mono print:hidden"
            >
              <Printer className="w-3.5 h-3.5" /> Print / Save
            </button>
          )}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="space-y-4">
            <div className="h-28 bg-white rounded-xl animate-pulse border border-[#E5E2DC]" />
            <div className="h-64 bg-white rounded-xl animate-pulse border border-[#E5E2DC]" />
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div className="bg-white rounded-xl p-8 sm:p-12 border border-rose-200 text-center space-y-4 shadow-xs">
            <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center mx-auto border border-rose-100">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-extrabold text-[#111111] uppercase tracking-wide font-display">
                {error}
              </h3>
              <p className="text-xs text-[#666666] max-w-md mx-auto">
                Unable to display this order. It may belong to another account or the reference ID is invalid.
              </p>
            </div>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={fetchOrder}
                className="px-5 py-2.5 bg-[#111111] text-white text-xs font-bold uppercase tracking-wider rounded-lg hover:bg-[#222222] transition-all"
              >
                Try Again
              </button>
              <Link
                to="/account/orders"
                className="px-5 py-2.5 bg-[#F7F5F0] text-[#111111] border border-[#E5E2DC] text-xs font-bold uppercase tracking-wider rounded-lg hover:bg-neutral-200 transition-all"
              >
                Back to Orders
              </Link>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && !order && (
          <div className="bg-white rounded-xl p-10 border border-[#E5E2DC] text-center space-y-3 shadow-xs">
            <Package className="w-10 h-10 text-neutral-400 mx-auto" />
            <h3 className="text-sm font-bold text-[#111111] uppercase">Order not found</h3>
            <Link
              to="/account/orders"
              className="inline-block px-4 py-2 bg-[#111111] text-white text-xs font-bold uppercase rounded-lg"
            >
              Back to My Orders
            </Link>
          </div>
        )}

        {/* Successful Order Details */}
        {!loading && !error && order && (
          <>
            {/* Header Card */}
            <div className="bg-white p-6 sm:p-8 rounded-xl border border-[#E5E2DC] shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#E5E2DC] pb-5">
                <div>
                  <span className="text-[11px] font-mono font-bold text-[#6F7358] tracking-widest uppercase block">
                    ORDER SUMMARY
                  </span>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111111] uppercase font-display tracking-tight mt-1">
                    {order.orderNumber}
                  </h1>
                  <p className="text-xs text-[#666666] mt-1 font-mono">
                    Placed on {formatDate(order.createdAt)}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2.5">
                  {/* Order Status Badge */}
                  <span
                    className={`px-3 py-1 text-xs font-bold rounded-md uppercase font-mono border ${getStatusBadgeColor(
                      order.orderStatus
                    )}`}
                  >
                    {order.orderStatus}
                  </span>

                  {/* Return Request Controls */}
                  {isEligibleToRequest && (
                    <button
                      onClick={() => setShowReturnModal(true)}
                      type="button"
                      className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-800 border border-amber-200 text-xs font-bold uppercase rounded-md hover:bg-amber-100 transition-colors"
                    >
                      <RotateCcw className="w-3.5 h-3.5" /> Request Return
                    </button>
                  )}

                  {isDelivered && isExpired && !hasReturnRequest && (
                    <span className="text-[10px] font-mono font-bold text-neutral-500 bg-neutral-100 border border-neutral-200 px-2 py-1 rounded">
                      Return Window Expired (7 Days)
                    </span>
                  )}
                </div>
              </div>

              {/* Status Info Chips */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                {/* Payment Status */}
                <div className="p-3 bg-[#F7F5F0] rounded-lg border border-[#E5E2DC] space-y-1">
                  <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#666666] uppercase font-mono">
                    <CreditCard className="w-3.5 h-3.5" /> Payment
                  </div>
                  <p className="text-xs font-bold text-[#111111]">
                    {order.paymentMethod} •{' '}
                    <span
                      className={
                        order.paymentStatus === 'PAID'
                          ? 'text-emerald-700'
                          : order.paymentStatus === 'FAILED'
                          ? 'text-rose-700'
                          : 'text-amber-700'
                      }
                    >
                      {order.paymentStatus}
                    </span>
                  </p>
                </div>

                {/* Fulfillment / POD Status */}
                <div className="p-3 bg-[#F7F5F0] rounded-lg border border-[#E5E2DC] space-y-1">
                  <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#666666] uppercase font-mono">
                    <Clock className="w-3.5 h-3.5" /> Fulfillment
                  </div>
                  <p className="text-xs font-bold text-[#111111]">
                    {order.podStatus && order.podStatus !== 'NOT_SUBMITTED'
                      ? order.podStatus
                      : 'Processing in Studio'}
                  </p>
                </div>

                {/* Delivery Docket / Courier */}
                <div className="p-3 bg-[#F7F5F0] rounded-lg border border-[#E5E2DC] space-y-1">
                  <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#666666] uppercase font-mono">
                    <Truck className="w-3.5 h-3.5" /> Courier & AWB
                  </div>
                  <p className="text-xs font-bold text-[#111111] truncate">
                    {order.trackingNumber ? (
                      <Link
                        to={`/order-tracking?orderNumber=${order.orderNumber}`}
                        className="text-[#111111] hover:underline inline-flex items-center gap-1"
                      >
                        {order.courier || 'Qikink'}: {order.trackingNumber}
                        <ExternalLink className="w-3 h-3 shrink-0" />
                      </Link>
                    ) : (
                      'Assigned upon dispatch'
                    )}
                  </p>
                </div>
              </div>
            </div>

            {returnSuccess && (
              <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> {returnSuccess}
              </div>
            )}

            {/* Comprehensive Return Request Status Card */}
            {hasReturnRequest && (
              <div
                className={`p-5 rounded-xl border space-y-3.5 ${
                  order.returnRequest.status === 'APPROVED'
                    ? 'bg-emerald-50/70 border-emerald-200'
                    : order.returnRequest.status === 'REJECTED'
                    ? 'bg-rose-50/70 border-rose-200'
                    : 'bg-amber-50/70 border-amber-200'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b pb-3 border-current/10">
                  <div className="flex items-center gap-2">
                    <RotateCcw className="w-4 h-4 shrink-0 text-[#111111]" />
                    <span className="font-bold text-xs uppercase font-mono tracking-wider text-[#111111]">
                      Return Status: {order.returnRequest.status === 'PENDING' ? 'Under Review' : order.returnRequest.status}
                    </span>
                  </div>
                  <span className="text-[11px] font-mono text-[#666666]">
                    Requested on {formatDate(order.returnRequest.requestedAt)}
                  </span>
                </div>

                {/* Return Request Details */}
                <div className="space-y-1.5 text-xs text-[#444444]">
                  <p>
                    <span className="font-bold text-[#111111]">Reason:</span> {order.returnRequest.reason}
                  </p>
                  {order.returnRequest.details && (
                    <p>
                      <span className="font-bold text-[#111111]">Customer Notes:</span> {order.returnRequest.details}
                    </p>
                  )}
                  {order.returnRequest.items && order.returnRequest.items.length > 0 && (
                    <div className="pt-1">
                      <span className="font-bold text-[#111111]">Items in Return:</span>
                      <ul className="list-disc list-inside mt-1 text-[11px] space-y-0.5">
                        {order.returnRequest.items.map((it, idx) => (
                          <li key={idx}>
                            {it.name} ({it.size || 'N/A'}, {it.color || 'N/A'}) x {it.quantity}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Legacy Manual Review Notice */}
                {order.returnRequest.isLegacyReview && order.returnRequest.status === 'PENDING' && (
                  <div className="p-3 bg-white/80 rounded-lg border border-amber-200 text-amber-900 text-xs">
                    <strong>Notice:</strong> This order was fulfilled before automated delivery date tracking was enabled. Our studio team is manually verifying the delivery date with courier records.
                  </div>
                )}

                {/* Approved State Notice & Support Instructions */}
                {order.returnRequest.status === 'APPROVED' && (
                  <div className="p-3.5 bg-white rounded-lg border border-emerald-200 space-y-2 text-xs">
                    <p className="font-bold text-emerald-900 uppercase font-mono">
                      Return Request Approved
                    </p>
                    <p className="text-[#444444] leading-relaxed">
                      Our customer support team provides return instructions directly to you. Please contact customer support at{' '}
                      <span className="font-bold text-[#111111]">support@gtclothinghub.com</span> or via{' '}
                      <span className="font-bold text-[#111111]">WhatsApp</span> referencing Order #{order.orderNumber} to receive return instructions.
                    </p>
                    {order.returnRequest.adminNotes && (
                      <div className="p-2.5 bg-emerald-50/50 rounded border border-emerald-100 text-[11px] text-emerald-900">
                        <span className="font-bold block">Studio Support Instructions:</span>
                        {order.returnRequest.adminNotes}
                      </div>
                    )}
                  </div>
                )}

                {/* Rejected State Notice */}
                {order.returnRequest.status === 'REJECTED' && (
                  <div className="p-3.5 bg-white rounded-lg border border-rose-200 space-y-2 text-xs">
                    <p className="font-bold text-rose-900 uppercase font-mono">
                      Return Request Not Approved
                    </p>
                    {order.returnRequest.rejectionReason && (
                      <p className="text-rose-800 text-[11px]">
                        <span className="font-bold">Reason for Decision:</span> {order.returnRequest.rejectionReason}
                      </p>
                    )}
                    <p className="text-[#666666] text-[11px]">
                      If you have questions regarding this decision, please contact support at support@gtclothinghub.com.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Items in Package */}
            <div className="bg-white rounded-xl p-6 sm:p-8 border border-[#E5E2DC] shadow-xs space-y-4">
              <div className="border-b border-[#E5E2DC] pb-3">
                <h3 className="font-extrabold text-sm text-[#111111] uppercase font-display tracking-wide">
                  Items in Package ({order.items?.length || 0})
                </h3>
              </div>

              <div className="divide-y divide-[#E5E2DC]">
                {(order.items || []).map((item, idx) => (
                  <div key={idx} className="py-4 first:pt-0 last:pb-0 flex items-center justify-between gap-4 text-xs">
                    <div className="flex items-center gap-4 min-w-0">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-20 object-cover rounded-lg bg-[#F7F5F0] border border-[#E5E2DC] shrink-0"
                        />
                      ) : (
                        <div className="w-16 h-20 bg-[#F7F5F0] border border-[#E5E2DC] rounded-lg flex items-center justify-center shrink-0 text-[#666666]">
                          <Package className="w-6 h-6" />
                        </div>
                      )}
                      <div className="space-y-1 min-w-0">
                        <h4 className="font-bold text-sm text-[#111111] truncate">{item.name}</h4>
                        <p className="text-xs text-[#666666]">
                          {item.color ? `Color: ${item.color} • ` : ''}
                          {item.size ? `Size: ${item.size} • ` : ''}
                          Qty: {item.quantity}
                        </p>
                        {item.sku && (
                          <p className="text-[11px] font-mono text-[#888888]">SKU: {item.sku}</p>
                        )}
                        <p className="text-xs text-[#666666] font-mono sm:hidden">
                          {formatPrice(item.price)} each
                        </p>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="font-extrabold text-sm text-[#111111] font-mono block">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                      <span className="text-[11px] text-[#666666] font-mono hidden sm:block">
                        ({formatPrice(item.price)} x {item.quantity})
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Grid: Delivery Address & Price Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Shipping Address Card */}
              <div className="bg-white rounded-xl p-6 border border-[#E5E2DC] shadow-xs space-y-3">
                <div className="flex items-center gap-2 border-b border-[#E5E2DC] pb-3">
                  <MapPin className="w-4 h-4 text-[#6F7358]" />
                  <h3 className="font-extrabold text-xs text-[#111111] uppercase font-display tracking-wider">
                    Shipping Address
                  </h3>
                </div>
                {order.shippingAddress ? (
                  <div className="text-xs text-[#666666] space-y-1 leading-relaxed">
                    <p className="font-bold text-[#111111] text-sm">
                      {order.shippingAddress.fullName}
                    </p>
                    <p>{order.shippingAddress.street}</p>
                    {order.shippingAddress.apartment && <p>{order.shippingAddress.apartment}</p>}
                    <p>
                      {order.shippingAddress.city}, {order.shippingAddress.state} -{' '}
                      <span className="font-mono font-bold text-[#111111]">{order.shippingAddress.pincode}</span>
                    </p>
                    <p>{order.shippingAddress.country || 'India'}</p>
                    <div className="pt-2 border-t border-[#E5E2DC] text-[11px] space-y-0.5">
                      <p>
                        <span className="font-semibold text-[#111111]">Phone:</span>{' '}
                        {order.shippingAddress.phone}
                      </p>
                      <p>
                        <span className="font-semibold text-[#111111]">Email:</span>{' '}
                        {order.shippingAddress.email || order.guestEmail || '—'}
                      </p>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-[#666666]">No address on file.</p>
                )}
              </div>

              {/* Price Breakdown Card */}
              <div className="bg-white rounded-xl p-6 border border-[#E5E2DC] shadow-xs space-y-3">
                <div className="border-b border-[#E5E2DC] pb-3">
                  <h3 className="font-extrabold text-xs text-[#111111] uppercase font-display tracking-wider">
                    Payment Breakdown
                  </h3>
                </div>

                <div className="space-y-2 text-xs text-[#666666]">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-mono font-medium text-[#111111]">{formatPrice(order.subtotal)}</span>
                  </div>

                  {order.discount > 0 && (
                    <div className="flex justify-between text-emerald-700 font-semibold">
                      <span>Discount {order.couponCode ? `(${order.couponCode})` : ''}</span>
                      <span className="font-mono">-{formatPrice(order.discount)}</span>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span>Shipping Fee</span>
                    <span className="font-mono font-medium text-[#111111]">
                      {order.shipping === 0 ? 'FREE' : formatPrice(order.shipping)}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span>Estimated Taxes (GST)</span>
                    <span className="font-mono font-medium text-[#111111]">{formatPrice(order.tax || 0)}</span>
                  </div>

                  <div className="flex justify-between font-extrabold text-sm text-[#111111] pt-3 border-t border-[#E5E2DC]">
                    <span>Total Amount</span>
                    <span className="font-mono text-base">{formatPrice(order.total)}</span>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Return Modal */}
        {showReturnModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs overflow-y-auto">
            <form
              onSubmit={handleReturnSubmit}
              className="bg-white rounded-2xl p-6 max-w-lg w-full border border-[#E5E2DC] shadow-xl space-y-4 my-8"
            >
              <div className="border-b border-[#E5E2DC] pb-3">
                <h3 className="text-base font-extrabold text-[#111111] uppercase font-display">
                  Request Return
                </h3>
                <p className="text-xs text-[#666666] mt-0.5">
                  Order #{order?.orderNumber}
                </p>
              </div>

              {returnError && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0 text-red-600" />
                  <span>{returnError}</span>
                </div>
              )}

              {/* Policy Notice */}
              <div className="p-3 bg-[#F7F5F0] rounded-xl border border-[#E5E2DC] text-[11px] text-[#555555] leading-relaxed">
                <span className="font-bold text-[#111111] block mb-0.5 font-mono uppercase text-[10px]">Store Policy:</span>
                Returns are accepted strictly for defective or damaged items within 7 days of delivery. Upon approval, customer support coordinates return instructions directly with you.
              </div>

              {/* Item Selection Checklist */}
              <div>
                <label className="block text-xs font-bold text-[#111111] uppercase mb-1.5 font-mono">
                  Select Item(s) to Return *
                </label>
                <div className="space-y-2 max-h-48 overflow-y-auto border border-[#E5E2DC] rounded-xl p-3 bg-[#FAF8F5]">
                  {(order.items || []).map((item) => {
                    const isChecked = selectedItems[item._id]?.selected ?? true;
                    const qty = selectedItems[item._id]?.quantity ?? item.quantity;

                    return (
                      <div
                        key={item._id}
                        className={`p-2.5 rounded-lg border transition-colors flex items-center justify-between gap-3 text-xs ${
                          isChecked ? 'bg-white border-[#111111]/30 shadow-xs' : 'bg-transparent border-transparent opacity-60'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => toggleItemSelection(item._id)}
                            className="rounded border-[#E5E2DC] text-[#111111] focus:ring-[#111111] w-4 h-4"
                          />
                          <div className="min-w-0">
                            <p className="font-bold text-[#111111] truncate">{item.name}</p>
                            <p className="text-[11px] text-[#666666]">
                              {item.size ? `Size: ${item.size} • ` : ''}
                              {item.color ? `Color: ${item.color} • ` : ''}
                              Purchased: {item.quantity}
                            </p>
                          </div>
                        </div>

                        {isChecked && item.quantity > 1 && (
                          <div className="flex items-center gap-1.5 shrink-0 font-mono">
                            <span className="text-[10px] text-[#666666]">Qty:</span>
                            <select
                              value={qty}
                              onChange={(e) => updateItemQuantity(item._id, e.target.value, item.quantity)}
                              className="bg-[#F7F5F0] border border-[#E5E2DC] rounded px-2 py-1 text-xs font-bold text-[#111111]"
                            >
                              {[...Array(item.quantity)].map((_, i) => (
                                <option key={i + 1} value={i + 1}>
                                  {i + 1}
                                </option>
                              ))}
                            </select>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Policy-Compliant Reason Selection */}
              <div>
                <label className="block text-xs font-bold text-[#111111] uppercase mb-1.5 font-mono">
                  Reason for Return *
                </label>
                <select
                  value={returnReason}
                  onChange={(e) => setReturnReason(e.target.value)}
                  className="w-full bg-[#F7F5F0] border border-[#E5E2DC] rounded-xl p-3 text-xs text-[#111111] focus:outline-hidden focus:border-[#111111]"
                  required
                >
                  <option value="">Select Reason (Policy Compliant)</option>
                  <option value="Defective Product / Manufacturing Defect">Defective Product / Manufacturing Defect</option>
                  <option value="Damaged Product / Damaged in Transit">Damaged Product / Damaged in Transit</option>
                </select>
              </div>

              {/* Additional Details */}
              <div>
                <label className="block text-xs font-bold text-[#111111] uppercase mb-1.5 font-mono">
                  Issue Description & Details *
                </label>
                <textarea
                  rows={3}
                  required
                  value={returnDetails}
                  onChange={(e) => setReturnDetails(e.target.value)}
                  placeholder="Please describe the defect or damage in detail to assist our studio team in verification..."
                  className="w-full bg-[#F7F5F0] border border-[#E5E2DC] rounded-xl p-3 text-xs text-[#111111] focus:outline-hidden focus:border-[#111111]"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowReturnModal(false)}
                  disabled={submittingReturn}
                  className="w-full py-2.5 bg-[#F7F5F0] text-[#111111] text-xs font-bold uppercase rounded-xl hover:bg-neutral-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingReturn || !returnReason || !returnDetails.trim()}
                  className="btn-primary w-full py-2.5 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 disabled:opacity-50"
                >
                  {submittingReturn ? 'Submitting...' : 'Submit Return Request'}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </UserLayout>
  );
}
