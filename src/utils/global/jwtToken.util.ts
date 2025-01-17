import jwt from 'jsonwebtoken';
import { JWT_SECRET, JWT_EXPIRY } from '../../config/env.config.js';

export const generateToken = (payload: any) => {

  if (!JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined');
  }
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRY });
};