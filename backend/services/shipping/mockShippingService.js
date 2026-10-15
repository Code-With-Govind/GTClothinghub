const ShippingInterface = require('./shippingInterface');

class MockShippingService extends ShippingInterface {
  async calculateShippingFee({ items, destinationState, pincode, subtotal, paymentMethod, settings }) {
    const codExtraFee = paymentMethod === 'COD' && settings.codEnabled ? (settings.codExtraFee || 0) : 0;
    const shippingFee = 0;
    const totalShippingCost = shippingFee + codExtraFee;

    return {
      shippingFee: 0,
      codExtraFee,
      totalShippingCost,
      isFreeShipping: true,
      estimatedDays: '3-5 Business Days',
      courierName: 'Delhivery / BlueDart Express',
    };
  }

  async trackShipment(trackingNumber, courier) {
    return {
      trackingNumber,
      courier: courier || 'Delhivery',
      status: 'IN_TRANSIT',
      estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
      location: 'Hub Sorting Facility - Bengaluru',
      history: [
        { status: 'MANIFEST_CREATED', timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) },
        { status: 'PICKED_UP', timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) },
        { status: 'IN_TRANSIT', timestamp: new Date() },
      ],
    };
  }
}

module.exports = new MockShippingService();
