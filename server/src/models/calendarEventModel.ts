import mongoose, { Schema, Document } from 'mongoose';

export interface CalendarEvent extends Document {
    _id: number;
    id: { type: Number };
    employeeId?: number;
    patientId?: number;
    start: Date;
    end?: Date;
    title: string;
    allDay?: boolean;
    cssClass?: string;
    resizable?: {
        beforeStart?: boolean;
        afterEnd?: boolean;
    };
    draggable?: boolean;
    reason?: string;
    color?: EventColor;
    actions?: any;
    type?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface EventColor {
    primary: string;
    secondary: string;
    secondaryText?: string;
}

const calendarEventSchema: Schema = new Schema({
    id: Number,
    employeeId: Number,
    patientId: Number,
    start: { type: Date, required: true },
    end: Date,
    title: { type: String, required: true },
    allDay: Boolean,
    cssClass: String,
    resizable: {
        beforeStart: Boolean,
        afterEnd: Boolean
    },
    draggable: Boolean,
    reason: String,
    color: {
        primary: String,
        secondary: String,
        secondaryText: String
    },
    actions: Schema.Types.Mixed,
    type: String
});

export default mongoose.model<CalendarEvent>('CalendarEvent', calendarEventSchema);
