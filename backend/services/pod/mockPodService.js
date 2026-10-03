const PODInterface = require('./podInterface');

class MockPodService extends PODInterface {
  async submitFulfillmentOrder(order) {
    console.log(`[MockPodService]: Simulating POD order submission for Order #${order.orderNumber}`);
    
    // Generate mock POD details
    const podOrderId = `MOCK-POD-${Date.now()}`;
    const trackingNumber = `DELHIVERY-${Math.floor(1000000000 + Math.random() * 9000000000)}`;

    return {
      success: true,
      podProvider: 'MOCK_POD',
      podOrderId,
      status: 'SUBMITTED',
      trackingNumber,
      courier: 'Delhivery Surface',
      rawResponse: {
        message: 'Order successfully created in Mock POD fulfillment queue.',
        orderNumber: order.orderNumber,
        itemsCount: order.items.length,
      },
    };
  }

  async getFulfillmentStatus(podOrderId) {
    return {
      podOrderId,
      status: 'PROCESSING',
      trackingNumber: `DELHIVERY-${Math.floor(1000000000 + Math.random() * 9000000000)}`,
      courier: 'Delhivery Surface',
      events: [
        { status: 'SUBMITTED', timestamp: new Date(Date.now() - 3600000) },
        { status: 'PRINTING', timestamp: new Date() },
      ],
    };
  }

  async cancelFulfillmentOrder(podOrderId) {
    return {
      success: true,
      podOrderId,
      status: 'CANCELLED',
    };
  }
}

module.exports = new MockPodService();
