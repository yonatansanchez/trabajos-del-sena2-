import { validationResult } from 'express-validator';
import { createOrder, listOrders, getOrderWithItems, updateOrderStatus } from '../models/orderModel.js';

export const getOrders = async (req, res, next) => {
  try {
    const orders = await listOrders({
      status: req.query.status,
      customerId: req.query.customerId,
      limit: Number(req.query.limit ?? 50),
      offset: Number(req.query.offset ?? 0)
    });
    return res.json({ data: orders });
  } catch (error) {
    return next(error);
  }
};

export const getOrder = async (req, res, next) => {
  try {
    const order = await getOrderWithItems(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Pedido no encontrado' });
    }
    return res.json(order);
  } catch (error) {
    return next(error);
  }
};

export const postOrder = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: 'Datos inválidos', details: errors.array() });
  }

  try {
    const order = await createOrder({
      customerId: req.body.customerId ?? req.user?.id,
      items: req.body.items,
      subtotal: req.body.subtotal,
      tax: req.body.tax,
      total: req.body.total,
      notes: req.body.notes
    });
    return res.status(201).json(order);
  } catch (error) {
    return next(error);
  }
};

export const patchOrderStatus = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: 'Datos inválidos', details: errors.array() });
  }

  try {
    const order = await updateOrderStatus(req.params.id, req.body.status);
    if (!order) {
      return res.status(404).json({ message: 'Pedido no encontrado' });
    }
    return res.json(order);
  } catch (error) {
    return next(error);
  }
};
