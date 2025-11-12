import jwt from 'jsonwebtoken';

export const generateToken = (payload, options = {}) => {
  const expiresIn = options.expiresIn ?? '12h';
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn });
};
