import { query } from '../config/db.js';

const PAYMENT_FIELDS = `
  id,
  order_id AS "orderId",
  provider,
  provider_payment_id AS "providerPaymentId",
  amount,
  currency,
  status,
  created_at AS "createdAt"
`;

export const createPaymentRecord = async ({ orderId, provider, providerPaymentId, amount, currency, status }) => {
  const { rows } = await query(
    `INSERT INTO payments (order_id, provider, provider_payment_id, amount, currency, status)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING ${PAYMENT_FIELDS}`,
    [orderId, provider, providerPaymentId, amount, currency, status]
  );
  return rows[0];
};

export const listPaymentsForOrder = async (orderId) => {
  const { rows } = await query(`SELECT ${PAYMENT_FIELDS} FROM payments WHERE order_id = $1 ORDER BY created_at DESC`, [orderId]);
  return rows;
};
