import { Router } from 'express';
import { body } from 'express-validator';
import { getMovements, postMovement } from '../controllers/inventoryController.js';
import { authenticate, requireRole } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/', authenticate, requireRole(['admin', 'manager']), getMovements);

router.post(
  '/',
  authenticate,
  requireRole(['admin', 'manager']),
  [
    body('productId').isInt({ gt: 0 }).withMessage('Producto inválido'),
    body('quantity').isFloat({ gt: 0 }).withMessage('Cantidad inválida'),
    body('type').isIn(['in', 'out']).withMessage('Tipo inválido')
  ],
  postMovement
);

export default router;
