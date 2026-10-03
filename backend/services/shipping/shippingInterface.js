/**
 * Shipping Service Interface abstraction contract
 */
class ShippingInterface {
  async calculateShippingFee({ items, destinationState, pincode, subtotal, paymentMethod, settings }) {
    throw new Error('Method calculateShippingFee must be implemented by concrete shipping service.');
  }

  async trackShipment(trackingNumber, courier) {
    throw new Error('Method trackShipment must be implemented by concrete shipping service.');
  }
}

module.exports = ShippingInterface;
