import { createUser, deleteUserById, getUserById, updateUserById } from './../models/userModel';
import express from 'express';
import { getUsers } from '../models/userModel';
import { generateUniqueId } from '../services/idGeneratorService';

export const getAllUsersController = async (req: express.Request, res: express.Response) => {
    try {
        const users = await getUsers();

        if (!users) {
            return res.sendStatus(404);
        }

        return res.status(200).json(users);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Server Error' });
    }
};

export const getUserByIdController = async (req: express.Request, res: express.Response) => {
    try {
        const user = await getUserById(Number(req.params.id));

        if (!user) {
            return res.sendStatus(404);
        }

        return res.status(200).json(user);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Server Error' });
    }
};

export const deleteUserByIdController = async (req: express.Request, res: express.Response) => {
    try {
        const user = await deleteUserById(req.params.id);

        if (!user) {
            return res.sendStatus(404);
        }

        return res.status(200).json(user);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Server Error' });
    }
};

export const addUserController = async (req: express.Request, res: express.Response) => {
    if (!req.body || Object.keys(req.body).length === 0) {
        return res.status(400).json({ message: 'No data provided' });
    }

    try {
        const uniqueId = await generateUniqueId();

        const user = await createUser({ id: uniqueId, ...req.body });

        if (!user) {
            return res.sendStatus(404);
        }

        return res.status(200).json(user);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Server Error' });
    }
};

export const updateUserByIdController = async (req: express.Request, res: express.Response) => {
    if (!req.body || Object.keys(req.body).length === 0) {
        return res.status(400).json({ message: 'No data provided' });
    }

    try {
        const user = await updateUserById(req.params.id, req.body);

        if (!user) {
            return res.sendStatus(404);
        }

        return res.status(200).json(user);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Server Error' });
    }
};
