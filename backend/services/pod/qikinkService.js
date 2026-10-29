const PODInterface = require('./podInterface');
const axios = require('axios');

class QikinkService extends PODInterface {
  constructor() {
    super();
    this.cachedToken = null;
    this.tokenExpiry = null;
    this.cachedMode = null;
  }

  isSandbox() {
    if (process.env.QIKINK_SANDBOX_MODE !== undefined) {
      return String(process.env.QIKINK_SANDBOX_MODE).trim().toLowerCase() === 'true';
    }
    const mode = (process.env.POD_MODE || process.env.POD_PROVIDER || 'sandbox').trim().toLowerCase();
    return mode !== 'live' && mode !== 'production';
  }

  getApiUrl() {
    const customUrl = (process.env.POD_API_URL || '').replace(/\/+$/, '').replace(/\/v1$/, '');
    if (this.isSandbox()) {
      return customUrl || 'https://sandbox.qikink.com';
    }
    // In live mode, default to official live endpoint, but allow custom URL if not explicitly sandbox
    if (customUrl && !customUrl.includes('sandbox.qikink.com')) {
      return customUrl;
    }
    return 'https://api.qikink.com';
  }

  getCredentials() {
    const isSandbox = this.isSandbox();
    const apiKey = (
      (isSandbox ? process.env.QIKINK_SANDBOX_CLIENT_ID : process.env.QIKINK_LIVE_CLIENT_ID) ||
      process.env.QIKINK_CLIENT_ID ||
      process.env.POD_API_KEY ||
      process.env.POD_CLIENT_ID ||
      ''
    ).trim();

    let apiSecret = '';
    if (isSandbox) {
      apiSecret = (
        process.env.QIKINK_SANDBOX_SECRET ||
        process.env.POD_API_SECRET ||
        process.env.POD_CLIENT_SECRET ||
        ''
      ).trim();
    } else {
      apiSecret = (
        process.env.QIKINK_LIVE_SECRET ||
        process.env.QIKINK_CLIENT_SECRET ||
        process.env.POD_API_SECRET ||
        process.env.POD_CLIENT_SECRET ||
        ''
      ).trim();
    }

    return { apiKey, apiSecret };
  }

  async getAccessToken(forceRefresh = false) {
    const currentMode = this.isSandbox() ? 'sandbox' : 'live';
    if (!forceRefresh && this.cachedToken && this.tokenExpiry && this.cachedMode === currentMode && Date.now() < this.tokenExpiry) {
      return this.cachedToken;
    }

    const { apiKey, apiSecret } = this.getCredentials();
    const apiUrl = this.getApiUrl();

    if (!apiKey || !apiSecret) {
      throw new Error(`Qikink POD API credentials (Client ID / Secret) are missing in environment variables for ${currentMode.toUpperCase()} mode.`);
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

      const token = response.data?.Accesstoken || response.data?.access_token || response.data?.token;
      if (!token) {
        throw new Error(response.data?.error || response.data?.message || 'Invalid authentication response from Qikink API.');
      }

      this.cachedToken = token;
      this.cachedMode = currentMode;
      const expiresInSec = Number(response.data?.expires_in) || 3600;
      // Refresh 5 minutes before actual expiry
      this.tokenExpiry = Date.now() + Math.max(300, expiresInSec - 300) * 1000;

      return token;
    } catch (error) {
      const status = error.response?.status ?? null;
      console.error('[Qikink Auth Diagnostic]:', {
        status,
        url: `${apiUrl}/api/token`,
        mode: currentMode,
        message: error.response?.data?.error || error.response?.data?.message || error.message,
      });
      throw new Error(`Qikink authentication failed (HTTP ${status ?? 'NO_RESPONSE'}). Check backend logs.`);
    }
  }

