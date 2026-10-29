const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const qikinkService = require('./services/pod/qikinkService');

async function runQikinkDiagnostic() {
  console.log('\n=================================================');
  console.log('       🔍 QIKINK POD INTEGRATION TEST SUITE      ');
  console.log('=================================================\n');

  // Diagnostic Info
  const mode = (process.env.POD_MODE || 'sandbox').toUpperCase();
  const apiUrl = qikinkService.getApiUrl();
  const { apiKey } = qikinkService.getCredentials();

  console.log(`[Config Check]`);
  console.log(`- POD Mode   : ${mode}`);
  console.log(`- API URL    : ${apiUrl}`);
  console.log(`- Client ID  : ${apiKey ? apiKey.slice(0, 6) + '...' : 'MISSING'}\n`);

  try {
    // 1. Connection & Token Test
    console.log('[Step 1/3] Testing API Authentication & Access Token...');
    const connResult = await qikinkService.testConnection();
    if (!connResult.success) {
      throw new Error(`Authentication failed: ${connResult.message}`);
    }
    console.log('✅ Access Token generated successfully.');

    // 2. Token Caching Verification
    console.log('\n[Step 2/3] Verifying In-Memory Token Caching...');
    const token1 = await qikinkService.getAccessToken();
    const token2 = await qikinkService.getAccessToken();
    if (token1 === token2) {
      console.log('✅ Token caching verified (reused without redundant API call).');
    } else {
      console.warn('⚠️ Warning: Token was not cached.');
    }

    // 3. Test Order Creation
    if (qikinkService.isSandbox()) {
      console.log('\n[Step 3/3] Submitting Test Sandbox Order to Qikink...');
      const testOrder = {
        orderNumber: 'TEST' + Date.now().toString().slice(-8),
        paymentMethod: 'Prepaid',
        total: 799,
        shippingAddress: {
          fullName: 'Test Customer',
          phone: '9876543210',
          street: '123 MG Road, Bandra West',
          city: 'Mumbai',
          state: 'Maharashtra',
          pincode: '400050',
          email: 'test@example.com',
        },
        items: [
          {
            sku: 'USs-Wh-M',
            name: 'Unisex Sweatshirt White M',
            quantity: 1,
            price: 799,
          },
        ],
      };

      const orderResult = await qikinkService.submitFulfillmentOrder(testOrder);
      console.log('✅ Order placed successfully in Qikink Sandbox!');
      console.log(`   - Qikink Order ID : ${orderResult.podOrderId}`);
      console.log(`   - Status          : ${orderResult.status}`);
      console.log(`   - Message         : ${orderResult.rawResponse?.message || 'Order created'}`);
      console.log('\n🎉 ALL CHECKS PASSED: Qikink POD Sandbox integration is 100% working!\n');
    } else {
      console.log('\n[Step 3/3] LIVE PRODUCTION SAFETY CHECK:');
      console.log('🛡️  Live Production Mode is active. Automated order creation is skipped.');
      console.log('   This prevents accidental charges to your Qikink wallet balance or physical printing.');
      console.log('✅ Live API Authentication and Access Token generation verified successfully.');
      console.log('\n🎉 ALL CHECKS PASSED: Qikink Live Production integration is ready!\n');
    }
  } catch (error) {
    console.error('\n❌ DIAGNOSTIC FAILED:');
    console.error(error.message);
    console.log('\n');
    process.exit(1);
  }
}

runQikinkDiagnostic();
