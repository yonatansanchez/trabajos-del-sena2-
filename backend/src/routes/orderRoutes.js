import { Router } from 'express';
import { body } from 'express-validator';
import { authenticate, requireRole } from '../middleware/authMiddleware.js';
import { getOrders, getOrder, postOrder, patchOrderStatus } from '../controllers/orderController.js';

const router = Router();

router.get('/', authenticate, requireRole(['admin', 'manager']), getOrders);
router.get('/:id', authenticate, getOrder);

router.post(
  '/',
  authenticate,
  [
    body('items').isArray({ min: 1 }).withMessage('Se requiere al menos un producto'),
    body('items.*.productId').isInt({ gt: 0 }).withMessage('Producto inválido'),
    body('items.*.quantity').isFloat({ gt: 0 }).withMessage('Cantidad inválida'),
    body('items.*.unitPrice').isFloat({ gt: 0 }).withMessage('Precio inválido'),
    body('subtotal').isFloat({ gt: 0 }).withMessage('Subtotal inválido'),
    body('total').isFloat({ gt: 0 }).withMessage('Total inválido')
  ],
  postOrder
);

router.patch(
  '/:id/status',
  authenticate,
  requireRole(['admin', 'manager']),
  [body('status').isIn(['pending', 'paid', 'cancelled', 'shipped']).withMessage('Estado inválido')],
  patchOrderStatus
);

export default router;
