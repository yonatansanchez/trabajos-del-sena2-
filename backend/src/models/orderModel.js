import { getClient, query } from '../config/db.js';

const ORDER_FIELDS = `
  id,
  customer_id AS "customerId",
  status,
  subtotal,
  tax,
  total,
  notes,
  created_at AS "createdAt",
  updated_at AS "updatedAt"
`;

const ITEM_FIELDS = `
  id,
  order_id AS "orderId",
  product_id AS "productId",
  quantity,
  unit_price AS "unitPrice",
  line_total AS "lineTotal"
`;

export const createOrder = async ({ customerId, items, subtotal, tax, total, notes }) => {
  const client = await getClient();

  try {
    await client.query('BEGIN');
    const orderInsert = await client.query(
      `INSERT INTO orders (customer_id, status, subtotal, tax, total, notes)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING ${ORDER_FIELDS}`,
      [customerId, 'pending', subtotal, tax, total, notes]
    );

    const order = orderInsert.rows[0];
    const itemValues = [];
    const values = [];

    items.forEach((item, index) => {
      const base = index * 5;
      values.push(order.id, item.productId, item.quantity, item.unitPrice, item.lineTotal);
      itemValues.push(`($${base + 1}, $${base + 2}, $${base + 3}, $${base + 4}, $${base + 5})`);
    });

    if (itemValues.length) {
      await client.query(
        `INSERT INTO order_items (order_id, product_id, quantity, unit_price, line_total)
         VALUES ${itemValues.join(',')}`,
        values
      );
    }

    await client.query('COMMIT');
    return order;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

export const listOrders = async ({ status, customerId, limit = 50, offset = 0 }) => {
  const filters = [];
  const values = [];

  if (status) {
    values.push(status);
    filters.push(`status = $${values.length}`);
  }

  if (customerId) {
    values.push(customerId);
    filters.push(`customer_id = $${values.length}`);
  }

  values.push(limit, offset);

  const whereClause = filters.length ? `WHERE ${filters.join(' AND ')}` : '';
  const { rows } = await query(
    `SELECT ${ORDER_FIELDS}
     FROM orders
     ${whereClause}
     ORDER BY created_at DESC
     LIMIT $${values.length - 1} OFFSET $${values.length}`,
    values
  );
  return rows;
};

export const getOrderWithItems = async (orderId) => {
  const orderRes = await query(`SELECT ${ORDER_FIELDS} FROM orders WHERE id = $1`, [orderId]);
  if (!orderRes.rows[0]) {
    return null;
  }
  const itemsRes = await query(`SELECT ${ITEM_FIELDS} FROM order_items WHERE order_id = $1`, [orderId]);
  return { ...orderRes.rows[0], items: itemsRes.rows };
};

export const updateOrderStatus = async (orderId, status) => {
  const { rows } = await query(
    `UPDATE orders SET status = $2, updated_at = NOW() WHERE id = $1 RETURNING ${ORDER_FIELDS}`,
    [orderId, status]
  );
  return rows[0];
};
