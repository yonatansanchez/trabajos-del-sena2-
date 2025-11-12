import { query, getClient } from '../config/db.js';

const MOVEMENT_FIELDS = `
  id,
  product_id AS "productId",
  quantity,
  type,
  reference,
  notes,
  created_by AS "createdBy",
  created_at AS "createdAt"
`;

export const createMovement = async ({ productId, quantity, type, reference, notes, userId }) => {
  const client = await getClient();
  try {
    await client.query('BEGIN');
    await client.query(
      `INSERT INTO inventory_movements (product_id, quantity, type, reference, notes, created_by)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [productId, quantity, type, reference, notes, userId]
    );

    const stockOperator = type === 'in' ? '+' : '-';
    await client.query(`UPDATE products SET stock = stock ${stockOperator} $1, updated_at = NOW() WHERE id = $2`, [quantity, productId]);

    await client.query('COMMIT');
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

export const listMovements = async ({ productId, limit = 100, offset = 0 }) => {
  const values = [limit, offset];
  const filters = [];

  if (productId) {
    filters.push('product_id = $3');
    values.push(productId);
  }

  const whereClause = filters.length ? `WHERE ${filters.join(' AND ')}` : '';
  const { rows } = await query(
    `SELECT ${MOVEMENT_FIELDS}
     FROM inventory_movements
     ${whereClause}
     ORDER BY created_at DESC
     LIMIT $1 OFFSET $2`,
    values
  );
  return rows;
};
