export const formatPrice = (amount) => {
  if (amount === undefined || amount === null) return '₹0';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatDate = (dateString) => {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const getStatusBadgeColor = (status) => {
  switch (status) {
    case 'PAID':
    case 'DELIVERED':
    case 'APPROVED':
      return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
    case 'PROCESSING':
    case 'FULFILLMENT_PENDING':
    case 'SHIPPED':
    case 'OUT_FOR_DELIVERY':
      return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
    case 'PENDING':
    case 'PENDING_PAYMENT':
    case 'COD_PENDING':
      return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
    case 'FAILED':
    case 'CANCELLED':
    case 'REJECTED':
      return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
    case 'REFUNDED':
    case 'RTO':
    case 'RETURNED':
      return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
    default:
      return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
  }
};
