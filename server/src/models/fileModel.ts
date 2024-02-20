import { Schema, model } from 'mongoose';

const FileSchema = new Schema({
  fileName: String,
  path: String,
  size: Number,
  mimeType: String,
  user: Number,
  originalName: { type: String, required: true },
});

const FileModel = model('File', FileSchema);

export default FileModel;