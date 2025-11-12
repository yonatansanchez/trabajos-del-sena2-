import { validationResult } from 'express-validator';
import {
  listProducts,
  findProductById,
  createProduct,
  updateProduct,
  deleteProduct
} from '../models/productModel.js';

export const getProducts = async (req, res, next) => {
  try {
    const products = await listProducts({
      search: req.query.search,
      category: req.query.category,
      limit: Number(req.query.limit ?? 50),
      offset: Number(req.query.offset ?? 0)
    });
    // La respuesta debe ser un array de productos directamente
    return res.json(products);
  } catch (error) {
    return next(error);
  }
};

export const getProduct = async (req, res, next) => {
  try {
    const product = await findProductById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }
    return res.json(product);
  } catch (error) {
    return next(error);
  }
};

export const postProduct = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: 'Datos inválidos', details: errors.array() });
  }

  try {
    const product = await createProduct(req.body);
    return res.status(201).json(product);
  } catch (error) {
    return next(error);
  }
};

export const putProduct = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: 'Datos inválidos', details: errors.array() });
  }

  try {
    const product = await updateProduct(req.params.id, req.body);
    if (!product) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }
    return res.json(product);
  } catch (error) {
    return next(error);
  }
};

export const removeProduct = async (req, res, next) => {
  try {
    await deleteProduct(req.params.id);
    return res.status(204).send();
  } catch (error) {
    return next(error);
  }
};
