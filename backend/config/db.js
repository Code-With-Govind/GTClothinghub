const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/pod_ecommerce';
    const conn = await mongoose.connect(mongoUri);
    console.log(`[MongoDB Connected]: ${conn.connection.host}`);

    // Auto seed initial products if database is newly connected and empty
    setTimeout(async () => {
      try {
        const Product = require('../models/Product');
        const count = await Product.countDocuments();
        if (count === 0) {
          console.log('[Auto Seed]: Database is empty. Seeding initial streetwear products...');
          const Category = require('../models/Category');

          const category = await Category.create({
            name: 'Oversized Streetwear',
            slug: 'oversized-streetwear',
            description: '240 GSM heavy cotton streetwear drop shoulder boxy tees.',
            image: { url: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800&auto=format&fit=crop&q=80' }
          });

          await Product.create([
            {
              name: 'GT Cyberpunk Tokyo Heavyweight Oversized Tee',
              slug: 'gt-cyberpunk-tokyo-oversized-tee',
              description: '240 GSM 100% Super Combed Premium Cotton. Featuring vibrant back cyber-graphic print.',
              price: 899,
              compareAtPrice: 1499,
              category: category._id,
              mainSection: 'Oversized T-Shirts',
              subSection: 'Printed T-Shirts',
              images: [
                { url: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800&auto=format&fit=crop&q=80' },
                { url: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80' }
              ],
              colors: [{ name: 'Pitch Black', hex: '#121212' }],
              sizes: ['S', 'M', 'L', 'XL', 'XXL'],
              isFeatured: true,
              isNewArrival: true,
              isBestSeller: true,
              status: 'ACTIVE'
            },
            {
              name: 'Essential Pitch Black Heavyweight Oversized Plain Tee',
              slug: 'essential-black-oversized-plain-tee',
              description: '240 GSM ultra-clean plain boxy silhouette streetwear tee.',
              price: 699,
              compareAtPrice: 1099,
              category: category._id,
              mainSection: 'Oversized T-Shirts',
              subSection: 'Plain T-Shirts',
              images: [
                { url: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80' }
              ],
              colors: [{ name: 'Pitch Black', hex: '#121212' }],
              sizes: ['S', 'M', 'L', 'XL', 'XXL'],
              isFeatured: true,
              isNewArrival: true,
              isBestSeller: true,
              status: 'ACTIVE'
            },
            {
              name: 'Heavy Fleece Drop Shoulder Hoodie',
              slug: 'heavy-fleece-drop-shoulder-hoodie',
              description: '350 GSM premium cotton fleece hoodie with drop shoulder aesthetic.',
              price: 999,
              compareAtPrice: 1999,
              category: category._id,
              mainSection: 'Regular T-Shirts',
              subSection: 'Printed T-Shirts',
              images: [
                { url: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=800&auto=format&fit=crop&q=80' }
              ],
              colors: [{ name: 'Charcoal Black', hex: '#222222' }],
              sizes: ['M', 'L', 'XL'],
              isFeatured: true,
              isNewArrival: true,
              isBestSeller: true,
              status: 'ACTIVE'
            },
            {
              name: 'Classic White Everyday Regular Fit Plain Tee',
              slug: 'classic-white-regular-plain-tee',
              description: '180 GSM 100% Super Combed Cotton classic round neck plain white t-shirt.',
              price: 499,
              compareAtPrice: 799,
              category: category._id,
              mainSection: 'Regular T-Shirts',
              subSection: 'Plain T-Shirts',
              images: [
                { url: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=800&auto=format&fit=crop&q=80' }
              ],
              colors: [{ name: 'Cloud White', hex: '#FFFFFF' }],
              sizes: ['S', 'M', 'L', 'XL'],
              isFeatured: true,
              isNewArrival: true,
              isBestSeller: true,
              status: 'ACTIVE'
            }
          ]);
          console.log('[Auto Seed]: Initial streetwear products created successfully!');
        }
      } catch (err) {
        console.warn('[Auto Seed Warning]:', err.message);
      }
    }, 2000);
  } catch (error) {
    console.error(`[Database Connection Error]: ${error.message}`);
  }
};

module.exports = connectDB;

