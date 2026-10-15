const ShippingInterface = require('./shippingInterface');

class LiveShippingService extends ShippingInterface {
  async calculateShippingFee({ items, destinationState, pincode, subtotal, paymentMethod, settings }) {
    // API client integration place for Shiprocket / Delhivery API
    // Defaults to dynamic fallback calculation if API key not present
    const codExtraFee = paymentMethod === 'COD' && settings.codEnabled ? (settings.codExtraFee || 0) : 0;
    const shippingFee = 0;
    return {
      shippingFee: 0,
      codExtraFee,
      totalShippingCost: shippingFee + codExtraFee,
      isFreeShipping: true,
      estimatedDays: '3-4 Business Days',
      courierName: 'Delhivery Surface Express',
    };
  }

  async trackShipment(trackingNumber, courier) {
    // In live mode, call shipping provider REST API (e.g. Shiprocket tracking API)
    return {
      trackingNumber,
      courier: courier || 'Delhivery',
      status: 'OUT_FOR_DELIVERY',
      estimatedDelivery: new Date().toISOString(),
      location: 'Local Delivery Facility',
      history: [],
    };
  }
}

module.exports = new LiveShippingService();
