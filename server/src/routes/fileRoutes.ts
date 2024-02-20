import express from 'express';
import { uploadFileHandler, getFileByIdHandler, downloadFileByIdHandler, getFilesByUserIdHandler } from '../controllers/fileController';
import multer from 'multer';

const upload = multer({ dest: 'uploads/' });
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Files
 */

/**
 * @swagger
 * tags:
 *   name: Files
 */

/**
 * @swagger
 * /files/{userId}:
 *   post:
 *     tags: [Files]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: The file to upload.
 *     responses:
 *       200:
 *         description: File uploaded successfully
 *       400:
 *         description: No file uploaded
 *       500:
 *         description: Error uploading file
 */
router.post('/files/:userId', upload.single('file'), uploadFileHandler);

/**
 * @swagger
 * /files/{fileId}:
 *   get:
 *     tags: [Files]
 *     parameters:
 *       - in: path
 *         name: fileId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: The file
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/File'
 *       404:
 *         description: File not found
 *       500:
 *         description: Error retrieving file
 */
router.get('/files/:fileId', getFileByIdHandler);

/**
 * @swagger
 * /files/download/{fileId}:
 *   get:
 *     tags: [Files]
 *     parameters:
 *       - in: path
 *         name: fileId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: File downloaded successfully
 *       404:
 *         description: File not found
 *       500:
 *         description: Error downloading file
 */
router.get('/files/download/:fileId', downloadFileByIdHandler);

/**
 * @swagger
 * /files/user/{userId}:
 *   get:
 *     tags: [Files]
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: The user ID
 *     responses:
 *       200:
 *         description: A list of files
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/File'
 *       404:
 *         description: No files found for this user
 *       500:
 *         description: Error retrieving files
 */
router.get('/files/user/:userId', getFilesByUserIdHandler);

export default router;
