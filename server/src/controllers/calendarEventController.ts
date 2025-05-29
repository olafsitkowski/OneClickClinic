import { Request, Response } from 'express';
import CalendarEventModel, { CalendarEvent } from '../models/calendarEventModel';

export const getAllEvents = async (req: Request, res: Response) => {
    try {
        const events = await CalendarEventModel.find();
        res.json(events);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

export const getEventById = async (req: Request, res: Response) => {
    try {
        const event = await CalendarEventModel.findById(req.params.id);
        if (event) {
            res.json(event);
        } else {
            res.status(404).json({ message: 'Event not found' });
        }
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

export const createEvent = async (req: Request, res: Response) => {
    const eventData: CalendarEvent = req.body;

    if (!eventData.title || !eventData.start || !eventData.end || !eventData.patientId || !eventData.employeeId || !eventData.type) {
        return res.status(400).json({ message: 'Incomplete event data' });
    }

    try {
        const createdEvent = await CalendarEventModel.create({
            title: eventData.title,
            start: eventData.start,
            end: eventData.end,
            patientId: eventData.patientId,
            employeeId: eventData.employeeId,
            type: eventData.type,
            draggable: eventData.draggable,
            resizable: eventData.resizable
        });

        res.status(201).json(createdEvent);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

export const editEventById = async (req: Request, res: Response) => {
    const { id } = req.params;
    const eventData: Partial<CalendarEvent> = req.body;

    try {
        const event = await CalendarEventModel.findById(id);

        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        const updatedEvent = await CalendarEventModel.findByIdAndUpdate(id, { $set: eventData }, { new: true });

        res.status(200).json(updatedEvent);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

export const deleteEvent = async (req: Request, res: Response) => {
    try {
        await CalendarEventModel.findByIdAndDelete(req.params.id);
        res.status(204).send({ message: 'Event deleted' });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

export const getEventsByUserId = async (req: Request, res: Response) => {
    const userId = req.params.userId;

    try {
        let events: CalendarEvent[];

        if (userId) {
            events = await CalendarEventModel.find({ employeeId: userId });
        } else {
            events = await CalendarEventModel.find();
        }

        res.status(200).json(events);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

export const getCurrentEvents = async (req: Request, res: Response) => {
    console.log('getCurrentEvents');
    try {
        const currentDate = new Date();
        const events = await CalendarEventModel.find({ start: { $gte: currentDate } });
        res.status(200).json(events);
    } catch (err) {
        console.error('Error fetching events:', err);
        res.status(500).json({ message: 'Server error' });
    }
};