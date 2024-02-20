import mongoose from 'mongoose';

const IdCounterSchema = new mongoose.Schema({
  count: { type: Number, default: 0 },
});

export const IdCounter = mongoose.model('IdCounter', IdCounterSchema);