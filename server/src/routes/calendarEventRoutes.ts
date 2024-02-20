import express from 'express';
import { getAllEvents, getEventById, createEvent, deleteEvent, getEventsByUserId, getCurrentEvents, editEventById } from '../controllers/calendarEventController';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Calendar Events
 */

/**
 * @swagger
 * /calendar-events:
 *   get:
 *     tags: [Calendar Events]
 *     responses:
 *       200:
 *         description: OK
 */

router.get('/calendar-events', getAllEvents);

/**
 * @swagger
 * /calendar-events/{id}:
 *   get:
 *     tags: [Calendar Events]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the event to retrieve.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: OK
 *       404:
 *         description: Event not found.
 */

router.get('/calendar-events/:id', getEventById);

/**
 * @swagger
 * /calendar-events:
 *   post:
 *     tags: [Calendar Events]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               start:
 *                 type: string
 *                 format: date-time
 *               end:
 *                 type: string
 *                 format: date-time
 *               patientId:
 *                 type: string
 *               employeeId:
 *                 type: string
 *               type:
 *                 type: string
 *     responses:
 *       201:
 *         description: Event has been created.
 *       400:
 *         description: Invalid request data.
 *       500:
 *         description: Server error.
 */

router.post('/calendar-events', createEvent);

/**
 * @swagger
 * /calendar-events/{id}:
 *   delete:
 *     tags: [Calendar Events]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the event to delete.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Event has been deleted.
 *       404:
 *         description: Event not found.
 *       500:
 *         description: Server error.
 */

router.delete('/calendar-events/:id', deleteEvent);

/**
 * @swagger
 * /calendar-events/user/{userId}:
 *   get:
 *     tags: [Calendar Events]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         description: ID of the user to filter events.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: OK
 *       404:
 *         description: User or event not found.
 */

router.get('/calendar-events/user/:userId', getEventsByUserId);

/**
 * @swagger
 * /current-events:
 *   get:
 *     tags: [Calendar Events]
 *     responses:
 *       200:
 *         description: OK
 */
router.get('/current-events', getCurrentEvents);

/**
 * @swagger
 * /calendar-events/{id}:
 *   put:
 *     tags: [Calendar Events]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The event ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CalendarEvent'
 *     responses:
 *       200:
 *         description: The updated event
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CalendarEvent'
 *       404:
 *         description: The event was not found
 *       500:
 *         description: There was a server error
 */
router.put('/calendar-events/:id', editEventById);

export default router;
