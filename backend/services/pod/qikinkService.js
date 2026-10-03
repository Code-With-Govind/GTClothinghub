const PODInterface = require('./podInterface');
const axios = require('axios');

class QikinkService extends PODInterface {
  constructor() {
    super();
    this.apiUrl = process.env.POD_API_URL || 'https://api.qikink.com/v1';
    this.apiKey = process.env.POD_API_KEY;
    this.apiSecret = process.env.POD_API_SECRET;
  }

  async submitFulfillmentOrder(order) {
    if (!this.apiKey || !this.apiSecret) {
      throw new Error('Qikink POD API credentials (POD_API_KEY / POD_API_SECRET) are missing.');
    }

    const payload = {
      order_number: order.orderNumber,
      payment_type: order.paymentMethod === 'COD' ? 'COD' : 'PREPAID',
      cod_amount: order.paymentMethod === 'COD' ? order.total : 0,
      shipping_address: {
        first_name: order.shippingAddress.fullName,
        phone: order.shippingAddress.phone,
        address1: order.shippingAddress.street,
        city: order.shippingAddress.city,
        state: order.shippingAddress.state,
        zip: order.shippingAddress.pincode,
        country: 'IN',
      },
      line_items: order.items.map((item) => ({
        pod_variant_id: item.podVariantId || item.sku,
        sku: item.sku,
        quantity: item.quantity,
      })),
    };

    try {
      const response = await axios.post(`${this.apiUrl}/orders`, payload, {
        headers: {
          'Content-Type': 'application/json',
          'X-Api-Key': this.apiKey,
          'X-Api-Secret': this.apiSecret,
        },
      });

      return {
        success: true,
        podProvider: 'QIKINK',
        podOrderId: response.data?.order_id || response.data?.id,
        status: response.data?.status || 'SUBMITTED',
        trackingNumber: response.data?.tracking_number || '',
        courier: response.data?.courier_name || '',
        rawResponse: response.data,
      };
    } catch (error) {
      console.error('[Qikink POD Error]:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Failed to submit order to Qikink POD Provider.');
    }
  }

  async getFulfillmentStatus(podOrderId) {
    if (!this.apiKey || !this.apiSecret) {
      throw new Error('Qikink POD API credentials missing.');
    }

    const response = await axios.get(`${this.apiUrl}/orders/${podOrderId}`, {
      headers: {
        'X-Api-Key': this.apiKey,
        'X-Api-Secret': this.apiSecret,
      },
    });

    return {
      podOrderId,
      status: response.data?.status,
      trackingNumber: response.data?.tracking_number,
      courier: response.data?.courier_name,
    };
  }

  async cancelFulfillmentOrder(podOrderId) {
    const response = await axios.post(
      `${this.apiUrl}/orders/${podOrderId}/cancel`,
      {},
      {
        headers: {
          'X-Api-Key': this.apiKey,
          'X-Api-Secret': this.apiSecret,
        },
      }
    );

    return {
      success: true,
      podOrderId,
      status: response.data?.status || 'CANCELLED',
    };
  }
}

module.exports = new QikinkService();
