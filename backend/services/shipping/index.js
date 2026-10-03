const mockShippingService = require('./mockShippingService');
const liveShippingService = require('./liveShippingService');

const getShippingService = () => {
  const mode = process.env.SHIPPING_MODE || 'mock';
  if (mode === 'live') {
    return liveShippingService;
  }
  return mockShippingService;
};

module.exports = getShippingService();
