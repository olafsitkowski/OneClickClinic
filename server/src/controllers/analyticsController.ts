import express from 'express';

import { getAvailableDoctors, getReservedSlots } from '../services/slotService';

const generateNext10Days = (): string[] => {
    const dates: string[] = [];
    let i = 0;

    while (dates.length < 10) {
        const date = new Date();
        date.setDate(date.getDate() + i);
        if (date.getDay() !== 0 && date.getDay() !== 6) {
            dates.push(date.toISOString().split('T')[0]);
        }
        i++;
    }

    return dates;
}

export const getAvailableSlots = async (req: express.Request, res: express.Response) => {
    const dates = generateNext10Days();
    const result: { labels: string[], datasets: { busySlots: string[], availableSlots: string[] }[] } = {
        labels: [],
        datasets: [
            { busySlots: [], availableSlots: [] }
        ]
    };
    
    for (const date of dates) {
        const availableSlotsPerDay = await getAvailableDoctors(date);
        const reservedSlots = await getReservedSlots(date);
        const availableSlots = availableSlotsPerDay;
        
        result.labels.push(date);
        result.datasets[0].busySlots.push(String(reservedSlots));
        result.datasets[0].availableSlots.push(String(availableSlots));
    }

    res.json(result);
};

export default {
    getAvailableSlots
};