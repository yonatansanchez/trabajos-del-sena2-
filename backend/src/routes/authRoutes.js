import { Router } from 'express';
import { body } from 'express-validator';
import { register, login } from '../controllers/authController.js';

const router = Router();

router.post(
  '/register',
  [
    body('name').isLength({ min: 2 }).withMessage('Nombre obligatorio'),
    body('email').isEmail().withMessage('Email inválido'),
    body('password').isLength({ min: 6 }).withMessage('Contraseña demasiado corta')
  ],
  register
);

router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Email inválido'),
    body('password').notEmpty().withMessage('Contraseña requerida')
  ],
  login
);

export default router;
