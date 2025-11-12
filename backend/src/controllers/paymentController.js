import { validationResult } from 'express-validator';
import { createPaymentIntent, retrievePaymentIntent } from '../services/paymentService.js';
import { createPaymentRecord } from '../models/paymentModel.js';
import { updateOrderStatus } from '../models/orderModel.js';

export const postPaymentIntent = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: 'Datos inválidos', details: errors.array() });
  }

  try {
    const intent = await createPaymentIntent({
      amount: req.body.amount,
      currency: req.body.currency ?? 'cop',
      metadata: { orderId: req.body.orderId }
    });

    return res.status(201).json({ clientSecret: intent.client_secret, intentId: intent.id });
  } catch (error) {
    return next(error);
  }
};

export const postPaymentConfirmation = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: 'Datos inválidos', details: errors.array() });
  }

  const { orderId, paymentIntentId } = req.body;

  try {
    const intent = await retrievePaymentIntent(paymentIntentId);
    if (intent.status !== 'succeeded') {
      return res.status(400).json({ message: 'El pago no está confirmado' });
    }

    await createPaymentRecord({
      orderId,
      provider: 'stripe',
      providerPaymentId: intent.id,
      amount: intent.amount / 100,
      currency: intent.currency,
      status: intent.status
    });

    await updateOrderStatus(orderId, 'paid');

    return res.json({ message: 'Pago confirmado' });
  } catch (error) {
    return next(error);
  }
};
