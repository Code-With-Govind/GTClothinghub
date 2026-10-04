const Product = require('../models/Product');
const Category = require('../models/Category');

// @desc    Get all products (with pagination, filters, sorting, search)
// @route   GET /api/products
// @access  Public
exports.getProducts = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 12;
    const skip = (page - 1) * limit;

    const query = { status: 'ACTIVE' };

    // Search query
    if (req.query.search) {
      query.$or = [
        { name: { $regex: req.query.search, $options: 'i' } },
        { description: { $regex: req.query.search, $options: 'i' } },
        { tags: { $in: [new RegExp(req.query.search, 'i')] } },
      ];
    }

    // Category filter
    if (req.query.category) {
      const categoryObj = await Category.findOne({ slug: req.query.category });
      if (categoryObj) {
        query.category = categoryObj._id;
      }
    }

    // Main Section filter (Regular T-Shirts / Oversized T-Shirts)
    if (req.query.mainSection) {
      query.mainSection = req.query.mainSection;
    }

    // Sub Section filter (Plain T-Shirts / Printed T-Shirts / Add Your Custom Designs)
    if (req.query.subSection) {
      query.subSection = req.query.subSection;
    }

    // Flag filters
    if (req.query.isFeatured === 'true') query.isFeatured = true;
    if (req.query.isBestSeller === 'true') query.isBestSeller = true;
    if (req.query.isNewArrival === 'true') query.isNewArrival = true;

    // Price Filter
    if (req.query.minPrice || req.query.maxPrice) {
      query.price = {};
      if (req.query.minPrice) query.price.$gte = Number(req.query.minPrice);
      if (req.query.maxPrice) query.price.$lte = Number(req.query.maxPrice);
    }

    // Size Filter
    if (req.query.size) {
      query.sizes = req.query.size;
    }

    // Color Filter
    if (req.query.color) {
      query['colors.name'] = { $regex: req.query.color, $options: 'i' };
    }

    // Sorting
    let sort = { createdAt: -1 };
    if (req.query.sort === 'price-low-high') sort = { price: 1 };
    if (req.query.sort === 'price-high-low') sort = { price: -1 };
    if (req.query.sort === 'popular') sort = { numReviews: -1, averageRating: -1 };

    const total = await Product.countDocuments(query);
    const products = await Product.find(query)
      .populate('category', 'name slug')
      .sort(sort)
      .skip(skip)
      .limit(limit);

    res.json({
      success: true,
      count: products.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      products,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single product by slug or ID
// @route   GET /api/products/:slugOrId
// @access  Public
exports.getProductBySlugOrId = async (req, res) => {
  try {
    const { slugOrId } = req.params;
    let product;

    if (slugOrId.match(/^[0-9a-fA-F]{24}$/)) {
      product = await Product.findById(slugOrId).populate('category', 'name slug');
    } else {
      product = await Product.findOne({ slug: slugOrId }).populate('category', 'name slug');
    }

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    res.json({ success: true, product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create product (Admin)
// @route   POST /api/products
// @access  Private/Admin
exports.createProduct = async (req, res) => {
  try {
    const { name, slug, description, price, compareAtPrice, category, mainSection, subSection, images, colors, sizes, variants, flags, tags, podProductId, hsnCode, seoTitle, seoDescription } = req.body;

    const finalSlug = slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    const product = await Product.create({
      name,
      slug: finalSlug,
      description,
      price,
      compareAtPrice: compareAtPrice || 0,
      category,
      mainSection: mainSection || 'Regular T-Shirts',
      subSection: subSection || 'Printed T-Shirts',
      images: images || [],
      colors: colors || [],
      sizes: sizes || [],
      variants: variants || [],
      tags: tags || [],
      isFeatured: flags?.isFeatured !== undefined ? flags.isFeatured : true,
      isBestSeller: flags?.isBestSeller !== undefined ? flags.isBestSeller : true,
      isNewArrival: flags?.isNewArrival !== undefined ? flags.isNewArrival : true,
      status: 'ACTIVE',
      podProductId: podProductId || '',
      hsnCode: hsnCode || '61091000',
      seoTitle: seoTitle || name,
      seoDescription: seoDescription || (description ? description.substring(0, 160) : name),
    });


    res.status(201).json({ success: true, product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update product (Admin)
// @route   PUT /api/products/:id
// @access  Private/Admin
exports.updateProduct = async (req, res) => {
  try {
    let product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.json({ success: true, product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete product (Admin)
// @route   DELETE /api/products/:id
// @access  Private/Admin
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    await product.deleteOne();
    res.json({ success: true, message: 'Product removed' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
