const crypto = require('crypto');

const generateOrderNumber = () => {
  const year = new Date().getFullYear();
  const randomDigits = Math.floor(100000 + Math.random() * 900000);
  return `TSH-${year}-${randomDigits}`;
};

const generateTrackingToken = () => {
  return crypto.randomBytes(16).toString('hex');
};

module.exports = {
  generateOrderNumber,
  generateTrackingToken,
};
