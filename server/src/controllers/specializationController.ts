import express from 'express';
import { getSpecializationList } from '../models/specializationModel';

export const getSpecializationsController = async (req: express.Request, res: express.Response) => {
    try {
        const specializations = await getSpecializationList();

        if (!specializations) {
            return res.sendStatus(404);
        }

        return res.status(200).json(specializations);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Server Error' });
    }
};