import { query } from '../config/db.js';

const PRODUCT_FIELDS = `
  id,
  sku,
  name,
  description,
  category,
  unit,
  price,
  stock,
  image_url AS "imageUrl",
  reorder_level AS "reorderLevel",
  created_at AS "createdAt",
  updated_at AS "updatedAt"
`;

export const listProducts = async ({ search, category, limit = 50, offset = 0 }) => {
  const filters = [];
  const values = [];

  if (search) {
    values.push(`%${search.toLowerCase()}%`);
    filters.push(`(LOWER(name) LIKE $${values.length} OR LOWER(description) LIKE $${values.length})`);
  }

  if (category) {
    values.push(category);
    filters.push(`category = $${values.length}`);
  }

  values.push(limit);
  values.push(offset);

  const whereClause = filters.length ? `WHERE ${filters.join(' AND ')}` : '';
  const { rows } = await query(
    `SELECT ${PRODUCT_FIELDS} FROM products ${whereClause} ORDER BY created_at DESC LIMIT $${values.length - 1} OFFSET $${values.length}`,
    values
  );
  return rows;
};

export const findProductById = async (id) => {
  const { rows } = await query(`SELECT ${PRODUCT_FIELDS} FROM products WHERE id = $1`, [id]);
  return rows[0];
};

export const createProduct = async (product) => {
  const { rows } = await query(
    `INSERT INTO products (sku, name, description, category, unit, price, stock, reorder_level, image_url)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
     RETURNING ${PRODUCT_FIELDS}`,
    [
      product.sku,
      product.name,
      product.description,
      product.category,
      product.unit,
      product.price,
      product.stock,
      product.reorderLevel ?? 0,
      product.imageUrl
    ]
  );
  return rows[0];
};

export const updateProduct = async (id, product) => {
  const { rows } = await query(
    `UPDATE products
     SET sku = $2, name = $3, description = $4, category = $5, unit = $6, price = $7, stock = $8, reorder_level = $9, image_url = $10, updated_at = NOW()
     WHERE id = $1
     RETURNING ${PRODUCT_FIELDS}`,
    [
      id,
      product.sku,
      product.name,
      product.description,
      product.category,
      product.unit,
      product.price,
      product.stock,
      product.reorderLevel ?? 0,
      product.imageUrl
    ]
  );
  return rows[0];
};

export const deleteProduct = async (id) => {
  await query('DELETE FROM products WHERE id = $1', [id]);
};
