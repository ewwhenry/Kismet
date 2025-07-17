import { createHmac, timingSafeEqual } from 'crypto';
import { CYPHER_KEY } from '../config.js';

// Helper function to hash passwords securely
export const hashPassword = (password: string): string => {
  return createHmac('sha256', CYPHER_KEY).update(password).digest('hex');
};

// Helper function to verify passwords
export const verifyPassword = (password: string, hash: string): boolean => {
  const expectedHash = hashPassword(password);
  const actualHash = Buffer.from(hash, 'hex');
  const expected = Buffer.from(expectedHash, 'hex');

  if (actualHash.length !== expected.length) {
    return false;
  }

  return timingSafeEqual(actualHash, expected);
};
