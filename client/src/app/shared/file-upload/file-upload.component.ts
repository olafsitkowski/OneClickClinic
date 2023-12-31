import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss'],
})
export class FileUploadComponent {
  @Input() public height: number = 0;
  @Input() public width: number = 0;
  @Output() public fileEmit: EventEmitter<File> = new EventEmitter<File>(
    undefined
  );
  public isDragging: boolean = false;

  public handleFileInput(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const files: FileList | null = inputElement.files;
    if (files && files.length > 0) {
      this.fileEmit.emit(files[0]);
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

  public handleDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;

    if (event.dataTransfer?.files) {
      const files: FileList = event.dataTransfer?.files;
      if (files && files.length > 0) {
        this.fileEmit.emit(files[0]);
      }
    }
  }

  public browseFiles(): void {
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    if (fileInput) {
      fileInput.click();
    }
  }
}
