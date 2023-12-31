import { UserModel } from './../models/userModel';
import express, { Request, Response } from 'express';
import FileModel from '../models/fileModel';
import path from 'path';
import fs from 'fs';

export const savePdfToUserProfile = express.Router();

export const uploadFileHandler = async (req: Request, res: Response) => {
    const file = req.file;
    const userId = req.params.userId;
    if (!file) {
        return res.status(400).send({ message: 'No file uploaded.' });
    }
    try {
        const newFile = new FileModel({
            fileName: file.filename,
            originalName: file.originalname,
            path: file.path,
            size: file.size,
            mimeType: file.mimetype,
            user: userId,
        });
        await newFile.save();
        await UserModel.findOneAndUpdate({ id: userId }, { pdf: file.path });
        res.status(200).send({ message: 'PDF saved to user profile successfully.' });
    } catch (err) {
        res.status(500).send({ message: 'Error saving PDF to user profile.', error: err });
    }
};

export const getFileByIdHandler = async (req: Request, res: Response) => {
    const fileId = req.params.fileId;
    try {
        const file = await FileModel.findById(fileId);
        if (!file) {
            return res.status(404).send({ message: 'File not found.' });
        }
        res.status(200).send(file);
    } catch (err) {
        res.status(500).send({ message: 'Error retrieving file.', error: err });
    }
};

export const downloadFileByIdHandler = async (req: Request, res: Response) => {
    const fileId = req.params.fileId;
    try {
        const file = await FileModel.findOne({ _id: fileId });
        if (!file) {
            return res.status(404).send('No file exists with that ID');
        }
        const filePath = path.resolve(__dirname, '..', '..', 'uploads', file?.fileName || '');
        if (!fs.existsSync(filePath)) {
            return res.status(404).send('No file exists at the specified path');
        }
        res.setHeader('Content-Type', 'application/pdf');
        return res.download(filePath, file.originalName);
    } catch (err) {
        return res.status(500).send('Server error');
    }
};

export const getFilesByUserIdHandler = async (req: Request, res: Response) => {
    const userId = req.params.userId.toString();
    try {
        const files = await FileModel.find({ user: userId });
        if (!files) {
            return res.status(404).send({ message: 'No files found for this user.' });
        }
        res.status(200).send(files);
    } catch (err) {
        res.status(500).send({ message: 'Error retrieving files.', error: err });
    }
};
