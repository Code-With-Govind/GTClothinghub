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
    const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI;
    if (!mongoUri) {
      console.warn(`[WARNING]: Neither MONGODB_URI nor MONGO_URI is set in Environment Variables.`);
    }

    if (!process.env.JWT_SECRET) {
      process.env.JWT_SECRET = 'gt_clothing_hub_jwt_secret_key_2026_prod';
      console.warn(`[WARNING]: JWT_SECRET not provided, using production fallback secret.`);
    }
  }
};

module.exports = checkProductionSafety;
