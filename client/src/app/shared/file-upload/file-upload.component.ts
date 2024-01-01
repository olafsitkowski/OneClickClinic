import { Component, Input, Output, EventEmitter } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss'],
})
export class FileUploadComponent {
  @Input() public height: number = 0;
  @Input() public width: number = 0;
  @Input() public extension: 'doc' | 'img' | 'pdf' = 'pdf';
  @Output() public fileEmit: EventEmitter<File> = new EventEmitter<File>(
    undefined
  );
  public isDragging: boolean = false;

  constructor(
    private toastr: ToastrService,
    private translate: TranslateService
  ) {}

  public handleFileInput(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const files: FileList | null = inputElement.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (this.isValidFileType(file)) {
        this.fileEmit.emit(file);
      } else {
        this.toastr.error(
          this.translate.instant('INVALID_FILE_TYPE', {
            extension: this.extension,
          })
        );
      }
    }
  }

  public handleDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;

    if (event.dataTransfer?.files) {
      const files: FileList = event.dataTransfer?.files;
      if (files && files.length > 0) {
        const file = files[0];
        if (this.isValidFileType(file)) {
          this.fileEmit.emit(file);
        } else {
          this.toastr.error(
            this.translate.instant('INVALID_FILE_TYPE', {
              extension: this.extension,
            })
          );
        }
      }
    }
  }

  public handleDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = true;
  }

  public handleDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;
  }

  public browseFiles(): void {
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    if (fileInput) {
      fileInput.click();
    }
  }

  private isValidFileType(file: File): boolean {
    switch (this.extension) {
      case 'pdf':
        return file.type === 'application/pdf';
      case 'img':
        return file.type === 'image/png' || file.type === 'image/jpeg';
      case 'doc':
        return (
          file.type ===
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
          file.type === 'application/msword'
        );
      default:
        return false;
    }
  }
}
