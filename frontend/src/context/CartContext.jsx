import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem('cart');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState(null);

  useEffect(() => {
    try {
      localStorage.setItem('cart', JSON.stringify(cartItems));
    } catch (e) {
      console.error('Failed to save cart to localStorage', e);
    }
  }, [cartItems]);

  const addToCart = (product, color, size, quantity = 1) => {
    setCartItems((prevItems) => {
      const existingIndex = prevItems.findIndex(
        (item) =>
          item.product === product._id &&
          item.color.toLowerCase() === color.toLowerCase() &&
          item.size.toUpperCase() === size.toUpperCase()
      );

      if (existingIndex > -1) {
        const updated = [...prevItems];
        updated[existingIndex].quantity += quantity;
        return updated;
      }

      // Find variant details
      const matchedVariant = product.variants?.find(
        (v) => v.color.toLowerCase() === color.toLowerCase() && v.size.toUpperCase() === size.toUpperCase()
      );

      const price = matchedVariant ? matchedVariant.price : product.price;
      const sku = matchedVariant ? matchedVariant.sku : product.sku || `${product.slug}-${color}-${size}`;
      const podVariantId = matchedVariant ? matchedVariant.podVariantId : '';
      const image = product.images && product.images.length > 0 ? product.images[0].url : '';

      return [
        ...prevItems,
        {
          product: product._id,
          productId: product._id,
          name: product.name,
          slug: product.slug,
          image,
          color,
          size,
          price,
          sku,
          podVariantId,
          quantity,
        },
      ];
    });

    setIsCartOpen(true);
  };

  const removeFromCart = (productId, color, size) => {
    setCartItems((prev) =>
      prev.filter(
        (item) =>
          !(
            item.product === productId &&
            item.color.toLowerCase() === color.toLowerCase() &&
            item.size.toUpperCase() === size.toUpperCase()
          )
      )
    );
  };

  const updateQuantity = (productId, color, size, newQty) => {
    if (newQty < 1) return removeFromCart(productId, color, size);
    setCartItems((prev) =>
      prev.map((item) => {
        if (
          item.product === productId &&
          item.color.toLowerCase() === color.toLowerCase() &&
          item.size.toUpperCase() === size.toUpperCase()
        ) {
          return { ...item, quantity: newQty };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setCartItems([]);
    setAppliedCoupon(null);
    localStorage.removeItem('cart');
  };

  const totalItemCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const cartSubtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        isCartOpen,
        setIsCartOpen,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItemCount,
        cartSubtotal,
        appliedCoupon,
        setAppliedCoupon,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
