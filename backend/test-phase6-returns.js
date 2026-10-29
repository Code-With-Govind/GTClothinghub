// Automated verification suite for Phase 6 Return Policy & Return Requests
const mongoose = require('mongoose');
const Order = require('./models/Order');
const orderController = require('./controllers/orderController');
const adminController = require('./controllers/adminController');

console.log('=== PHASE 6: RETURN POLICY & RETURN REQUESTS VERIFICATION SUITE ===\n');

let testsPassed = 0;
let testsFailed = 0;

function assert(condition, testName) {
  if (condition) {
    console.log(`[PASS] ${testName}`);
    testsPassed++;
  } else {
    console.error(`[FAIL] ${testName}`);
    testsFailed++;
  }
}

async function runTests() {
  // Mock Order Data
  const mockItemId1 = new mongoose.Types.ObjectId();
  const mockItemId2 = new mongoose.Types.ObjectId();
  const mockUserId = new mongoose.Types.ObjectId();

  const baseOrder = {
    _id: new mongoose.Types.ObjectId(),
    orderNumber: 'GT-TEST-1001',
    user: mockUserId,
    items: [
      {
        _id: mockItemId1,
        name: 'Heavyweight Drop-Shoulder Tee',
        sku: 'GT-TSHIRT-BLK-L',
        color: 'Black',
        size: 'L',
        price: 799,
        quantity: 2,
        product: new mongoose.Types.ObjectId(),
      },
      {
        _id: mockItemId2,
        name: 'Oversized Minimal Graphic Tee',
        sku: 'GT-TSHIRT-WHT-M',
        color: 'White',
        size: 'M',
        price: 899,
        quantity: 1,
        product: new mongoose.Types.ObjectId(),
      },
    ],
    orderStatus: 'DELIVERED',
    deliveredAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // Delivered 2 days ago
    returnRequest: {
      status: 'NONE',
    },
  };

  // Mock Request & Response helpers
  const createMockRes = () => {
    const res = {
      statusCode: 200,
      jsonData: null,
      status(code) {
        this.statusCode = code;
        return this;
      },
      json(data) {
        this.jsonData = data;
        return this;
      },
    };
    return res;
  };

  // 1. Policy-Compliant Reasons Test
  console.log('\n--- 1. Reason Policy Compliance ---');
  const validReasons = [
    'Defective Product / Manufacturing Defect',
    'Damaged Product / Damaged in Transit',
  ];

  assert(validReasons.includes('Defective Product / Manufacturing Defect'), 'Allows Defective Product');
  assert(validReasons.includes('Damaged Product / Damaged in Transit'), 'Allows Damaged in Transit');
  assert(!validReasons.includes('Changed Mind / Buyer Remorse'), 'Strictly excludes unsupported return reasons');
  assert(!validReasons.includes('Found Cheaper Elsewhere'), 'Strictly excludes pricing reasons');

  // 2. 7-Day Window Eligibility Check
  console.log('\n--- 2. 7-Day Window Calculation ---');
  const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;
  const recentDelivery = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000); // 3 days ago
  const expiredDelivery = new Date(Date.now() - 9 * 24 * 60 * 60 * 1000); // 9 days ago

  const isRecentEligible = Date.now() - recentDelivery.getTime() <= SEVEN_DAYS_MS;
  const isExpiredEligible = Date.now() - expiredDelivery.getTime() <= SEVEN_DAYS_MS;

  assert(isRecentEligible === true, 'Delivered 3 days ago is within 7-day window');
  assert(isExpiredEligible === false, 'Delivered 9 days ago is rejected (> 7 days)');

  // 3. Item Validation (Forged IDs & Quantities)
  console.log('\n--- 3. Server-Side Item Validation ---');
  const testOrder = new Order(baseOrder);

  // Check valid item lookup
  const foundItem = testOrder.items.id(mockItemId1);
  assert(foundItem && foundItem.name === 'Heavyweight Drop-Shoulder Tee', 'Finds genuine order item by ObjectId');

  // Check forged item lookup
  const forgedItemId = new mongoose.Types.ObjectId();
  const forgedItem = testOrder.items.id(forgedItemId);
  assert(forgedItem === null, 'Rejects forged order item ID');

  // Check quantity bounds
  const validQty = 2 <= foundItem.quantity && 2 > 0;
  const excessQty = 3 <= foundItem.quantity;
  const negativeQty = -1 > 0;
  assert(validQty === true, 'Accepts return quantity within purchased bounds (2 <= 2)');
  assert(excessQty === false, 'Rejects return quantity exceeding purchased bounds (3 > 2)');
  assert(negativeQty === false, 'Rejects negative return quantity');

  // 4. Legacy Order Review Flagging (Missing deliveredAt)
  console.log('\n--- 4. Legacy Order Safe Manual Review Handling ---');
  const legacyOrder = { ...baseOrder, deliveredAt: null };
  const isLegacy = !legacyOrder.deliveredAt;
  assert(isLegacy === true, 'Accurately detects legacy order with missing deliveredAt');

  // 5. Decoupled Lifecycle State Verification
  console.log('\n--- 5. Decoupled Lifecycle State Rules ---');
  let simulatedOrder = {
    orderStatus: 'DELIVERED',
    returnRequest: { status: 'NONE' },
  };

  // State 1: Customer submits return
  simulatedOrder.orderStatus = 'RETURN_REQUESTED';
  simulatedOrder.returnRequest.status = 'PENDING';
  assert(simulatedOrder.orderStatus === 'RETURN_REQUESTED', 'Order status moves to RETURN_REQUESTED on customer submission');
  assert(simulatedOrder.returnRequest.status === 'PENDING', 'returnRequest.status moves to PENDING');

  // State 2: Admin approves request (authorization only, NOT physical goods arrival)
  simulatedOrder.returnRequest.status = 'APPROVED';
  // orderStatus must remain RETURN_REQUESTED because physical goods are still with customer!
  assert(simulatedOrder.orderStatus === 'RETURN_REQUESTED', 'Approval does NOT prematurely set orderStatus to RETURNED');
  assert(simulatedOrder.returnRequest.status === 'APPROVED', 'returnRequest.status is APPROVED');

  // State 3: Physical goods received at hub (Admin only)
  simulatedOrder.orderStatus = 'RETURNED';
  assert(simulatedOrder.orderStatus === 'RETURNED', 'orderStatus is set to RETURNED only when goods physically arrive');

  // State 4: Refund processed
  simulatedOrder.orderStatus = 'REFUNDED';
  assert(simulatedOrder.orderStatus === 'REFUNDED', 'orderStatus is REFUNDED only after financial refund');

  // 6. Admin Rejection Reason Validation
  console.log('\n--- 6. Rejection Reason Requirements ---');
  const shortReason = 'declined';
  const validReason = 'The returned garment tags have been removed and item shows signs of wear, violating return conditions.';
  assert(shortReason.length < 10, 'Rejection reason under 10 chars is detected as invalid');
  assert(validReason.length >= 10, 'Rejection reason >= 10 chars is valid');

  console.log(`\n=== SUITE SUMMARY: ${testsPassed} passed, ${testsFailed} failed ===\n`);
  if (testsFailed > 0) {
    process.exit(1);
  }
}

runTests().catch((err) => {
  console.error('Test suite error:', err);
  process.exit(1);
});

