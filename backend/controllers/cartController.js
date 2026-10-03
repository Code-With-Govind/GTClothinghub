const Product = require('../models/Product');
const Coupon = require('../models/Coupon');
const Settings = require('../models/Settings');
const taxService = require('../services/tax/taxService');
const shippingService = require('../services/shipping/index');

// @desc    Validate cart items and calculate server-side totals
// @route   POST /api/cart/validate
// @access  Public
exports.validateCart = async (req, res) => {
  try {
    const { items, couponCode, shippingAddress, paymentMethod } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, message: 'Cart is empty' });
    }

    const settings = (await Settings.findOne()) || {};
    const validatedItems = [];
    let subtotal = 0;

    for (const item of items) {
      const product = await Product.findById(item.productId || item.product);
      if (!product || product.status !== 'ACTIVE') {
        return res.status(400).json({
          success: false,
          message: `Product '${item.name || item.productId}' is no longer available.`,
        });
      }

      // Find matching variant
      let matchedVariant = product.variants.find(
        (v) => v.color.toLowerCase() === item.color.toLowerCase() && v.size.toUpperCase() === item.size.toUpperCase() && v.isActive
      );

      const price = matchedVariant ? matchedVariant.price : product.price;
      const sku = matchedVariant ? matchedVariant.sku : product.sku || `${product.slug}-${item.color}-${item.size}`;
      const podVariantId = matchedVariant ? matchedVariant.podVariantId : '';
      const image = product.images && product.images.length > 0 ? product.images[0].url : '';

      const itemTotal = price * item.quantity;
      subtotal += itemTotal;

      validatedItems.push({
        product: product._id,
        name: product.name,
        image,
        sku,
        color: item.color,
        size: item.size,
        price,
        quantity: item.quantity,
        variantId: matchedVariant ? matchedVariant._id : '',
        podVariantId,
        itemTotal,
      });
    }

    // Process Coupon Discount
    let discount = 0;
    let validCoupon = null;

    if (couponCode) {
      validCoupon = await Coupon.findOne({
        code: couponCode.toUpperCase(),
        isActive: true,
        expiryDate: { $gt: new Date() },
      });

      if (validCoupon) {
        if (subtotal >= validCoupon.minOrderValue) {
          if (validCoupon.discountType === 'PERCENTAGE') {
            discount = (subtotal * validCoupon.discountValue) / 100;
            if (validCoupon.maxDiscountAmount > 0 && discount > validCoupon.maxDiscountAmount) {
              discount = validCoupon.maxDiscountAmount;
            }
          } else if (validCoupon.discountType === 'FIXED') {
            discount = validCoupon.discountValue;
          }
          discount = Math.min(discount, subtotal);
        }
      }
    }

    const netSubtotal = subtotal - discount;

    // Calculate Tax using dynamic TaxEngine
    const customerState = shippingAddress ? shippingAddress.state : 'Karnataka';
    const taxCalculation = taxService.calculateTax({
      subtotal: netSubtotal,
      customerState,
      settings,
    });

    // Calculate Shipping using dynamic ShippingService
    const shippingCalculation = await shippingService.calculateShippingFee({
      items: validatedItems,
      destinationState: customerState,
      pincode: shippingAddress ? shippingAddress.pincode : '',
      subtotal: netSubtotal,
      paymentMethod: paymentMethod || 'RAZORPAY',
      settings,
    });

    const total = netSubtotal + taxCalculation.taxTotal + shippingCalculation.totalShippingCost;

    res.json({
      success: true,
      cart: {
        items: validatedItems,
        subtotal,
        discount,
        couponCode: validCoupon ? validCoupon.code : '',
        netSubtotal,
        tax: taxCalculation.taxTotal,
        taxBreakdown: taxCalculation,
        shipping: shippingCalculation.totalShippingCost,
        shippingBreakdown: shippingCalculation,
        total: Math.round(total * 100) / 100,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
