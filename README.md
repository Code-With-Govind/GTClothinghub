# Production-Ready Print-on-Demand (POD) T-Shirt E-Commerce Platform

A real, production-ready, full-stack Print-on-Demand (POD) T-shirt e-commerce platform built with React 18, Vite, Tailwind CSS, Express.js, MongoDB Atlas, Razorpay payments, and abstracted POD fulfillment services.

Designed for real business operations, supporting both early-stage **`PRE_REGISTRATION`** (Pre-GST) and **`GST_REGISTERED`** tax compliance modes.

---

## 1. Features Overview

- **Business Compliance Engine**: Configurable `PRE_REGISTRATION` mode (issues valid non-tax sale receipts without illegally claiming GSTIN or charging GST) and `GST_REGISTERED` mode (issues HSN-compliant Tax Invoices with CGST/SGST/IGST splitting).
- **Server-Side Security**: Frontend prices and totals are never trusted. All totals, discounts, taxes, and shipping fees are calculated server-side from MongoDB records.
- **Razorpay Integration**: Server-side order creation, HMAC-SHA256 signature verification, and idempotent Webhook event handling with `WebhookEvent` tracking.
- **POD Fulfillment Abstraction**: `podService.js` defaults to `mockPodService.js` for sandbox development and seamlessly switches to live providers (such as Qikink) via `POD_MODE=live`.
- **Guest Order Tracking Security**: Requires Order Number + high-entropy `trackingToken` to view order details, preventing public PII order scraping.
- **COD & RTO Operations**: Complete tracking for Cash on Delivery orders, delivery attempts, and Return To Origin (RTO) statuses.
- **Admin Security & Audit Logging**: `AdminAuditLog` records admin actions. `productionGuard.js` prevents server startup if live production credentials are missing.

---

## 2. Technology Stack

- **Frontend**: React 18, Vite, Tailwind CSS, React Router v6, Axios, Lucide Icons.
- **Backend**: Node.js, Express.js, Mongoose (MongoDB), JWT, bcryptjs, Helmet, CORS, Rate Limiters.
- **Integrations**: Razorpay SDK, Qikink POD API (Abstracted), Cloudinary Storage, Nodemailer.

---

## 3. Directory Structure

```
POD/
├── backend/
│   ├── config/ (db.js, razorpay.js, cloudinary.js)
│   ├── controllers/ (auth, product, order, payment, pod, settings...)
│   ├── middleware/ (auth, error, rateLimiter, productionGuard, idempotency)
│   ├── models/ (User, Product, Order, Settings, WebhookEvent, AdminAuditLog...)
│   ├── routes/ (authRoutes, productRoutes, paymentRoutes, healthRoutes...)
│   ├── services/
│   │   ├── tax/ (taxService.js)
│   │   ├── shipping/ (mockShippingService.js, liveShippingService.js)
│   │   ├── invoice/ (invoiceService.js)
│   │   ├── payment/ (paymentService.js)
│   │   ├── email/ (emailService.js)
│   │   └── pod/ (mockPodService.js, qikinkService.js)
│   ├── seeders/ (seed.js)
│   ├── .env.example
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── components/ (common, product, cart, checkout, admin)
│   │   ├── context/ (AuthContext, CartContext, SettingsContext)
│   │   ├── pages/ (public, user, admin)
│   │   ├── services/ (api.js)
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── vercel.json
└── README.md
```

---

## 4. Local Installation & Development Setup

### Prerequisites
- Node.js (v18+)
- MongoDB (Running locally or MongoDB Atlas Connection String)

### Backend Setup
1. Open terminal in the `backend/` directory:
   ```bash
   cd backend
   npm install
   ```
2. Create `.env` file from `.env.example`:
   ```bash
   cp .env.example .env
   ```
3. Seed Database with initial streetwear products, categories, coupons, and Admin account:
   ```bash
   npm run seed
   ```
4. Start Backend Development Server:
   ```bash
   npm run dev
   ```
   *Backend will run on `http://localhost:5000`.*

### Frontend Setup
1. Open a new terminal in the `frontend/` directory:
   ```bash
   cd frontend
   npm install
   ```
2. Start Vite Development Server:
   ```bash
   npm run dev
   ```
   *Frontend will run on `http://localhost:5173`.*

---

## 5. Seed Accounts & Credentials

After running `npm run seed`:
- **Admin Account**: `admin@gtclothinghub.com` | Password: `AdminPassword123!`
- **Customer Account**: `customer@example.com` | Password: `CustomerPassword123!`
- **Coupons**: `WELCOME10` (10% Off), `STREET100` (₹100 Off)

---

## 6. Environment Variables Guide

| Variable | Description | Default / Dev Value |
|---|---|---|
| `NODE_ENV` | Mode (`development` or `production`) | `development` |
| `PORT` | Backend API Server Port | `5000` |
| `MONGODB_URI` | MongoDB Atlas Connection URI | `mongodb://localhost:27017/pod_ecommerce` |
| `JWT_SECRET` | Secret key for signing JWT tokens | `min_32_char_secret` |
| `RAZORPAY_MODE` | Payment Gateway Mode (`test` or `live`) | `test` |
| `RAZORPAY_KEY_ID` | Razorpay Key ID | `rzp_test_...` |
| `RAZORPAY_KEY_SECRET` | Razorpay Key Secret | `your_secret` |
| `RAZORPAY_WEBHOOK_SECRET` | Webhook Secret Key | `your_webhook_secret` |
| `POD_MODE` | Fulfillment Mode (`mock` or `live`) | `mock` |
| `POD_API_KEY` | Qikink / POD API Key | `your_pod_key` |
| `POD_API_SECRET` | Qikink / POD API Secret | `your_pod_secret` |
| `EMAIL_MODE` | Email Mode (`development` or `production`) | `development` |

---

## 7. Deployment Instructions

### Frontend (Vercel)
1. Push `frontend/` to GitHub repository.
2. Import project into Vercel dashboard.
3. Build Command: `npm run build` | Output Directory: `dist`.
4. Environment Variables: Set `VITE_API_URL` to your live Backend URL (e.g. `https://your-api.onrender.com/api`).

### Backend (Render / Railway)
1. Push `backend/` to GitHub repository.
2. Create Web Service on Render / Railway.
3. Build Command: `npm install` | Start Command: `node server.js`.
4. Add all production environment variables (`MONGODB_URI`, `JWT_SECRET`, `RAZORPAY_MODE=live`, `POD_MODE=live`, etc.).

---

## 8. Webhook Configuration (Razorpay)

1. Log in to Razorpay Dashboard -> Settings -> Webhooks.
2. Add Webhook URL: `https://your-api.onrender.com/api/payments/webhook`.
3. Secret: Set matching `RAZORPAY_WEBHOOK_SECRET` environment variable.
4. Active Events: Select `payment.captured`, `payment.failed`, `order.paid`.

---

## 9. Pre-Launch Checklist

- [ ] Adult / Business Legal Owner confirmed
- [ ] Bank Account & Razorpay KYC verified
- [ ] Domain configured & HTTPS enabled
- [ ] Terms, Privacy, Shipping, and Return policies published
- [ ] Tested complete sandbox order flow
- [ ] Verified `WebhookEvent` idempotency (duplicate triggers blocked)
- [ ] Reviewed GST compliance status before switching `businessMode` to `GST_REGISTERED`
