import mongoose, { Schema } from 'mongoose';

const SpecializationSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    description: { type: String }
});

export const Specialization = mongoose.model('Specialization', SpecializationSchema);
export const getSpecializationList = () => Specialization.find().select('name description');
