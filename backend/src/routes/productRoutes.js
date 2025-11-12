import { Router } from 'express';
import { body } from 'express-validator';
import {
  getProducts,
  getProduct,
  postProduct,
  putProduct,
  removeProduct
} from '../controllers/productController.js';
import { authenticate, requireRole } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/', getProducts);
router.get('/:id', getProduct);

const productValidators = [
  body('sku').notEmpty().withMessage('SKU requerido'),
  body('name').isLength({ min: 3 }).withMessage('Nombre demasiado corto'),
  body('price').isFloat({ gt: 0 }).withMessage('Precio inválido'),
  body('stock').isFloat({ min: 0 }).withMessage('Stock inválido')
];

router.post('/', authenticate, requireRole(['admin', 'manager']), productValidators, postProduct);
router.put('/:id', authenticate, requireRole(['admin', 'manager']), productValidators, putProduct);
router.delete('/:id', authenticate, requireRole(['admin']), removeProduct);

export default router;
