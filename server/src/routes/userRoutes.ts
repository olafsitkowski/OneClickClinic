import express from 'express';
import { addUserController, deleteUserByIdController, getAllUsersController, getUserByIdController, updateUserByIdController } from '../controllers/userController';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: User
 */

/**
 * @swagger
 * /user:
 *   get:
 *     tags: 
 *       - User
 *     responses:
 *       200:
 *         description: OK
 *       404:
 *         description: Not Found
 *       500:
 *         description: Server Error
 */

router.get('/user', getAllUsersController);

/**
 * @swagger
 * /user/{id}:
 *   get:
 *     tags: 
 *       - User
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The user id
 *     responses:
 *       200:
 *         description: The user description by id
 *       404:
 *         description: User not found
 *       500:
 *         description: Server Error
 */
router.get('/user/:id', getUserByIdController);

//delete user by id

/**
 * @swagger
 * /user/{id}:
 *   delete:
 *     tags: 
 *       - User
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The user id
 *     responses:
 *       200:
 *         description: The user description by id
 *       404:
 *         description: User not found
 *       500:
 *         description: Server Error
 */
router.delete('/user/:id', deleteUserByIdController);

/**
 * @swagger
 * /user:
 *   post:
 *     tags:
 *       - User
 *     description: Creates a new user
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: user
 *         description: User object
 *         in: body
 *         required: true
 *         schema:
 *           $ref: '#/definitions/User'
 *     responses:
 *       200:
 *         description: Successfully created
 * definitions:
 *   User:
 *     type: object
 *     properties:
 *       profile:
 *         type: object
 *         properties:
 *           role:
 *             type: string
 *           name:
 *             type: string
 *           surname:
 *             type: string
 *           bloodGroup:
 *             type: string
 *           phoneNumber:
 *             type: string
 *           gender:
 *             type: string
 *           address:
 *             type: string
 *           treatment:
 *             type: string
 *           pesel:
 *             type: string
 *           contactEmail:
 *             type: string
 */
router.post('/user', addUserController)


/**
 * @swagger
 * /user/{id}:
 *   put:
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The user ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/definitions/User'
 *     responses:
 *       200:
 *         description: The user was updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/definitions/User'
 *       400:
 *         description: Some error happened
 */
router.put('/user/:id', updateUserByIdController);

export default router;
