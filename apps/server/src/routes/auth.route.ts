import { Router } from 'express';
import { loginUser, registerUser } from '../controllers/auth.controller.js';

const auth: Router = Router();

auth.post('/signup', registerUser);
auth.post('/login', loginUser);

export default auth;
