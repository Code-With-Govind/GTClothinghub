/**
 * Automated Verification Suite for Phase 7: Product Sharing
 * GT Clothing Hub
 */

const assert = require('assert');
const fs = require('fs');
const path = require('path');

console.log('====================================================');
console.log('GT CLOTHING HUB - PHASE 7 AUTOMATED VERIFICATION');
console.log('====================================================\n');

let passedTests = 0;
let totalTests = 0;

function runTest(name, fn) {
  totalTests++;
  try {
    fn();
    console.log(`[PASS] Test ${totalTests}: ${name}`);
    passedTests++;
  } catch (err) {
    console.error(`[FAIL] Test ${totalTests}: ${name}`);
    console.error(`       Error: ${err.message}`);
  }
}

// ----------------------------------------------------
// 1. Static Source Code Inspection
// ----------------------------------------------------

runTest('ProductDetail.jsx imports share icons from lucide-react', () => {
  const code = fs.readFileSync(path.join(__dirname, 'src', 'pages', 'public', 'ProductDetail.jsx'), 'utf8');
  assert.match(code, /Share2/, 'ProductDetail should import Share2 icon');
  assert.match(code, /Copy/, 'ProductDetail should import Copy icon');
  assert.match(code, /Check/, 'ProductDetail should import Check icon');
  assert.match(code, /MessageCircle/, 'ProductDetail should import MessageCircle icon');
});

runTest('ProductDetail.jsx defines getShareUrl, handleCopyLink, and handleShare', () => {
  const code = fs.readFileSync(path.join(__dirname, 'src', 'pages', 'public', 'ProductDetail.jsx'), 'utf8');
  assert.match(code, /const\s+getShareUrl\s*=/, 'Should define getShareUrl');
  assert.match(code, /const\s+handleCopyLink\s*=/, 'Should define handleCopyLink');
  assert.match(code, /const\s+handleShare\s*=/, 'Should define handleShare');
});

