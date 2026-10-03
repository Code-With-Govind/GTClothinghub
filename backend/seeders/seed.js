const dotenv = require('dotenv');
dotenv.config();

const connectDB = require('../config/db');
const User = require('../models/User');
const Product = require('../models/Product');
const Category = require('../models/Category');
const Coupon = require('../models/Coupon');
const Settings = require('../models/Settings');

const seedData = async () => {
  try {
    await connectDB();

    console.log('Clearing existing data...');
    await User.deleteMany();
    await Product.deleteMany();
    await Category.deleteMany();
    await Coupon.deleteMany();
    await Settings.deleteMany();

    console.log('Creating Admin & Customer Users...');
    const adminUser = await User.create({
      name: 'GT Studio Admin',
      email: 'admin@gtclothinghub.com',
      password: 'AdminPassword123!',
      role: 'ADMIN',
      phone: '+91 98765 43210',
      isEmailVerified: true,
    });

    const customerUser = await User.create({
      name: 'Alex Mercer',
      email: 'customer@example.com',
      password: 'CustomerPassword123!',
      role: 'CUSTOMER',
      phone: '+91 98123 45678',
      isEmailVerified: true,
    });

    console.log('Creating Default Business Settings...');
    await Settings.create({
      storeName: 'GT Clothing Hub Studio',
      brandName: 'GT CLOTHING HUB',
      proprietorName: 'Business Owner',
      supportEmail: 'support@gtclothinghub.com',
      supportPhone: '+91 98765 43210',
      address: {
        street: '108 Fashion Avenue, Indiranagar',
        city: 'Bengaluru',
        state: 'Karnataka',
        pincode: '560038',
        country: 'India',
      },
      businessMode: 'PRE_REGISTRATION', // Starts in Pre-GST compliance mode
      gstRatePercentage: 5,
      isTaxInclusive: true,
      shippingFee: 79,
      freeShippingThreshold: 999,
      codEnabled: true,
      codExtraFee: 49,
      podMode: 'mock',
      paymentMode: 'test',
    });

    console.log('Creating Categories...');
    const oversizedCat = await Category.create({
      name: 'Oversized T-Shirts',
      slug: 'oversized-tshirts',
      description: 'Heavyweight cotton graphic streetwear tees with relaxed silhouette drops.',
      image: { url: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800&auto=format&fit=crop&q=80' },
    });

    const animeCat = await Category.create({
      name: 'Anime & Manga Graphics',
      slug: 'anime-graphics',
      description: 'Cyberpunk, neo-tokyo, and minimal anime inspired streetwear tees.',
      image: { url: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80' },
    });

    const typographyCat = await Category.create({
      name: 'Typography & Minimal',
      slug: 'typography-minimal',
      description: 'Clean typographic aesthetics, raw statements, and subtle chest logos.',
      image: { url: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=800&auto=format&fit=crop&q=80' },
    });

    console.log('Creating Products...');
    const productsData = [
      // OVERSIZED - PRINTED
      {
        name: 'GT Cyberpunk Tokyo Heavyweight Oversized Tee',
        slug: 'gt-cyberpunk-tokyo-oversized-tee',
        description: '240 GSM 100% Super Combed Premium Cotton. Featuring vibrant back cyber-graphic print with puff print chest accent. Pre-shrunk bio-washed fabric for supreme comfort.',
        price: 899,
        compareAtPrice: 1499,
        category: oversizedCat._id,
        mainSection: 'Oversized T-Shirts',
        subSection: 'Printed T-Shirts',
        images: [
          { url: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800&auto=format&fit=crop&q=80', altText: 'Cyberpunk Tokyo Front' },
          { url: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80', altText: 'Cyberpunk Tokyo Detail' },
        ],
        colors: [
          { name: 'Pitch Black', hex: '#121212' },
          { name: 'Vintage Acid Washed Gray', hex: '#383838' },
        ],
        sizes: ['S', 'M', 'L', 'XL', 'XXL'],
        variants: [
          { sku: 'CYBER-BLK-S', color: 'Pitch Black', colorHex: '#121212', size: 'S', price: 899, podVariantId: 'POD-QIK-CYBER-S' },
          { sku: 'CYBER-BLK-M', color: 'Pitch Black', colorHex: '#121212', size: 'M', price: 899, podVariantId: 'POD-QIK-CYBER-M' },
          { sku: 'CYBER-BLK-L', color: 'Pitch Black', colorHex: '#121212', size: 'L', price: 899, podVariantId: 'POD-QIK-CYBER-L' },
          { sku: 'CYBER-BLK-XL', color: 'Pitch Black', colorHex: '#121212', size: 'XL', price: 899, podVariantId: 'POD-QIK-CYBER-XL' },
        ],
        tags: ['Cyberpunk', 'Oversized', 'Printed', 'Streetwear'],
        isFeatured: true,
        isBestSeller: true,
        isNewArrival: false,
        hsnCode: '61091000',
      },
      // OVERSIZED - PLAIN
      {
        name: 'Essential Pitch Black Heavyweight Oversized Plain Tee',
        slug: 'essential-black-oversized-plain-tee',
        description: '240 GSM ultra-clean plain boxy silhouette streetwear tee. Zero print, pure raw minimalism with drop shoulders.',
        price: 699,
        compareAtPrice: 1099,
        category: oversizedCat._id,
        mainSection: 'Oversized T-Shirts',
        subSection: 'Plain T-Shirts',
        images: [
          { url: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80', altText: 'Plain Oversized Tee' },
        ],
        colors: [
          { name: 'Pitch Black', hex: '#121212' },
        ],
        sizes: ['S', 'M', 'L', 'XL', 'XXL'],
        variants: [
          { sku: 'PLAIN-OVR-BLK-M', color: 'Pitch Black', colorHex: '#121212', size: 'M', price: 699, podVariantId: 'POD-PLAIN-OVR-M' },
          { sku: 'PLAIN-OVR-BLK-L', color: 'Pitch Black', colorHex: '#121212', size: 'L', price: 699, podVariantId: 'POD-PLAIN-OVR-L' },
        ],
        tags: ['Plain', 'Oversized', 'Minimal'],
        isFeatured: true,
        isBestSeller: true,
        isNewArrival: true,
        hsnCode: '61091000',
      },
      // OVERSIZED - CUSTOM DESIGN
      {
        name: 'Custom Printed Oversized Heavyweight Canvas Tee',
        slug: 'custom-printed-oversized-tee-canvas',
        description: 'Create & print your own artwork on 240 GSM drop shoulder canvas! Upload artwork or text for POD printing.',
        price: 999,
        compareAtPrice: 1599,
        category: oversizedCat._id,
        mainSection: 'Oversized T-Shirts',
        subSection: 'Add Your Custom Designs',
        images: [
          { url: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=800&auto=format&fit=crop&q=80', altText: 'Custom Canvas Tee' },
        ],
        colors: [
          { name: 'Raw Olive', hex: '#4A5340' },
          { name: 'Pitch Black', hex: '#121212' },
        ],
        sizes: ['S', 'M', 'L', 'XL', 'XXL'],
        variants: [
          { sku: 'CUST-OVR-M', color: 'Pitch Black', colorHex: '#121212', size: 'M', price: 999, podVariantId: 'POD-CUST-OVR-M' },
        ],
        tags: ['Custom', 'Oversized', 'POD Print'],
        isFeatured: true,
        isBestSeller: false,
        isNewArrival: true,
        hsnCode: '61091000',
      },
      // REGULAR - PRINTED
      {
        name: 'RAW ILLUSION Vintage Regular Fit Graphic Tee',
        slug: 'raw-illusion-vintage-regular-fit-tee',
        description: 'Acid washed vintage distress aesthetic with classic regular fit silhouette. Built with 180 GSM combed cotton.',
        price: 649,
        compareAtPrice: 999,
        category: typographyCat._id,
        mainSection: 'Regular T-Shirts',
        subSection: 'Printed T-Shirts',
        images: [
          { url: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=800&auto=format&fit=crop&q=80', altText: 'Raw Illusion Tee' },
        ],
        colors: [
          { name: 'Acid Washed Black', hex: '#222222' },
        ],
        sizes: ['S', 'M', 'L', 'XL'],
        variants: [
          { sku: 'RAW-REG-M', color: 'Acid Washed Black', colorHex: '#222222', size: 'M', price: 649, podVariantId: 'POD-RAW-REG-M' },
        ],
        tags: ['Vintage', 'Regular Fit', 'Printed'],
        isFeatured: false,
        isBestSeller: true,
        isNewArrival: true,
        hsnCode: '61091000',
      },
      // REGULAR - PLAIN
      {
        name: 'Classic White Everyday Regular Fit Plain Tee',
        slug: 'classic-white-regular-plain-tee',
        description: '180 GSM 100% Super Combed Cotton classic round neck plain white t-shirt. Soft, durable, timeless.',
        price: 499,
        compareAtPrice: 799,
        category: typographyCat._id,
        mainSection: 'Regular T-Shirts',
        subSection: 'Plain T-Shirts',
        images: [
          { url: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=800&auto=format&fit=crop&q=80', altText: 'Plain White Tee' },
        ],
        colors: [
          { name: 'Cloud White', hex: '#FFFFFF' },
          { name: 'Pitch Black', hex: '#121212' },
        ],
        sizes: ['XS', 'S', 'M', 'L', 'XL'],
        variants: [
          { sku: 'REG-PLAIN-WHT-M', color: 'Cloud White', colorHex: '#FFFFFF', size: 'M', price: 499, podVariantId: 'POD-REG-PLN-M' },
        ],
        tags: ['Plain', 'Regular Fit', 'Basic'],
        isFeatured: true,
        isBestSeller: true,
        isNewArrival: false,
        hsnCode: '61091000',
      },
      // REGULAR - CUSTOM DESIGN
      {
        name: 'Custom Printed Regular Fit Signature Tee',
        slug: 'custom-printed-regular-signature-tee',
        description: 'Upload your own custom design or artwork to print on our 180 GSM premium cotton regular fit tee.',
        price: 799,
        compareAtPrice: 1199,
        category: typographyCat._id,
        mainSection: 'Regular T-Shirts',
        subSection: 'Add Your Custom Designs',
        images: [
          { url: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80', altText: 'Custom Regular Tee' },
        ],
        colors: [
          { name: 'Pitch Black', hex: '#121212' },
        ],
        sizes: ['S', 'M', 'L', 'XL'],
        variants: [
          { sku: 'CUST-REG-M', color: 'Pitch Black', colorHex: '#121212', size: 'M', price: 799, podVariantId: 'POD-CUST-REG-M' },
        ],
        tags: ['Custom', 'Regular Fit', 'DIY Print'],
        isFeatured: true,
        isBestSeller: false,
        isNewArrival: true,
        hsnCode: '61091000',
      },
    ];

    await Product.insertMany(productsData);

    console.log('Creating Coupons...');
    await Coupon.create({
      code: 'WELCOME10',
      discountType: 'PERCENTAGE',
      discountValue: 10,
      minOrderValue: 499,
      maxDiscountAmount: 200,
      expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
      usageLimit: 1000,
    });

    await Coupon.create({
      code: 'STREET100',
      discountType: 'FIXED',
      discountValue: 100,
      minOrderValue: 999,
      expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
      usageLimit: 500,
    });

    console.log('\n==================================================');
    console.log('SEEDING COMPLETED SUCCESSFULLY!');
    console.log('Admin Account: admin@gtclothinghub.com / AdminPassword123!');
    console.log('Customer Account: customer@example.com / CustomerPassword123!');
    console.log('Coupons: WELCOME10, STREET100');
    console.log('==================================================\n');

    process.exit(0);
  } catch (error) {
    console.error('Seeding Error:', error);
    process.exit(1);
  }
};

seedData();
