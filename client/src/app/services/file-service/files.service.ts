import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserFile } from 'src/interfaces/File';

@Injectable({
  providedIn: 'root',
})
export class FilesService {
  private readonly API_URL = 'http://localhost:8080';
  constructor(private http: HttpClient) {}

  public uploadFile(file: File, userId: number): Observable<File> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<File>(`${this.API_URL}/files/${userId}`, formData);
  }

  public getFilesByUserId(userId: number): Observable<File[]> {
    return this.http.get<File[]>(`${this.API_URL}/files/user/${userId}`);
  }

  public downloadFile(file: UserFile): Observable<Blob> {
    return this.http.get(`${this.API_URL}/files/download/${file._id}`, {
      responseType: 'blob',
    });
  }
}
