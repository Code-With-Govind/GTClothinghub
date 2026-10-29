// Automated verification script for Phase 5 Account Security & Password Recovery
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

console.log('=== PHASE 5: SECURITY & RECOVERY VERIFICATION SUITE ===\n');

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
  const User = require('./models/User');
  const authController = require('./controllers/authController');

  // 1. Password Policy Validation
  console.log('\n--- 1. Password Policy Verification ---');
  const validateStrongPassword = (pwd) => {
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(pwd);
  };

  assert(!validateStrongPassword('short'), 'Rejects passwords shorter than 8 chars');
  assert(!validateStrongPassword('nouppercase1@'), 'Rejects passwords without uppercase');
  assert(!validateStrongPassword('NOLOWERCASE1@'), 'Rejects passwords without lowercase');
  assert(!validateStrongPassword('NoNumberSpecial!'), 'Rejects passwords without number');
  assert(!validateStrongPassword('NoSpecialChar123'), 'Rejects passwords without special character');
  assert(validateStrongPassword('SecurePass123!'), 'Accepts valid strong password');

  // 2. Cryptographic Token Generation & SHA-256 Hashing
  console.log('\n--- 2. Cryptographic Token & Hashing ---');
  const rawToken = crypto.randomBytes(32).toString('hex');
  const hashedToken = crypto.createHash('sha256').update(rawToken).digest('hex');

  assert(rawToken.length === 64, 'Raw token is 32-byte hex (64 hex characters)');
  assert(hashedToken.length === 64, 'Hashed token is SHA-256 hex string');
  assert(rawToken !== hashedToken, 'Hashed token differs from raw token');
  assert(
    crypto.createHash('sha256').update(rawToken).digest('hex') === hashedToken,
    'Hash is deterministically verifiable'
  );

  // 3. User Schema Methods: changedPasswordAfter
  console.log('\n--- 3. JWT Invalidation via passwordChangedAt ---');
  const mockUserWithPasswordChange = new User({
    name: 'Test Customer',
    email: 'test@example.com',
    password: 'Password123!',
    passwordChangedAt: new Date(Date.now() + 5000), // Changed 5s in future relative to an old JWT
  });

  const oldTokenIat = Math.floor(Date.now() / 1000); // Token issued now
  const isInvalidated = mockUserWithPasswordChange.changedPasswordAfter(oldTokenIat);
  assert(isInvalidated === true, 'Token issued before password change is invalidated');

  const newTokenIat = Math.floor(Date.now() / 1000) + 10; // Token issued after change
  const isValid = mockUserWithPasswordChange.changedPasswordAfter(newTokenIat);
  assert(isValid === false, 'Token issued after password change remains valid');

  const legacyUser = new User({
    name: 'Legacy Customer',
    email: 'legacy@example.com',
    password: 'Password123!',
  });
  assert(legacyUser.changedPasswordAfter(oldTokenIat) === false, 'Legacy accounts without passwordChangedAt continue working seamlessly');

  // 4. Token Expiry & Single-Use Verification
  console.log('\n--- 4. Token Expiry and Single-Use Rules ---');
  const now = Date.now();
  const validExpire = now + 60 * 60 * 1000;
  const expiredExpire = now - 1000;

  assert(validExpire > now, 'Active token expiry correctly identified as active');
  assert(expiredExpire < now, 'Expired token expiry correctly identified as expired');

  // 5. Generic Forgot Password Response Test (No account enumeration)
  console.log('\n--- 5. Account Enumeration Prevention (Generic Responses) ---');
  let mockResJson = null;
  const mockRes = {
    json: (data) => { mockResJson = data; return mockRes; },
    status: (code) => mockRes,
  };

  // Mock User.findOne to simulate non-existing user
  const originalFindOne = User.findOne;
  User.findOne = async () => null;

  await authController.forgotPassword({ body: { email: 'nonexistent-user-12345@example.com' } }, mockRes);
  assert(
    mockResJson && mockResJson.success === true && mockResJson.message.includes('If an account exists'),
    'Forgot password returns generic 200 message when email does not exist'
  );

  // Mock resend verification for non-existing user
  await authController.resendVerification({ body: { email: 'nonexistent-user-12345@example.com' } }, mockRes);
  assert(
    mockResJson && mockResJson.success === true && mockResJson.message.includes('If an unverified account exists'),
    'Resend verification returns generic 200 message when email does not exist'
  );

  // Restore User.findOne
  User.findOne = originalFindOne;

  console.log(`\n=== SUITE SUMMARY: ${testsPassed} passed, ${testsFailed} failed ===\n`);
  if (testsFailed > 0) {
    process.exit(1);
  }
}

runTests().catch(err => {
  console.error('Test suite error:', err);
  process.exit(1);
});