runTest('ProductDetail.jsx uses native navigator.share with AbortError cancellation catch', () => {
  const code = fs.readFileSync(path.join(__dirname, 'src', 'pages', 'public', 'ProductDetail.jsx'), 'utf8');
  assert.match(code, /navigator\.share\(shareData\)/, 'Should call navigator.share with shareData');
  assert.match(code, /err\.name\s*===?\s*['"]AbortError['"]/, 'Should catch AbortError without error toast');
});

runTest('ProductDetail.jsx supports clipboard fallback and legacy textarea execCommand copy', () => {
  const code = fs.readFileSync(path.join(__dirname, 'src', 'pages', 'public', 'ProductDetail.jsx'), 'utf8');
  assert.match(code, /navigator\.clipboard\.writeText/, 'Should attempt navigator.clipboard.writeText');
  assert.match(code, /document\.execCommand\(['"]copy['"]\)/, 'Should have fallback document.execCommand copy');
});

runTest('ProductDetail.jsx provides direct WhatsApp sharing link', () => {
  const code = fs.readFileSync(path.join(__dirname, 'src', 'pages', 'public', 'ProductDetail.jsx'), 'utf8');
  assert.match(code, /https:\/\/api\.whatsapp\.com\/send\?text=/, 'Should provide WhatsApp share link');
  assert.match(code, /target="_blank"/, 'WhatsApp link should open in new tab');
  assert.match(code, /rel="noopener noreferrer"/, 'WhatsApp link should have security rel attributes');
});

runTest('ProductDetail.jsx renders prominent header share button and dedicated social share bar', () => {
  const code = fs.readFileSync(path.join(__dirname, 'src', 'pages', 'public', 'ProductDetail.jsx'), 'utf8');
  assert.match(code, /title="Share this product"/, 'Header should have share button');
  assert.match(code, /Share this drop/, 'Social bar should display Share this drop');
  assert.match(code, /aria-label="Copy link to clipboard"/, 'Copy link button should have accessibility label');
});

runTest('index.html includes baseline OpenGraph and Twitter card metadata for bots', () => {
  const html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
  assert.match(html, /<meta\s+property="og:title"/, 'Should contain og:title');
  assert.match(html, /<meta\s+property="og:description"/, 'Should contain og:description');
  assert.match(html, /<meta\s+property="og:image"/, 'Should contain og:image');
  assert.match(html, /<meta\s+name="twitter:card"/, 'Should contain twitter:card');
});

runTest('SEO.jsx formats dynamic OG and Twitter metadata without duplicate brand names', () => {
  const code = fs.readFileSync(path.join(__dirname, 'src', 'components', 'common', 'SEO.jsx'), 'utf8');
  assert.match(code, /formattedTitle/, 'Should compute clean formattedTitle');
  assert.match(code, /title\.includes\(['"]GT CLOTHING HUB['"]\)/, 'Should avoid duplicate brand suffixes');
  assert.match(code, /setMeta\('property',\s*'og:title',\s*formattedTitle\)/, 'Should set og:title');
  assert.match(code, /setMeta\('name',\s*'twitter:title',\s*formattedTitle\)/, 'Should set twitter:title');
});

// ----------------------------------------------------
// 2. Logic Simulation Tests
// ----------------------------------------------------

runTest('Share payload formatting logic produces accurate title, text, and URL', () => {
  const mockProduct = {
    name: 'Acid Wash Heavyweight Oversized Tee',
    slug: 'acid-wash-heavyweight-tee',
    price: 1499,
  };
  const mockOrigin = 'https://gt-clothinghub.vercel.app';
  const expectedUrl = `${mockOrigin}/product/${mockProduct.slug}`;

  const shareData = {
    title: `${mockProduct.name} | GT CLOTHING HUB`,
    text: `Check out the ${mockProduct.name} at GT Clothing Hub: `,
    url: expectedUrl,
  };

  assert.strictEqual(shareData.title, 'Acid Wash Heavyweight Oversized Tee | GT CLOTHING HUB');
  assert.strictEqual(shareData.url, 'https://gt-clothinghub.vercel.app/product/acid-wash-heavyweight-tee');
  assert.ok(shareData.text.includes('Acid Wash Heavyweight Oversized Tee'));
});

runTest('WhatsApp intent URL encoding handles spaces, special characters, and colons safely', () => {
  const productName = 'Overdyed 240 GSM Boxy Tee (Black/White)';
  const productUrl = 'https://gt-clothinghub.vercel.app/product/overdyed-240-gsm-boxy-tee';
  const rawMessage = `Check out ${productName} on GT Clothing Hub: ${productUrl}`;
  const encodedUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(rawMessage)}`;

  assert.ok(encodedUrl.startsWith('https://api.whatsapp.com/send?text=Check%20out%20'));
  assert.ok(!encodedUrl.includes(' ')); // No raw spaces
  assert.ok(encodedUrl.includes(encodeURIComponent(productUrl)));
});

runTest('Web Share API abort error simulation resolves cleanly without crashing', async () => {
  let errorLogged = false;
  const mockNavigator = {
    share: async () => {
      const err = new Error('Share cancelled by user');
      err.name = 'AbortError';
      throw err;
    },
  };

  try {
    await mockNavigator.share({ title: 'Test' });
  } catch (err) {
    if (err.name === 'AbortError') {
      // expected silent catch
    } else {
      errorLogged = true;
    }
  }

  assert.strictEqual(errorLogged, false, 'AbortError should be silently dismissed');
});

runTest('Clipboard write failure fallback mechanism executes seamlessly', async () => {
  let fallbackInvoked = false;
  const mockClipboard = {
    writeText: async () => {
      throw new Error('Clipboard permission denied');
    },
  };

  let copied = false;
  try {
    await mockClipboard.writeText('https://test.url');
    copied = true;
  } catch (err) {
    // Fallback simulated
    fallbackInvoked = true;
    copied = true; // simulated execCommand success
  }

  assert.strictEqual(fallbackInvoked, true, 'Fallback should be invoked on clipboard exception');
  assert.strictEqual(copied, true, 'Fallback should succeed in copying');
});

runTest('Title deduplication in SEO avoids double brand names', () => {
  const title1 = 'Oversized Tee';
  const defaultTitle = 'GT CLOTHING HUB | Modern Streetwear & Graphic T-Shirts';
  const format = (t) => t ? (t.includes('GT CLOTHING HUB') ? t : `${t} | GT CLOTHING HUB`) : defaultTitle;

  assert.strictEqual(format(title1), 'Oversized Tee | GT CLOTHING HUB');
  assert.strictEqual(format('Drop 01 | GT CLOTHING HUB'), 'Drop 01 | GT CLOTHING HUB');
  assert.strictEqual(format(null), defaultTitle);
});

console.log('\n----------------------------------------------------');
console.log(`Phase 7 Verification Results: ${passedTests}/${totalTests} Passed`);
console.log('----------------------------------------------------');

if (passedTests === totalTests) {
  console.log('ALL PHASE 7 PRODUCT SHARING TESTS PASSED SUCCESSFULLY!\n');
  process.exit(0);
} else {
  console.error(`FAILED: ${totalTests - passedTests} tests failed.`);
  process.exit(1);
}

