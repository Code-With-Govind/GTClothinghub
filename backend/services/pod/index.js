const mockPodService = require('./mockPodService');
const qikinkService = require('./qikinkService');

const getPODService = () => {
  const mode = (process.env.POD_MODE || process.env.POD_PROVIDER || 'mock').toLowerCase();

  if (mode === 'live' || mode === 'production' || mode === 'sandbox' || mode === 'qikink') {
    return qikinkService;
  }

  return mockPodService;
};

module.exports = getPODService;
