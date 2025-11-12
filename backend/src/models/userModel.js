import bcrypt from 'bcrypt';
import { query } from '../config/db.js';

const USER_FIELDS = 'id, name, email, role, created_at AS "createdAt"';

export const findByEmail = async (email) => {
  const { rows } = await query(`SELECT ${USER_FIELDS}, password_hash FROM users WHERE email = $1`, [email]);
  return rows[0];
};

export const createUser = async ({ name, email, password, role = 'customer' }) => {
  const passwordHash = await bcrypt.hash(password, Number(process.env.PASSWORD_ROUNDS ?? 10));
  const { rows } = await query(
    `INSERT INTO users (name, email, password_hash, role)
     VALUES ($1, $2, $3, $4)
     RETURNING ${USER_FIELDS}`,
    [name, email, passwordHash, role]
  );
  return rows[0];
};

export const verifyPassword = async (password, passwordHash) => bcrypt.compare(password, passwordHash);

export const findById = async (id) => {
  const { rows } = await query(`SELECT ${USER_FIELDS} FROM users WHERE id = $1`, [id]);
  return rows[0];
};
