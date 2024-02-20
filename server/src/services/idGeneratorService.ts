import { IdCounter } from '../models/IdCounter';

export const generateUniqueId = async () => {
  const idCounter = await IdCounter.findOneAndUpdate({}, { $inc: { count: 1 } }, { new: true, upsert: true });
  return idCounter.count;
};