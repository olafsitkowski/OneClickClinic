import { getAvailableSlots } from '../controllers/analyticsController';
import router from './userRoutes';

/**
 * @swagger
 * /available-slots:
 *   get:
 *     tags:
 *       - Analytics
 *     description: Returns the number of available slots for the next 10 days
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: An object containing dates as keys and the number of available slots as values
 *         schema:
 *           type: object
 *           properties:
 *             date:
 *               type: string
 *               format: date
 *               description: The date for which the available slots are calculated
 *             availableSlots:
 *               type: integer
 *               description: The number of available slots for the date
 */
router.get('/available-slots', getAvailableSlots);

export default router;
