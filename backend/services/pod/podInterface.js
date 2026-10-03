/**
 * POD Service Interface contract
 */
class PODInterface {
  async submitFulfillmentOrder(order) {
    throw new Error('Method submitFulfillmentOrder must be implemented by concrete POD service.');
  }

  async getFulfillmentStatus(podOrderId) {
    throw new Error('Method getFulfillmentStatus must be implemented by concrete POD service.');
  }

  async cancelFulfillmentOrder(podOrderId) {
    throw new Error('Method cancelFulfillmentOrder must be implemented by concrete POD service.');
  }
}

module.exports = PODInterface;
