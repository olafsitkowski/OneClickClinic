import { random, authentication } from '../helpers/index';
import { createUser, getUserByAuthenticationEmail, getUserByEmail } from '../models/userModel';
import express from 'express';
import jwt from 'jsonwebtoken';

export const register = async (req: express.Request, res: express.Response) => {
    try {
        const { email, password, userName } = req.body;

        if (!email || !password || !userName) {
            return res.sendStatus(400);
        }

        const existingUser = await getUserByEmail(email);

        if (existingUser) {
            return res.sendStatus(400);
        }

        const salt = random();
        const user = await createUser({
            authentication: {
                email,
                salt,
                password: authentication(salt, password),
                userName
            }
        });

        return res.status(200).json(user).end();
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
};

export const login = async (req: express.Request, res: express.Response) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.sendStatus(400);
        }

        const user = await getUserByAuthenticationEmail(email);

        if (!user || !user.authentication || !user.authentication.salt || !user.authentication.password) {
            return res.sendStatus(401);
        }

        const isPasswordValid = authentication(user.authentication.salt, password) === user.authentication.password;

        if (!isPasswordValid) {
            return res.sendStatus(401);
        }

        const token = jwt.sign({ userId: user._id }, 'your-secret-key', { expiresIn: '1h' });

        return res.status(200).json({ user, token }).end();
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
};
