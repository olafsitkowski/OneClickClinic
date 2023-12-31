import calendarEventModel from '../models/calendarEventModel';
import { UserModel } from '../models/userModel';

export async function getAvailableDoctors(date: string) {
    const dateObj = new Date(date);
    const startOfDay = new Date(dateObj.getFullYear(), dateObj.getMonth(), dateObj.getDate());
    const endOfDay = new Date(dateObj.getFullYear(), dateObj.getMonth(), dateObj.getDate() + 1);

    const allDoctors = await UserModel.find({ 'profile.role': 'doctor' }).exec();
    let totalAvailableSlots = 0;

    for (const doctor of allDoctors) {
        const appointments = await calendarEventModel
            .find({
                start: {
                    $gte: startOfDay,
                    $lt: endOfDay
                },
                employeeId: doctor.id
            })
            .exec();

        const occupiedSlots = appointments.map((a) => a.end ? Math.round((a.end.getTime() - a.start.getTime()) / (1000 * 60 * 30)) : 2);
        const totalOccupiedSlots = occupiedSlots.reduce((a, b) => a + b, 0);

        const doctorAvailableSlots = Math.max(15 - totalOccupiedSlots, 0);
        totalAvailableSlots += doctorAvailableSlots;
    }

    return totalAvailableSlots;
}

export async function getReservedSlots(date: string) {
    const dateObj = new Date(date);
    const startOfDay = new Date(dateObj.getFullYear(), dateObj.getMonth(), dateObj.getDate());
    const endOfDay = new Date(dateObj.getFullYear(), dateObj.getMonth(), dateObj.getDate() + 1);

    const appointments = await calendarEventModel
        .find({
            start: {
                $gte: startOfDay,
                $lt: endOfDay
            }
        })
        .exec();

    const occupiedSlots = appointments.map((a) => a.end ? Math.ceil((a.end.getTime() - a.start.getTime()) / (1000 * 60 * 30)) : 2);
    const totalOccupiedSlots = occupiedSlots.reduce((a, b) => a + b, 0);
    return totalOccupiedSlots;
}