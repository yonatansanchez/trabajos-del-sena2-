import { validationResult } from 'express-validator';
import { createMovement, listMovements } from '../models/inventoryModel.js';

export const getMovements = async (req, res, next) => {
  try {
    const movements = await listMovements({
      productId: req.query.productId,
      limit: Number(req.query.limit ?? 100),
      offset: Number(req.query.offset ?? 0)
    });
    return res.json({ data: movements });
  } catch (error) {
    return next(error);
  }
};

export const postMovement = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: 'Datos inválidos', details: errors.array() });
  }

  try {
    await createMovement({
      productId: req.body.productId,
      quantity: req.body.quantity,
      type: req.body.type,
      reference: req.body.reference,
      notes: req.body.notes,
      userId: req.user.id
    });
    return res.status(201).json({ message: 'Movimiento registrado' });
  } catch (error) {
    return next(error);
  }
};
