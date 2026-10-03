const checkProductionSafety = () => {
  const isProd = process.env.NODE_ENV === 'production';
  const paymentMode = process.env.RAZORPAY_MODE;
  const podMode = process.env.POD_MODE;

  console.log(`\n==================================================`);
  console.log(`[ENVIRONMENT STATUS]: NODE_ENV=${process.env.NODE_ENV || 'development'}`);
  console.log(`[PAYMENT GATEWAY MODE]: ${paymentMode || 'test'}`);
  console.log(`[POD PROVIDER MODE]: ${podMode || 'mock'}`);
  console.log(`==================================================\n`);

  if (isProd) {
    const missingKeys = [];
    if (!process.env.MONGODB_URI) missingKeys.push('MONGODB_URI');
    if (!process.env.JWT_SECRET || process.env.JWT_SECRET.includes('fallback')) missingKeys.push('JWT_SECRET');

    if (paymentMode === 'live') {
      if (!process.env.RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID.includes('test')) missingKeys.push('RAZORPAY_KEY_ID (live key required)');
      if (!process.env.RAZORPAY_KEY_SECRET || process.env.RAZORPAY_KEY_SECRET.includes('your')) missingKeys.push('RAZORPAY_KEY_SECRET');
      if (!process.env.RAZORPAY_WEBHOOK_SECRET) missingKeys.push('RAZORPAY_WEBHOOK_SECRET');
    }

    if (podMode === 'live') {
      if (!process.env.POD_API_KEY) missingKeys.push('POD_API_KEY');
      if (!process.env.POD_API_SECRET) missingKeys.push('POD_API_SECRET');
    }

    if (missingKeys.length > 0) {
      console.error(`\n[CRITICAL PRODUCTION SAFETY ERROR]:`);
      console.error(`Application cannot start in production with missing or test credentials:`);
      missingKeys.forEach((key) => console.error(` - ${key}`));
      console.error(`Fix environment variables in production before starting server.\n`);
      process.exit(1);
    }
  }
};

module.exports = checkProductionSafety;
