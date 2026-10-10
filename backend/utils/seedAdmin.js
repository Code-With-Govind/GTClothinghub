const User = require('../models/User');
const Settings = require('../models/Settings');
const Category = require('../models/Category');

const ensureAdminAndInitialData = async () => {
  try {
    let admin = await User.findOne({ email: 'admin@gtclothinghub.com' });

    if (!admin) {
      console.log('[Auto-Seed]: Admin account not found in database. Creating default Admin...');
      admin = await User.create({
        name: 'GT Studio Admin',
        email: 'admin@gtclothinghub.com',
        password: 'AdminPassword123!',
        role: 'ADMIN',
        phone: '+91 98765 43210',
        isEmailVerified: true,
      });
      console.log('[Auto-Seed Success]: Admin account created (admin@gtclothinghub.com)');
    }

    // Ensure store settings exist & update Free Shipping + Automatic Tax Calculation
    let settings = await Settings.findOne();
    if (!settings) {
      settings = await Settings.create({
        storeName: 'GT Clothing Hub Studio',
        brandName: 'GT CLOTHING HUB',
        supportEmail: 'support@gtclothinghub.com',
        businessMode: 'GST_REGISTERED',
        gstRatePercentage: 5,
        isTaxInclusive: false,
        shippingFee: 0,
        freeShippingThreshold: 0,
        codEnabled: true,
        podMode: process.env.POD_MODE || 'sandbox',
      });
      console.log('[Auto-Seed Success]: Default store settings initialized with FREE Shipping & 5% GST Tax.');
    } else {
      settings.shippingFee = 0;
      settings.freeShippingThreshold = 0;
      settings.businessMode = 'GST_REGISTERED';
      settings.gstRatePercentage = 5;
      settings.isTaxInclusive = false;
      await settings.save();
      console.log('[Auto-Seed Success]: Updated store settings: FREE Shipping & 5% Automatic GST Tax enabled.');
    }

    // Ensure at least one category exists
    const categoryCount = await Category.countDocuments();
    if (categoryCount === 0) {
      await Category.create({
        name: 'Oversized T-Shirts',
        slug: 'oversized-tshirts',
        description: 'Heavyweight cotton graphic streetwear tees with relaxed silhouette drops.',
        image: { url: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800' },
      });
      console.log('[Auto-Seed Success]: Default category initialized.');
    }
  } catch (error) {
    console.error('[Auto-Seed Error]:', error.message);
  }
};

module.exports = ensureAdminAndInitialData;
