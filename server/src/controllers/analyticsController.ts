import express from 'express';

import { getAvailableDoctors, getReservedSlots } from '../services/slotService';

const generateNext10Days = (): string[] => {
    const dates: string[] = [];
    let i = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    while (dates.length < 10) {
        const date = new Date(today.getTime());
        date.setDate(date.getDate() + i);
        const day = date.getUTCDay();
        if (day !== 0 && day !== 6) {
            dates.push(date.toISOString().split('T')[0]);
        }
        i++;
        if (i > 30) break;
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