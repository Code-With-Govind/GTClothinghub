import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Lock, AlertTriangle } from 'lucide-react';
import SEO from '../../components/common/SEO';
import AddressForm from '../../components/checkout/AddressForm';
import OrderSummary from '../../components/checkout/OrderSummary';
import PaymentSelector from '../../components/checkout/PaymentSelector';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useSettings } from '../../context/SettingsContext';
import api from '../../services/api';

export default function CheckoutPage() {
  const { cartItems, clearCart } = useCart();
  const { user } = useAuth();
  const { settings } = useSettings();
  const navigate = useNavigate();

  const [shippingAddress, setShippingAddress] = useState({
    fullName: user ? user.name : '',
    email: user ? user.email : '',
    phone: user ? user.phone || '' : '',
    street: '',
    city: '',
    state: 'Karnataka',
    pincode: '',
    country: 'India',
  });

  const [paymentMethod, setPaymentMethod] = useState('RAZORPAY');
  const [couponInput, setCouponInput] = useState('');
  const [couponMessage, setCouponMessage] = useState('');
  const [couponError, setCouponError] = useState('');

  const [cartData, setCartData] = useState(null);
  const [loadingCart, setLoadingCart] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Validate cart server-side
  const validateCartServer = async (appliedCode = '') => {
    if (cartItems.length === 0) return;
    setLoadingCart(true);
    try {
      const res = await api.post('/cart/validate', {
        items: cartItems,
        couponCode: appliedCode || couponInput,
        shippingAddress,
        paymentMethod,
      });
      setCartData(res.cart);
    } catch (err) {
      setErrorMessage(err.message);
    } finally {
      setLoadingCart(false);
    }
  };

  useEffect(() => {
    if (cartItems.length === 0) {
      navigate('/cart');
    } else {
      validateCartServer();
    }
  }, [cartItems, paymentMethod]);

  const handleAddressChange = (field, value) => {
    setShippingAddress((prev) => ({ ...prev, [field]: value }));
  };

  const handleApplyCoupon = async () => {
    setCouponError('');
    setCouponMessage('');
    if (!couponInput.trim()) return;

    try {
      const res = await api.post('/coupons/validate', {
        code: couponInput,
        cartSubtotal: cartData?.subtotal || 0,
      });
      setCouponMessage(`Coupon ${res.coupon.code} applied! Saved ₹${res.coupon.discountAmount}`);
      validateCartServer(res.coupon.code);
    } catch (err) {
      setCouponError(err.message);
    }
  };

  // Submit Order Process
  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSubmitting(true);

    try {
      // 1. Create Order Server-Side
      const orderRes = await api.post('/orders', {
        items: cartItems,
        shippingAddress,
        paymentMethod,
        couponCode: cartData?.couponCode || '',
      });

      const order = orderRes.order;

      // 2. Handle COD Order
      if (paymentMethod === 'COD') {
        clearCart();
        navigate(`/order-success?orderNumber=${order.orderNumber}&trackingToken=${order.trackingToken}`);
        return;
      }

      // 3. Handle Razorpay Online Order
      const razorpayOrder = orderRes.razorpayOrder;
      const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_your_key_id';

      if (razorpayOrder.isMock || !window.Razorpay) {
        console.log('[Checkout]: Simulating Sandbox Razorpay Success');
        await api.post('/payments/verify', {
          razorpayOrderId: razorpayOrder.id,
          razorpayPaymentId: `pay_mock_${Date.now()}`,
          razorpaySignature: 'mock_signature',
          orderId: order._id,
        });

        clearCart();
        navigate(`/order-success?orderNumber=${order.orderNumber}&trackingToken=${order.trackingToken}`);
        return;
      }

      const options = {
        key: razorpayKey,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        name: settings.brandName || 'GT CLOTHING HUB',
        description: `Order #${order.orderNumber}`,
        order_id: razorpayOrder.id,
        handler: async (response) => {
          try {
            await api.post('/payments/verify', {
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
              orderId: order._id,
            });

            clearCart();
            navigate(`/order-success?orderNumber=${order.orderNumber}&trackingToken=${order.trackingToken}`);
          } catch (verErr) {
            setErrorMessage(`Payment verification failed: ${verErr.message}`);
          }
        },
        prefill: {
          name: shippingAddress.fullName,
          email: shippingAddress.email,
          contact: shippingAddress.phone,
        },
        theme: {
          color: '#292621',
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (resp) {
        setErrorMessage(`Payment failed: ${resp.error.description}`);
      });
      rzp.open();

    } catch (err) {
      setErrorMessage(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8 bg-[#F5F1E8]">
      <SEO title="Secure Checkout | GT CLOTHING HUB" />

      <div className="border-b border-[#DDD7CB] pb-6 flex items-center justify-between">
        <div>
          <span className="text-[10px] font-mono font-bold text-[#6F6A61] uppercase tracking-widest block">
            CHECKOUT STEP
          </span>
          <h1 className="text-3xl font-extrabold uppercase text-[#292621] font-display">COMPLETE YOUR ORDER</h1>
        </div>
        <div className="flex items-center gap-2 text-xs font-bold text-[#292621] bg-white border border-[#DDD7CB] px-3.5 py-1.5 font-mono shadow-fashion-sm">
          <ShieldCheck className="w-4 h-4 text-[#B89452]" /> 256-BIT SSL ENCRYPTED
        </div>
      </div>

      {errorMessage && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-700 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600" /> {errorMessage}
        </div>
      )}

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left: Address & Payment Method */}
        <div className="lg:col-span-2 space-y-8 bg-white border border-[#DDD7CB] p-6 sm:p-8 shadow-fashion-sm">
          <AddressForm address={shippingAddress} onChange={handleAddressChange} />
          
          <div className="pt-6 border-t border-[#DDD7CB]">
            <PaymentSelector
              paymentMethod={paymentMethod}
              onSelectMethod={setPaymentMethod}
              codEnabled={settings.codEnabled}
            />
          </div>

          <button
            type="submit"
            disabled={submitting || loadingCart}
            className="btn-primary w-full py-4 text-xs font-extrabold tracking-widest"
          >
            {submitting ? 'PROCESSING ORDER...' : `PLACE ORDER (${paymentMethod === 'COD' ? 'CASH ON DELIVERY' : 'ONLINE PAYMENT'})`}
          </button>
        </div>

        {/* Right: Order Summary */}
        <div>
          <OrderSummary
            cartData={cartData}
            couponInput={couponInput}
            setCouponInput={setCouponInput}
            onApplyCoupon={handleApplyCoupon}
            couponMessage={couponMessage}
            couponError={couponError}
          />
        </div>

      </form>
    </div>
  );
}

