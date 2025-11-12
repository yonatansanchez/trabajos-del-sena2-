import { validationResult } from 'express-validator';
import { createUser, findByEmail, verifyPassword } from '../models/userModel.js';
import { generateToken } from '../utils/token.js';

export const register = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: 'Datos inválidos', details: errors.array() });
  }

  const { name, email, password } = req.body;

  try {
    const existing = await findByEmail(email);
    if (existing) {
      return res.status(409).json({ message: 'El correo ya está registrado' });
    }

    const user = await createUser({ name, email, password });
    const token = generateToken({ id: user.id, role: user.role });

    return res.status(201).json({ user, token });
  } catch (error) {
    return next(error);
  }
};

export const login = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: 'Datos inválidos', details: errors.array() });
  }

  const { email, password } = req.body;

  try {
    const user = await findByEmail(email);
    if (!user) {
      return res.status(401).json({ message: 'Credenciales incorrectas' });
    }

    const matches = await verifyPassword(password, user.password_hash);
    if (!matches) {
      return res.status(401).json({ message: 'Credenciales incorrectas' });
    }

    const token = generateToken({ id: user.id, role: user.role });
    delete user.password_hash;

    return res.json({ user, token });
  } catch (error) {
    return next(error);
  }
};
