export interface UserFile {
  _id: string;
  fileName: string;
  path: string;
  size: number;
  mimeType: string;
  user: string;
  originalName: string;
}
