/**
 * Dynamic Tax Engine supporting PRE_REGISTRATION (Pre-GST) and GST_REGISTERED modes.
 */
class TaxService {
  /**
   * Calculates tax breakdown for an order.
   * @param {Object} params
   * @param {number} params.subtotal - Amount after discounts
   * @param {string} params.customerState - Shipping state of customer
   * @param {Object} params.settings - Store settings document
   * @returns {Object} Tax calculations and breakdown
   */
  calculateTax({ subtotal, customerState, settings }) {
    // 1. If in PRE_REGISTRATION mode, no tax is charged or claimed
    if (!settings || settings.businessMode === 'PRE_REGISTRATION') {
      return {
        businessMode: 'PRE_REGISTRATION',
        taxTotal: 0,
        cgst: 0,
        sgst: 0,
        igst: 0,
        ratePercentage: 0,
        hsnCode: '',
        displayText: 'Pre-GST Sale Receipt (No Tax Charged)',
      };
    }

    // 2. GST_REGISTERED mode
    const ratePercentage = settings.gstRatePercentage || 5;
    const storeState = (settings.address && settings.address.state) ? settings.address.state.trim().toLowerCase() : 'karnataka';
    const destinationState = customerState ? customerState.trim().toLowerCase() : storeState;
    const isSameState = storeState === destinationState;

    let taxTotal = 0;
    let cgst = 0;
    let sgst = 0;
    let igst = 0;

    if (settings.isTaxInclusive) {
      // Tax is embedded in product price: Tax Amount = Subtotal - (Subtotal / (1 + Rate/100))
      taxTotal = Math.round((subtotal - (subtotal / (1 + ratePercentage / 100))) * 100) / 100;
    } else {
      // Tax is added on top of subtotal: Tax Amount = Subtotal * (Rate/100)
      taxTotal = Math.round((subtotal * (ratePercentage / 100)) * 100) / 100;
    }

    if (isSameState) {
      // Intra-state sale -> CGST (50%) + SGST (50%)
      cgst = Math.round((taxTotal / 2) * 100) / 100;
      sgst = Math.round((taxTotal / 2) * 100) / 100;
    } else {
      // Inter-state sale -> IGST (100%)
      igst = taxTotal;
    }

    return {
      businessMode: 'GST_REGISTERED',
      taxTotal,
      cgst,
      sgst,
      igst,
      ratePercentage,
      hsnCode: '61091000',
      displayText: isSameState
        ? `CGST (${ratePercentage / 2}%) + SGST (${ratePercentage / 2}%)`
        : `IGST (${ratePercentage}%)`,
    };
  }
}

module.exports = new TaxService();
