const ShippingInterface = require('./shippingInterface');

class LiveShippingService extends ShippingInterface {
  async calculateShippingFee({ items, destinationState, pincode, subtotal, paymentMethod, settings }) {
    // API client integration place for Shiprocket / Delhivery API
    // Defaults to dynamic fallback calculation if API key not present
    const freeThreshold = settings.freeShippingThreshold || 999;
    const baseFee = settings.shippingFee || 79;
    const codExtraFee = paymentMethod === 'COD' ? (settings.codExtraFee || 49) : 0;

    let shippingFee = subtotal >= freeThreshold ? 0 : baseFee;
    return {
      shippingFee,
      codExtraFee,
      totalShippingCost: shippingFee + codExtraFee,
      isFreeShipping: subtotal >= freeThreshold,
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
