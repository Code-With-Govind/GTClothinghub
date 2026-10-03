const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

router.get('/', (req, res) => {
  res.json({
    status: 'HEALTHY',
    service: 'POD E-Commerce Backend API',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

router.get('/db', (req, res) => {
  const dbState = mongoose.connection.readyState;
  const states = {
    0: 'DISCONNECTED',
    1: 'CONNECTED',
    2: 'CONNECTING',
    3: 'DISCONNECTING',
  };

  res.json({
    status: dbState === 1 ? 'HEALTHY' : 'UNHEALTHY',
    database: states[dbState] || 'UNKNOWN',
    timestamp: new Date().toISOString(),
  });
});

module.exports = router;