  async submitFulfillmentOrder(order) {
    // 1. Pre-submission validation
    if (!order || !order.shippingAddress) {
      throw new Error('Cannot submit order to Qikink: Shipping address is missing.');
    }

    const addr = order.shippingAddress;
    if (!addr.fullName || !addr.phone || !addr.street || !addr.city || !addr.state || !addr.pincode) {
      throw new Error('Cannot submit order to Qikink: Incomplete shipping address details.');
    }

    if (!order.items || !Array.isArray(order.items) || order.items.length === 0) {
      throw new Error('Cannot submit order to Qikink: Order contains no items.');
    }

    // Customer email with clean fallback
    const rawEmail = (addr.email || order.guestEmail || (order.user && order.user.email) || '').trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const customerEmail = emailRegex.test(rawEmail) ? rawEmail : 'customer@gtclothinghub.com';

    const cleanPhone = String(addr.phone).replace(/\D/g, '').slice(-10);
    if (!cleanPhone || cleanPhone.length !== 10) {
      throw new Error(`Cannot submit order to Qikink: A valid 10-digit phone number is required (received: '${addr.phone}').`);
    }

    const cleanZip = String(addr.pincode).replace(/\D/g, '');
    if (!cleanZip || cleanZip.length !== 6) {
      throw new Error(`Cannot submit order to Qikink: A valid 6-digit pincode is required (received: '${addr.pincode}').`);
    }

    for (const item of order.items) {
      if (!item.sku || !String(item.sku).trim()) {
        throw new Error(`Cannot submit order to Qikink: Item '${item.name || 'unnamed'}' is missing a valid SKU.`);
      }
    }

    // 2. Prepare order metadata
    const isSandbox = this.isSandbox();
    const apiUrl = this.getApiUrl();
    const { apiKey } = this.getCredentials();

    // Name splitting
    const nameParts = (addr.fullName || '').trim().split(/\s+/);
    const firstName = nameParts[0] || 'Customer';
    const lastName = nameParts.slice(1).join(' ') || '';

    // Qikink hard limit: order_number cannot exceed 15 characters
    const rawOrderNum = String(order.orderNumber || order._id || '').replace(/[^a-zA-Z0-9]/g, '');
    const shortOrderNum = rawOrderNum.length > 15 ? `ORD${rawOrderNum.slice(-12)}` : rawOrderNum;

    // Default design links for sandbox mock testing
    const defaultSandboxAsset = 'https://sgp1.digitaloceanspaces.com/cdn.qikink.com/erp2/assets/designs/83/1696668376.jpg';

    // 3. Construct payload matching Qikink order creation schema
    const payload = {
      order_number: shortOrderNum,
      qikink_shipping: '1',
      gateway: order.paymentMethod === 'COD' ? 'COD' : 'Prepaid',
      total_order_value: String(order.total),
      shipping_address: {
        first_name: firstName,
        last_name: lastName,
        address1: addr.street,
        address2: addr.apartment || addr.suite || '',
        phone: cleanPhone,
        email: customerEmail,
        city: addr.city,
        province: addr.state,
        zip: cleanZip,
        country_code: 'IN',
      },
      line_items: order.items.map((item) => {
        const itemImage =
          item.image ||
          (item.product && item.product.images && item.product.images[0]?.url) ||
          (isSandbox ? defaultSandboxAsset : '');

        const hasCustomDesign = Boolean(item.designLink || item.design_link || item.printFile);

        // In Sandbox mode: Qikink sandbox DB has no dashboard products.
        // search_from_my_products MUST be 0 with full design details provided.
        if (isSandbox) {
          // Known verified working SKUs in Qikink's isolated sandbox database:
          const validSandboxSkus = ['USS-WH-M', 'USS-BK-L', 'MVNHS-WH-S', 'USS-WH-S'];
          let finalSku = String(item.sku || '').trim();

          // If the product SKU is a custom ID or hash from live dashboard, map to a valid sandbox garment for testing
          if (!validSandboxSkus.includes(finalSku.toUpperCase())) {
            const size = String(item.size || '').toUpperCase();
            if (size === 'S') finalSku = 'MVnHs-Wh-S';
            else if (['L', 'XL', 'XXL', '3XL'].includes(size)) finalSku = 'USs-Bk-L';
            else finalSku = 'USs-Wh-M';
          }

          const isValidHttpUrl = (url) => typeof url === 'string' && /^https?:\/\//i.test(url.trim());
          const rawDesignUrl = item.designLink || item.design_link || item.printFile || itemImage;
          const designUrl = isValidHttpUrl(rawDesignUrl) ? rawDesignUrl.trim() : defaultSandboxAsset;

          const rawMockupUrl = item.mockupLink || item.mockup_link || itemImage;
          const mockupUrl = isValidHttpUrl(rawMockupUrl) ? rawMockupUrl.trim() : defaultSandboxAsset;

          return {
            search_from_my_products: 0,
            sku: finalSku,
            quantity: String(item.quantity || 1),
            price: String(item.price || 0),
            print_type_id: 1,
            designs: [
              {
                design_code:
                  item.design_code ||
                  `Design-${String(item.sku || '001')
                    .slice(0, 10)
                    .replace(/[^a-zA-Z0-9]/g, '')}`,
                width_inches: String(item.width_inches || '10'),
                height_inches: String(item.height_inches || '10'),
                placement_sku: item.placement_sku || 'fr',
                design_link: designUrl,
                mockup_link: mockupUrl,
              },
            ],
          };
        }

        // In Live mode:
        // 1. Resolve genuine item SKU (use variant sku or fall back to podVariantId)
        const liveSku = String(item.sku || item.podVariantId || '').trim();
        if (!liveSku) {
          throw new Error(`Cannot submit order to Qikink: Item '${item.name || 'unnamed'}' is missing a valid SKU.`);
        }

        // If the item provides its own print designs dynamically (custom design order)
        if (hasCustomDesign) {
          const isValidHttpUrl = (url) => typeof url === 'string' && /^https?:\/\//i.test(url.trim());
          const rawLiveDesign = item.designLink || item.design_link || item.printFile || itemImage;
          const liveDesignUrl = isValidHttpUrl(rawLiveDesign) ? rawLiveDesign.trim() : '';
          if (!liveDesignUrl) {
            throw new Error(`Cannot submit custom item '${item.name || liveSku}' to Qikink: Valid design artwork URL is required.`);
          }

          const rawLiveMockup = item.mockupLink || item.mockup_link || itemImage;
          const liveMockupUrl = isValidHttpUrl(rawLiveMockup) ? rawLiveMockup.trim() : liveDesignUrl;

          return {
            search_from_my_products: 0,
            sku: liveSku,
            quantity: String(item.quantity || 1),
            price: String(item.price || 0),
            print_type_id: item.print_type_id || 1,
            designs: [
              {
                design_code: item.design_code || `Design-${liveSku}`,
                width_inches: String(item.width_inches || '10'),
                height_inches: String(item.height_inches || '10'),
                placement_sku: item.placement_sku || 'fr',
                design_link: liveDesignUrl,
                mockup_link: liveMockupUrl,
              },
            ],
          };
        }

        // Standard Live Store Catalog item: Look up in merchant's Qikink "My Products" by SKU
        return {
          search_from_my_products: 1,
          sku: liveSku,
          quantity: String(item.quantity || 1),
          price: String(item.price || 0),
        };
      }),
    };

    // 4. Send request with 401 retry resilience
    const sendOrderRequest = async (token) => {
      return await axios.post(`${apiUrl}/api/order/create`, payload, {
        headers: {
          'Content-Type': 'application/json',
          'ClientId': apiKey,
          'Accesstoken': token,
        },
        timeout: 15000,
      });
    };

    try {
      let token = await this.getAccessToken();
      let response;

      try {
        response = await sendOrderRequest(token);
      } catch (err) {
        if (err.response?.status === 401) {
          console.warn('[Qikink] 401 Unauthorized encountered. Refreshing access token and retrying...');
          token = await this.getAccessToken(true);
          response = await sendOrderRequest(token);
        } else {
          throw err;
        }
      }

      const orderId = response.data?.order_id || response.data?.qikink_order_id || response.data?.id;
      const isSuccessStatus =
        response.data?.status_code === '200' ||
        response.data?.status_code === 200 ||
        response.data?.status === 'success' ||
        response.data?.success === true;

      if (isSuccessStatus && orderId) {
        return {
          success: true,
          podProvider: 'QIKINK',
          podOrderId: String(orderId),
          status: response.data?.status || 'SUBMITTED',
          trackingNumber: response.data?.tracking_number || '',
          courier: response.data?.courier_name || '',
          rawResponse: response.data,
        };
      }

      throw new Error(response.data?.message || response.data?.error || 'Failed to submit order to Qikink POD Provider.');
    } catch (error) {
      const status = error.response?.status ?? null;
      const errData = error.response?.data;
      console.error('[Qikink Order Submission Error]:', {
        status,
        data: errData,
        message: error.message,
      });
      const qikinkMsg = errData?.error || errData?.message || error.message;
      throw new Error(qikinkMsg || 'Failed to submit order to Qikink POD Provider.');
    }
  }

  async getFulfillmentStatus(podOrderId) {
    return {
      podOrderId,
      status: 'WEBHOOK_TRACKED',
      message: 'Tracking details and AWB docket are updated automatically via Qikink status webhooks.',
    };
  }

  async cancelFulfillmentOrder(podOrderId) {
    return {
      success: false,
      podOrderId,
      message: 'Programmatic order cancellation is not supported by Qikink API. Please cancel via the Qikink dashboard before printing begins.',
    };
  }

  async testConnection() {
    const apiUrl = this.getApiUrl();
    const isSandbox = this.isSandbox();
    const mode = isSandbox ? 'sandbox' : 'live';

    try {
      const token = await this.getAccessToken(true);
      return {
        success: true,
        provider: 'QIKINK',
        mode,
        apiUrl,
        message: `Successfully connected to Qikink (${mode.toUpperCase()} mode). Access token generated and cached.`,
        hasToken: !!token,
      };
    } catch (error) {
      return {
        success: false,
        provider: 'QIKINK',
        mode,
        apiUrl,
        message: error.message,
      };
    }
  }
}

module.exports = new QikinkService();
