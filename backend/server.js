const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const connectDB = require('./config/db');
const checkProductionSafety = require('./middleware/productionGuard');
const { apiLimiter } = require('./middleware/rateLimiterMiddleware');
const errorHandler = require('./middleware/errorMiddleware');

// Load environment variables
dotenv.config();

// Run Production Safety Check before startup
checkProductionSafety();

// Connect Database
connectDB();

const app = express();

// Security Headers
app.use(helmet());

// CORS Configuration
const allowedOrigins = process.env.FRONTEND_URL
  ? [process.env.FRONTEND_URL, 'http://localhost:5173', 'http://localhost:3000']
  : ['http://localhost:5173', 'http://localhost:3000'];

app.use(
  cors({
    origin: (origin, callback) => {
      // allow requests with no origin (like mobile apps, curl, or webhooks)
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(null, true); // Dev flexible fallback
    },
    credentials: true,
  })
);

// Apply General Rate Limiter
app.use('/api/', apiLimiter);

// Special raw body buffer requirement for Razorpay Webhook Signature verification
app.use('/api/payments/webhook', express.raw({ type: 'application/json' }));

// JSON & URL Body Parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Mount Health Check Endpoint
app.use('/health', require('./routes/healthRoutes'));

// Mount API Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/categories', require('./routes/categoryRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/cart', require('./routes/orderRoutes'));
app.use('/api/payments', require('./routes/paymentRoutes'));
app.use('/api/coupons', require('./routes/couponRoutes'));
app.use('/api/reviews', require('./routes/reviewRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/pod', require('./routes/podRoutes'));
app.use('/api/settings', require('./routes/settingsRoutes'));

// Global Centralized Error Handling Middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`\n==================================================`);
  console.log(`[POD E-Commerce Server Running]: Port ${PORT}`);
  console.log(`[API Base URL]: http://localhost:${PORT}/api`);
  console.log(`[Health Endpoint]: http://localhost:${PORT}/health`);
  console.log(`==================================================\n`);
});

// Handle Unhandled Promise Rejections
process.on('unhandledRejection', (err) => {
  console.error(`[Unhandled Promise Rejection]: ${err.message}`);
  // Keep server running or gracefully shut down if critical
});
