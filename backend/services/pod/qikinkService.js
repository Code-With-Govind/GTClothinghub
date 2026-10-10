const PODInterface = require('./podInterface');
const axios = require('axios');

class QikinkService extends PODInterface {
  getApiUrl() {
    const mode = (process.env.POD_MODE || 'mock').toLowerCase();
    if (mode === 'live') {
      return 'https://api.qikink.com';
    }
    return process.env.POD_API_URL || 'https://sandbox.qikink.com';
  }

  getCredentials() {
    return {
      apiKey: (process.env.POD_API_KEY || '').trim(),
      apiSecret: (process.env.POD_API_SECRET || '').trim(),
    };
  }

  async getAccessToken() {
    const { apiKey, apiSecret } = this.getCredentials();
    const apiUrl = this.getApiUrl();

    if (!apiKey || !apiSecret) {
      throw new Error('Qikink POD API credentials (POD_API_KEY / POD_API_SECRET) are missing in .env file.');
    }

    try {
      const params = new URLSearchParams();
      params.append('ClientId', apiKey);
      params.append('client_secret', apiSecret);

      const response = await axios.post(`${apiUrl}/api/token`, params, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        timeout: 10000,
      });

      if (response.data?.Accesstoken || response.data?.access_token || response.data?.token) {
        return response.data.Accesstoken || response.data.access_token || response.data.token;
      }

      throw new Error(response.data?.error || response.data?.message || 'Invalid authentication response from Qikink API.');
    } catch (error) {
      console.error('[Qikink Auth Error]:', error.response?.data || error.message);
      throw new Error(error.response?.data?.error || error.response?.data?.message || 'Failed to authenticate with Qikink API.');
    }
  }

  async submitFulfillmentOrder(order) {
    const token = await this.getAccessToken();
    const apiUrl = this.getApiUrl();
    const mode = (process.env.POD_MODE || 'mock').toLowerCase();

    const payload = {
      order_number: String(order.orderNumber).slice(0, 15),
      payment_type: order.paymentMethod === 'COD' ? 'COD' : 'PREPAID',
      cod_amount: order.paymentMethod === 'COD' ? String(order.total) : '0',
      total_order_value: String(order.total),
      search_from_my_products: mode === 'sandbox' ? 0 : 1,
      shipping_address: {
        first_name: order.shippingAddress.fullName,
        phone: order.shippingAddress.phone,
        address1: order.shippingAddress.street,
        city: order.shippingAddress.city,
        state: order.shippingAddress.state,
        zip: String(order.shippingAddress.pincode),
        country: 'IN',
      },
      line_items: order.items.map((item) => ({
        pod_variant_id: item.podVariantId || item.sku,
        sku: item.sku,
        quantity: String(item.quantity),
        price: String(item.price),
      })),
    };

    try {
      const response = await axios.post(`${apiUrl}/api/order/create`, payload, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        timeout: 15000,
      });

      return {
        success: true,
        podProvider: 'QIKINK',
        podOrderId: response.data?.order_id || response.data?.qikink_order_id || response.data?.id,
        status: response.data?.status || 'SUBMITTED',
        trackingNumber: response.data?.tracking_number || '',
        courier: response.data?.courier_name || '',
        rawResponse: response.data,
      };
    } catch (error) {
      console.error('[Qikink POD Error]:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || error.response?.data?.error || 'Failed to submit order to Qikink POD Provider.');
    }
  }

  async getFulfillmentStatus(podOrderId) {
    const token = await this.getAccessToken();
    const apiUrl = this.getApiUrl();

    const response = await axios.get(`${apiUrl}/api/order/${podOrderId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      timeout: 10000,
    });

    return {
      podOrderId,
      status: response.data?.status,
      trackingNumber: response.data?.tracking_number,
      courier: response.data?.courier_name,
    };
  }

  async cancelFulfillmentOrder(podOrderId) {
    const token = await this.getAccessToken();
    const apiUrl = this.getApiUrl();

    const response = await axios.post(
      `${apiUrl}/api/order/cancel`,
      { order_id: podOrderId },
      {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        timeout: 10000,
      }
    );

    return {
      success: true,
      podOrderId,
      status: response.data?.status || 'CANCELLED',
    };
  }

  async testConnection() {
    const apiUrl = this.getApiUrl();
    try {
      const token = await this.getAccessToken();
      return {
        success: true,
        provider: 'QIKINK',
        apiUrl,
        message: 'Successfully authenticated with Qikink API & retrieved Access Token!',
        hasToken: !!token,
      };
    } catch (error) {
      return {
        success: false,
        provider: 'QIKINK',
        apiUrl,
        message: error.message,
      };
    }
  }
}

module.exports = new QikinkService();
