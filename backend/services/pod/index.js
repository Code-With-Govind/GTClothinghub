const mockPodService = require('./mockPodService');
const qikinkService = require('./qikinkService');

const getPODService = () => {
  const mode = (process.env.POD_MODE || 'mock').toLowerCase();

  if (mode === 'live' || mode === 'sandbox' || mode === 'qikink') {
    return qikinkService;
  }

  return mockPodService;
};

module.exports = getPODService;
