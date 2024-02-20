import { login, register } from '../controllers/authenticationController';
import express from 'express';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Authentication
 */

/**
 * @swagger
 *   /register:
 *     post:
 *       tags: [Authentication]
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 email:
 *                   type: string
 *                 password:
 *                   type: string
 *                 username:
 *                   type: string
 *       responses:
 *         200:
 *           description: Successful registration
 *         400:
 *           description: Bad request (missing parameters)
 *         409:
 *           description: Conflict (user already exists)
 */
router.post('/register', register);

/**
 * @swagger
 *   /login:
 *     post:
 *       tags: [Authentication]
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 email:
 *                   type: string
 *                 password:
 *                   type: string
 *       responses:
 *         200:
 *           description: Successful login
 *         400:
 *           description: Bad request (missing parameters)
 *         401:
 *           description: Unauthorized (invalid credentials)
 */
router.post('/login', login);

export default router;
