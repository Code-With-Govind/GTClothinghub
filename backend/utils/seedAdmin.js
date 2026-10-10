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

    // Ensure default settings exist
    const settingsCount = await Settings.countDocuments();
    if (settingsCount === 0) {
      await Settings.create({
        storeName: 'GT Clothing Hub Studio',
        brandName: 'GT CLOTHING HUB',
        supportEmail: 'support@gtclothinghub.com',
        businessMode: 'PRE_REGISTRATION',
        shippingFee: 79,
        freeShippingThreshold: 999,
        codEnabled: true,
        podMode: process.env.POD_MODE || 'sandbox',
      });
      console.log('[Auto-Seed Success]: Default store settings initialized.');
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
