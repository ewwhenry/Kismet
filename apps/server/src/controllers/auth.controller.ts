import type { RequestHandler } from 'express';
import jwt from 'jsonwebtoken';
import ms from 'ms';
import { getUserByUsername, createUser, getUserByEmail } from '@repo/db';
import {
  createError,
  createSuccessResponse,
  ErrorCodes,
} from '../utils/responses.js';
import { CYPHER_KEY } from '../config.js';
import { isEmail } from '../utils/validators.js';
import { hashPassword, verifyPassword } from '../utils/crypting.js';

export const loginUser: RequestHandler = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Input validation
    if (!username || !password) {
      const error = createError({
        code: ErrorCodes.VALIDATION_ERROR,
        message: 'Username or email and password are required',
      });
      return res.status(error.status).json(error);
    }

    // Get user from database
    const user = isEmail(username)
      ? await getUserByEmail(username)
      : await getUserByUsername(username);
    if (!user) {
      const error = createError({
        code: ErrorCodes.UNAUTHORIZED,
        message: 'Invalid username or password',
      });
      return res.status(error.status).json(error);
    }

    // Verify password
    if (!verifyPassword(password, user.password)) {
      const error = createError({
        code: ErrorCodes.UNAUTHORIZED,
        message: 'Invalid username or password',
      });
      return res.status(error.status).json(error);
    }

    // Create JWT token here
    let jw_token = jwt.sign({ id: user.id }, CYPHER_KEY, {
      expiresIn: '30d',
    });

    let expiresIn = ms('30d');
    let expiresAt = Date.now() + expiresIn;

    delete (user as unknown as any).password;
    const userResponse = {
      access_token: jw_token,
      expires_at: expiresAt,
      expires_in: expiresIn,
      user,
    };

    res.json(createSuccessResponse(userResponse, 'Login successful', 200));
  } catch (error) {
    console.error('Login error:', error);
    const errorResponse = createError({
      code: ErrorCodes.INTERNAL_SERVER_ERROR,
      message: 'An error occurred during login',
    });
    res.status(errorResponse.status).json(errorResponse);
  }
};

export const registerUser: RequestHandler = async (req, res) => {
  try {
    const { username, email, password, name, bio } = req.body;

    // Input validation
    if (!username || !email || !password) {
      const error = createError({
        code: ErrorCodes.VALIDATION_ERROR,
        message: 'Username, email, and password are required',
      });
      return res.status(error.status).json(error);
    }

    // Check if user already exists
    const existingUser = await getUserByUsername(username);
    if (existingUser) {
      const error = createError({
        code: ErrorCodes.INTERNAL_SERVER_ERROR,
        message: 'Username already exists',
      });
      return res.status(error.status).json(error);
    }

    // Generate hashed password
    const hashedPassword = hashPassword(password);

    const newUserObject = {
      username,
      email,
      password: hashedPassword,
      name: name || username,
      bio: bio || 'No bio yet.',
    };

    // Create user in database
    const createdUser = await createUser(newUserObject);

    let jw_token = jwt.sign({ id: createdUser.id }, CYPHER_KEY, {
      expiresIn: '30d',
    });

    let expiresIn = ms('30d');
    let expiresAt = Date.now() + expiresIn;

    // Return user data without password, but with a access token to authenticate the user inmediatly.
    const userResponse = {
      access_token: jw_token,
      expires_at: expiresAt,
      expires_in: expiresIn,
      user: {
        id: createdUser.id,
        username: createdUser.username,
        email: createdUser.email,
        name: createdUser.name,
        bio: createdUser.bio,
      },
    };

    res
      .status(201)
      .json(
        createSuccessResponse(
          userResponse,
          'User registered successfully',
          201,
        ),
      );
  } catch (error: any) {
    console.error('Registration error:', error);

    if (error.code === 'P2002') {
      let errorResponse = createError({
        code: ErrorCodes.VALIDATION_ERROR,
        message: `The value of the following fields already exists in the database: ${error.meta.target}`,
      });

      res.status(errorResponse.status).json(errorResponse);
      return;
    }

    const errorResponse = createError({
      code: ErrorCodes.INTERNAL_SERVER_ERROR,
      message: 'An error occurred during registration',
    });
    res.status(errorResponse.status).json(errorResponse);
  }
};
