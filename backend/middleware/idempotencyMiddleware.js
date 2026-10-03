const WebhookEvent = require('../models/WebhookEvent');

/**
 * Checks if a webhook eventId has already been processed to prevent duplicate processing.
 */
const checkWebhookIdempotency = async (req, res, next) => {
  const eventId = req.headers['x-razorpay-event-id'] || req.body?.event_id || req.body?.payload?.payment?.entity?.id;

  if (!eventId) {
    return next();
  }

  try {
    const existingEvent = await WebhookEvent.findOne({ eventId });

    if (existingEvent && existingEvent.processingStatus === 'PROCESSED') {
      console.log(`[Idempotency]: Webhook event ${eventId} already processed. Returning HTTP 200.`);
      return res.status(200).json({
        success: true,
        message: 'Webhook event already processed (idempotent)',
        eventId,
      });
    }

    if (!existingEvent) {
      await WebhookEvent.create({
        eventId,
        eventType: req.body?.event || 'UNKNOWN',
        processingStatus: 'RECEIVED',
        payload: req.body,
      });
    }

    req.webhookEventId = eventId;
    next();
  } catch (err) {
    console.error('[Idempotency Error]:', err.message);
    next();
  }
};

module.exports = checkWebhookIdempotency;
