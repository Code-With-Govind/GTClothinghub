class InvoiceService {
  /**
   * Generates invoice metadata and renderable object for an order.
   * @param {Object} order - Full Order object
   * @param {Object} settings - Store settings object
   * @returns {Object} Invoice metadata & formatted JSON
   */
  generateInvoice(order, settings) {
    const isGstRegistered = settings.businessMode === 'GST_REGISTERED' && settings.gstin;

    const documentTitle = isGstRegistered ? 'TAX INVOICE' : 'SALE RECEIPT / BILL OF SALE';
    const invoiceNumber = `INV-${order.orderNumber}`;
    const invoiceDate = new Date(order.createdAt).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    const sellerInfo = {
      name: settings.brandName || settings.storeName,
      proprietor: settings.proprietorName || '',
      address: settings.address,
      email: settings.supportEmail,
      phone: settings.supportPhone,
      gstin: isGstRegistered ? settings.gstin : null,
      pan: isGstRegistered && settings.panNumber ? settings.panNumber : null,
      businessMode: settings.businessMode,
    };

    const buyerInfo = {
      name: order.shippingAddress.fullName,
      email: order.shippingAddress.email,
      phone: order.shippingAddress.phone,
      street: order.shippingAddress.street,
      city: order.shippingAddress.city,
      state: order.shippingAddress.state,
      pincode: order.shippingAddress.pincode,
      country: order.shippingAddress.country,
    };

    const items = order.items.map((item) => ({
      name: item.name,
      sku: item.sku,
      variant: `${item.color} / ${item.size}`,
      quantity: item.quantity,
      unitPrice: item.price,
      totalPrice: item.price * item.quantity,
      hsnCode: isGstRegistered ? (order.taxBreakdown?.hsnCode || '61091000') : null,
    }));

    return {
      documentTitle,
      invoiceNumber,
      invoiceDate,
      sellerInfo,
      buyerInfo,
      items,
      pricing: {
        subtotal: order.subtotal,
        discount: order.discount,
        shipping: order.shipping,
        taxTotal: order.tax,
        taxBreakdown: order.taxBreakdown,
        total: order.total,
      },
      paymentMethod: order.paymentMethod,
      paymentStatus: order.paymentStatus,
      isGstRegistered,
      disclaimer: isGstRegistered
        ? 'This is a computer generated tax invoice.'
        : 'This sale receipt is issued prior to GST registration in accordance with tax threshold provisions.',
    };
  }
}

module.exports = new InvoiceService();
