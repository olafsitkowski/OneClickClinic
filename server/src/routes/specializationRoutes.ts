import express from 'express';
import { getSpecializationsController } from '../controllers/specializationController';

const router = express.Router();

router.get('/specialization', getSpecializationsController);

export default router;
