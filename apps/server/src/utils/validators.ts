import { emailRegex } from '../constants/regex.js';

export const isEmail = (email: string) => emailRegex.test(email);
