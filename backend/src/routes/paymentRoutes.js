import { Router } from 'express';
import { body } from 'express-validator';
import { authenticate } from '../middleware/authMiddleware.js';
import { postPaymentIntent, postPaymentConfirmation } from '../controllers/paymentController.js';

const router = Router();

router.post(
  '/intent',
  authenticate,
  [body('amount').isInt({ gt: 0 }).withMessage('Monto inválido'), body('orderId').isInt({ gt: 0 }).withMessage('Pedido inválido')],
  postPaymentIntent
);

router.post(
  '/confirm',
  authenticate,
  [
    body('orderId').isInt({ gt: 0 }).withMessage('Pedido inválido'),
    body('paymentIntentId').notEmpty().withMessage('PaymentIntent requerido')
  ],
  postPaymentConfirmation
);

export default router;
